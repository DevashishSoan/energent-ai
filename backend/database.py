"""
Database layer for Energent AI.
Uses SQLite to persist workload runs so history survives restarts.
"""
import sqlite3
import json
import logging
from typing import Any

logger = logging.getLogger(__name__)
DB_PATH = "runs.db"

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False, timeout=30.0)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the database schema if it doesn't exist."""
    conn = sqlite3.connect(DB_PATH)
    try:
        # Set WAL mode once
        conn.execute('PRAGMA journal_mode=WAL;')
        c = conn.cursor()
        c.execute('''
            CREATE TABLE IF NOT EXISTS runs (
                run_id TEXT PRIMARY KEY,
                data JSON NOT NULL,
                started_at INTEGER,
                status TEXT
            )
        ''')
        conn.commit()
    finally:
        conn.close()

def save_run(run: dict):
    """Upsert a run into the database."""
    conn = get_db()
    try:
        data_json = json.dumps(run)
        conn.execute('''
            INSERT INTO runs (run_id, data, started_at, status) 
            VALUES (?, ?, ?, ?)
            ON CONFLICT(run_id) DO UPDATE SET
                data = excluded.data,
                status = excluded.status
        ''', (run["run_id"], data_json, run["started_at"], run["status"]))
        conn.commit()
    except Exception as e:
        logger.error(f"DB Save Error: {e}")
    finally:
        conn.close()

def get_run(run_id: str) -> dict | None:
    """Fetch a single run by ID."""
    conn = get_db()
    try:
        row = conn.execute('SELECT data FROM runs WHERE run_id = ?', (run_id,)).fetchone()
        if row:
            return json.loads(row["data"])
        return None
    finally:
        conn.close()

def get_history(limit: int = 50) -> list[dict]:
    """Fetch recently completed runs."""
    conn = get_db()
    try:
        rows = conn.execute('''
            SELECT data FROM runs 
            WHERE status = 'complete' 
            ORDER BY started_at DESC 
            LIMIT ?
        ''', (limit,)).fetchall()
        return [json.loads(row["data"]) for row in rows]
    finally:
        conn.close()

# Initialize on module load
try:
    init_db()
except Exception as e:
    logger.error(f"Failed to init DB: {e}")

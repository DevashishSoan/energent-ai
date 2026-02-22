# ── Stage 1: Build Frontend ───────────────────────────────────────────────────
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
# Set production APl base to relative path so it uses the same host
ENV VITE_API_BASE=/
RUN npm run build

# ── Stage 2: Python Backend ───────────────────────────────────────────────────
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies (for psutil, etc if needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy backend deps
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt uvicorn

# Copy backend code
COPY backend/ ./backend/

# Copy built frontend assets
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Environment variables
ENV PORT=8000
# Tell main.py where to find static files if relative paths differ, 
# but currently main.py looks at ../frontend/dist from __file__
# /app/backend/main.py -> /app/frontend/dist is correct structure.

WORKDIR /app/backend
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

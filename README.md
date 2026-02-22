# Energent AI

**Energent AI** is a real-time energy profiling and sustainability analytics engine for AI workloads, specifically optimized for AMD hardware (Ryzen™ AI).

## 🌍 Overview

As AI models grow in complexity, their environmental impact becomes a critical concern. Energent AI provides developers with the telemetry tools needed to measure, visualize, and reduce the carbon footprint of their neural networks.

## 🚀 Key Features

- **Real-time Telemetry**: Monitor power consumption (Watts) across GPU, CPU, and NPU.
- **Sustainability Analytics**: Calculate CO₂ emissions based on live grid intensity data.
- **Optimization Engine**: Get actionable suggestions to reduce energy usage through precision adjustments (FP16, INT8) and hardware dispatch (NPU).
- **Predictive Modeling**: Estimate energy costs before running a workload.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Chart.js.
- **Backend**: FastAPI (Python), WebSocket, SQLite.
- **Hardware Integration**: ROCm (AMD GPU), RAPL (CPU), Ryzen AI NPU.
- **Data Source**: Electricity Maps API (Carbon Intensity).

## 📦 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- AMD Hardware (Optional, but required for hardware-specific telemetry)

### 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DevashishSoan/energent-ai.git
   cd energent-ai
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python main.py
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 🐳 Docker Support

You can also run Energent AI using Docker Compose:
```bash
docker-compose up --build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

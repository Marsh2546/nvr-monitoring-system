# CCTV NVR Monitor - Frontend

React frontend application for CCTV NVR monitoring system.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🐳 Docker Deployment

Build and run with Docker:
```bash
docker build -t cctv-nvr-frontend .
docker run -p 3000:80 cctv-nvr-frontend
```

Or use docker-compose with the backend:
```bash
docker-compose -f ../docker-compose.separated.yml up frontend
```

## 🔧 Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:3001)
- `VITE_API_FALLBACK_URL` - Fallback API URL

## 📁 Project Structure

```
src/
├── app/
│   ├── components/     # React components
│   ├── services/       # API services
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
├── styles/            # CSS styles
└── main.tsx          # App entry point
```

## 🔗 Backend Integration

This frontend communicates with the backend API through the following endpoints:

- `/api/nvr-status` - Get NVR status data
- `/api/cameras` - Get camera information
- `/api/snapshots` - Get snapshot data
- `/api/snapshot-logs` - Get snapshot logs

Make sure the backend server is running on the configured API URL.

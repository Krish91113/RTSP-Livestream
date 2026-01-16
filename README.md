# StreamOverlay Pro: Real-time RTSP Management

A professional fullstack application for managing live stream graphics dynamically with RTSP overlay support. Features a modern React frontend and robust Python Flask backend with MongoDB persistence.

## 🏗️ Project Structure

```
stream-overlay-hub/
├── frontend/          # React + Vite + TypeScript frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── backend/           # Python Flask REST API
│   ├── app.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .gitignore
└── README.md
```

## ✨ Features

- **Real-time RTSP Stream Management**: Configure and manage RTSP stream URLs dynamically
- **Overlay CRUD Operations**: Create, read, update, and delete graphic overlays
- **MongoDB Persistence**: All overlays persist across page refreshes
- **RESTful API**: Clean REST API architecture with proper error handling
- **CORS Enabled**: Seamless frontend-backend communication
- **Modern UI**: Professional, dark-themed SaaS interface built with React and Tailwind CSS

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (local installation, Atlas, or Docker)
- **npm** or **bun** package manager

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your configuration:
   # MONGO_URI=mongodb://localhost:27017/rtsp_overlay_db
   # RTSP_URL=rtsp://your-rtsp-stream-url-here
   ```

5. **Start the Flask server:**
   ```bash
   python app.py
   ```

   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

   The application will be available at `http://localhost:5173`

## 📡 API Endpoints

### Overlays

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/overlays` | Retrieve all overlays |
| `POST` | `/api/overlays` | Create a new overlay |
| `PUT` | `/api/overlays/<id>` | Update an existing overlay |
| `DELETE` | `/api/overlays/<id>` | Delete an overlay |

### Configuration

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/config` | Get RTSP URL configuration |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Check API health status |

### Example API Usage

**Create an overlay:**
```bash
curl -X POST http://localhost:5000/api/overlays \
  -H "Content-Type: application/json" \
  -d '{
    "x": 100,
    "y": 200,
    "width": 300,
    "height": 150,
    "type": "text",
    "content": "Live Stream Title"
  }'
```

**Get all overlays:**
```bash
curl http://localhost:5000/api/overlays
```

**Update an overlay:**
```bash
curl -X PUT http://localhost:5000/api/overlays/<overlay-id> \
  -H "Content-Type: application/json" \
  -d '{"x": 150, "y": 250}'
```

**Delete an overlay:**
```bash
curl -X DELETE http://localhost:5000/api/overlays/<overlay-id>
```

## 🗄️ MongoDB Setup

### Option 1: Local MongoDB

1. [Download and install MongoDB](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Update `.env` with: `MONGO_URI=mongodb://localhost:27017/rtsp_overlay_db`

### Option 2: MongoDB Atlas (Cloud - Free Tier)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `.env` with your Atlas connection string

### Option 3: Docker

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 🎨 Frontend Features

- **Landing Page**: Professional hero section with CTA button
- **Navigation**: Intuitive routing between Home and Dashboard
- **Dashboard**: Interactive video player with overlay management
- **Responsive Design**: Optimized for all screen sizes
- **Dark Theme**: Modern, high-end SaaS aesthetic

## 🛠️ Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend
- Python 3.8+
- Flask
- Flask-PyMongo
- Flask-CORS
- python-dotenv

### Database
- MongoDB

## 📝 Development Workflow

1. **Start Backend:**
   ```bash
   cd backend
   python app.py
   ```

2. **Start Frontend (in new terminal):**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access Application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Health: http://localhost:5000/api/health

## 🔒 Environment Variables

### Backend (.env)

```env
MONGO_URI=mongodb://localhost:27017/rtsp_overlay_db
RTSP_URL=rtsp://your-rtsp-stream-url-here
FLASK_ENV=development
```

## 🚨 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access (for Atlas)

### CORS Errors
- Ensure frontend URL is in CORS origins list
- Check both servers are running

### Port Conflicts
- Backend default: 5000
- Frontend default: 5173
- Change ports in respective config files if needed

## 📦 Production Deployment

### Backend
- Use a production WSGI server (Gunicorn, uWSGI)
- Set `FLASK_ENV=production`
- Use secure MongoDB credentials
- Enable HTTPS

### Frontend
```bash
cd frontend
npm run build
# Deploy the 'dist' folder to your hosting service
```

## 📄 License

This project is part of an internship assignment.

## 🤝 Contributing

For internship assignment purposes only.

---

**Built with ❤️ using React, Flask, and MongoDB**

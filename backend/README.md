# Backend - Flask REST API

Python Flask backend for StreamOverlay Pro with MongoDB integration.

## 🚀 Quick Start

1. **Create virtual environment:**
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   # source venv/bin/activate  # macOS/Linux
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and RTSP URL
   ```

4. **Run the server:**
   ```bash
   python app.py
   ```

Server runs on `http://localhost:5000`

## 📡 API Endpoints

### Overlays Management

#### GET `/api/overlays`
Retrieve all overlays from the database.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "x": 100,
    "y": 200,
    "width": 300,
    "height": 150,
    "type": "text",
    "content": "Live Stream Title"
  }
]
```

#### POST `/api/overlays`
Create a new overlay.

**Request Body:**
```json
{
  "x": 100,
  "y": 200,
  "width": 300,
  "height": 150,
  "type": "text",
  "content": "Live Stream Title"
}
```

**Response:** Created overlay with `_id`

#### PUT `/api/overlays/<id>`
Update an existing overlay.

**Request Body:**
```json
{
  "x": 150,
  "y": 250
}
```

**Response:** Updated overlay

#### DELETE `/api/overlays/<id>`
Delete an overlay.

**Response:**
```json
{
  "message": "Overlay deleted successfully"
}
```

### Configuration

#### GET `/api/config`
Get RTSP URL configuration.

**Response:**
```json
{
  "rtsp_url": "rtsp://your-stream-url"
}
```

### Health Check

#### GET `/api/health`
Check API status.

**Response:**
```json
{
  "status": "healthy",
  "message": "RTSP Overlay API is running"
}
```

## 🗄️ Database Schema

### Overlays Collection

```javascript
{
  _id: ObjectId,
  x: Number,        // X position
  y: Number,        // Y position
  width: Number,    // Overlay width
  height: Number,   // Overlay height
  type: String,     // Overlay type (text, image, etc.)
  content: String   // Overlay content
}
```

## 🔧 Environment Variables

```env
MONGO_URI=mongodb://localhost:27017/rtsp_overlay_db
RTSP_URL=rtsp://your-rtsp-stream-url-here
FLASK_ENV=development
```

## 🛠️ Technologies

- **Flask** - Web framework
- **Flask-PyMongo** - MongoDB integration
- **Flask-CORS** - Cross-origin resource sharing
- **python-dotenv** - Environment management

## 📦 Dependencies

See [requirements.txt](requirements.txt) for all dependencies.

## 🔒 Security Notes

- Never commit `.env` file
- Use strong MongoDB credentials in production
- Enable HTTPS in production
- Validate all user inputs

## 🚨 Troubleshooting

**Issue:** MongoDB connection failed
- **Solution:** Check MongoDB is running and connection string is correct

**Issue:** CORS errors
- **Solution:** Verify frontend URL is in CORS origins list

**Issue:** Module not found
- **Solution:** Ensure virtual environment is activated and dependencies installed

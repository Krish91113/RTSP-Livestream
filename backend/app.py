from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import ObjectId
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)

# MongoDB configuration
app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/rtsp_overlay_db")
mongo = PyMongo(app)

# CORS configuration - allow requests from frontend
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173","http://localhost:8080", "http://localhost:3000", "http://localhost:8081"]}})

# Helper function to serialize MongoDB documents
def serialize_overlay(overlay):
    """Convert MongoDB document to JSON-serializable dict"""
    if overlay:
        overlay['_id'] = str(overlay['_id'])
    return overlay

@app.route('/api/overlays', methods=['GET'])
def get_overlays():
    """Retrieve all overlays from the database"""
    try:
        overlays = list(mongo.db.overlays.find())
        return jsonify([serialize_overlay(overlay) for overlay in overlays]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/overlays', methods=['POST'])
def create_overlay():
    """Create a new overlay"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['x', 'y', 'width', 'height', 'type', 'content']
        # Optional fields: fontSize, fontColor, opacity, zIndex
        
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Create overlay document
        overlay = {
            'x': data['x'],
            'y': data['y'],
            'width': data['width'],
            'height': data['height'],
            'type': data['type'],
            'content': data['content'],
            'fontSize': data.get('fontSize'),
            'fontColor': data.get('fontColor'),
            'opacity': data.get('opacity'),
            'zIndex': data.get('zIndex')
        }
        
        # Insert into database
        result = mongo.db.overlays.insert_one(overlay)
        overlay['_id'] = str(result.inserted_id)
        
        return jsonify(overlay), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/overlays/<overlay_id>', methods=['PUT'])
def update_overlay(overlay_id):
    """Update an existing overlay by ID"""
    try:
        data = request.get_json()
        
        # Build update document
        update_fields = {}
        allowed_fields = ['x', 'y', 'width', 'height', 'type', 'content', 'fontSize', 'fontColor', 'opacity', 'zIndex']
        for field in allowed_fields:
            if field in data:
                update_fields[field] = data[field]
        
        if not update_fields:
            return jsonify({"error": "No valid fields to update"}), 400
        
        # Update in database
        result = mongo.db.overlays.update_one(
            {'_id': ObjectId(overlay_id)},
            {'$set': update_fields}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Overlay not found"}), 404
        
        # Fetch and return updated overlay
        overlay = mongo.db.overlays.find_one({'_id': ObjectId(overlay_id)})
        return jsonify(serialize_overlay(overlay)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/overlays/<overlay_id>', methods=['DELETE'])
def delete_overlay(overlay_id):
    """Delete an overlay by ID"""
    try:
        result = mongo.db.overlays.delete_one({'_id': ObjectId(overlay_id)})
        
        if result.deleted_count == 0:
            return jsonify({"error": "Overlay not found"}), 404
        
        return jsonify({"message": "Overlay deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/config', methods=['GET'])
def get_config():
    """Return RTSP configuration"""
    try:
        rtsp_url = os.getenv("RTSP_URL", "rtsp://default-stream-url")
        return jsonify({"rtsp_url": rtsp_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "RTSP Overlay API is running"}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

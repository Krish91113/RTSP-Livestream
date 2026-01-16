// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface Overlay {
  _id?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  content: string;
  fontSize?: number;
  fontColor?: string;
  opacity?: number;
  zIndex?: number;
  rotation?: number;
}

export interface Config {
  rtsp_url: string;
}

// API Service for overlay management
export const api = {
  // Get all overlays
  async getOverlays(): Promise<Overlay[]> {
    const response = await fetch(`${API_BASE_URL}/api/overlays`);
    if (!response.ok) throw new Error('Failed to fetch overlays');
    return response.json();
  },

  // Create new overlay
  async createOverlay(overlay: Omit<Overlay, '_id'>): Promise<Overlay> {
    const response = await fetch(`${API_BASE_URL}/api/overlays`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(overlay),
    });
    if (!response.ok) throw new Error('Failed to create overlay');
    return response.json();
  },

  // Update overlay
  async updateOverlay(id: string, overlay: Partial<Overlay>): Promise<Overlay> {
    const response = await fetch(`${API_BASE_URL}/api/overlays/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(overlay),
    });
    if (!response.ok) throw new Error('Failed to update overlay');
    return response.json();
  },

  // Delete overlay
  async deleteOverlay(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/overlays/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete overlay');
  },

  // Get configuration (RTSP URL)
  async getConfig(): Promise<Config> {
    const response = await fetch(`${API_BASE_URL}/api/config`);
    if (!response.ok) throw new Error('Failed to fetch config');
    return response.json();
  },

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) throw new Error('API health check failed');
    return response.json();
  },
};

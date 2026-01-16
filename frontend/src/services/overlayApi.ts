import { Overlay, StreamConfig } from '@/types/overlay';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Placeholder API service for Python/Flask backend integration
// Replace these with actual API calls when backend is ready

export const overlayApi = {
  // GET /api/overlays - Fetch all overlays
  async getOverlays(): Promise<Overlay[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/overlays`);
      if (!response.ok) throw new Error('Failed to fetch overlays');
      return response.json();
    } catch (error) {
      console.log('API not available, using local state');
      return [];
    }
  },

  // POST /api/overlays - Create new overlay
  async createOverlay(overlay: Omit<Overlay, 'id' | 'createdAt' | 'updatedAt'>): Promise<Overlay> {
    try {
      const response = await fetch(`${API_BASE_URL}/overlays`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(overlay),
      });
      if (!response.ok) throw new Error('Failed to create overlay');
      return response.json();
    } catch (error) {
      console.log('API not available, creating locally');
      throw error;
    }
  },

  // PUT /api/overlays/:id - Update overlay
  async updateOverlay(id: string, updates: Partial<Overlay>): Promise<Overlay> {
    try {
      const response = await fetch(`${API_BASE_URL}/overlays/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update overlay');
      return response.json();
    } catch (error) {
      console.log('API not available, updating locally');
      throw error;
    }
  },

  // DELETE /api/overlays/:id - Delete overlay
  async deleteOverlay(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/overlays/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete overlay');
    } catch (error) {
      console.log('API not available, deleting locally');
      throw error;
    }
  },

  // GET /api/stream - Get stream configuration
  async getStreamConfig(): Promise<StreamConfig> {
    try {
      const response = await fetch(`${API_BASE_URL}/stream`);
      if (!response.ok) throw new Error('Failed to fetch stream config');
      return response.json();
    } catch (error) {
      console.log('API not available, using default config');
      return {
        url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        isLive: false,
        title: 'Demo Stream',
      };
    }
  },

  // PUT /api/stream - Update stream configuration
  async updateStreamConfig(config: Partial<StreamConfig>): Promise<StreamConfig> {
    try {
      const response = await fetch(`${API_BASE_URL}/stream`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Failed to update stream config');
      return response.json();
    } catch (error) {
      console.log('API not available, updating locally');
      throw error;
    }
  },
};

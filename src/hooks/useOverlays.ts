import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Overlay, OverlayType, StreamConfig } from '@/types/overlay';

const DEFAULT_STREAM_CONFIG: StreamConfig = {
  url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  isLive: false,
  title: 'Demo Stream',
};

const INITIAL_OVERLAYS: Overlay[] = [
  {
    id: uuidv4(),
    type: 'text',
    content: 'LIVE',
    x: 5,
    y: 5,
    width: 10,
    height: 6,
    fontSize: 18,
    fontColor: '#ef4444',
    opacity: 100,
    zIndex: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    type: 'text',
    content: 'Camera 01',
    x: 75,
    y: 90,
    width: 20,
    height: 5,
    fontSize: 14,
    fontColor: '#ffffff',
    opacity: 80,
    zIndex: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function useOverlays() {
  const [overlays, setOverlays] = useState<Overlay[]>(INITIAL_OVERLAYS);
  const [selectedOverlayId, setSelectedOverlayId] = useState<string | null>(null);
  const [streamConfig, setStreamConfig] = useState<StreamConfig>(DEFAULT_STREAM_CONFIG);

  const addOverlay = useCallback((type: OverlayType, content: string) => {
    const newOverlay: Overlay = {
      id: uuidv4(),
      type,
      content,
      x: 10,
      y: 10,
      width: type === 'text' ? 20 : 25,
      height: type === 'text' ? 8 : 20,
      fontSize: 16,
      fontColor: '#ffffff',
      opacity: 100,
      zIndex: overlays.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOverlays((prev) => [...prev, newOverlay]);
    setSelectedOverlayId(newOverlay.id);
    return newOverlay;
  }, [overlays.length]);

  const updateOverlay = useCallback((id: string, updates: Partial<Overlay>) => {
    setOverlays((prev) =>
      prev.map((overlay) =>
        overlay.id === id
          ? { ...overlay, ...updates, updatedAt: new Date().toISOString() }
          : overlay
      )
    );
  }, []);

  const deleteOverlay = useCallback((id: string) => {
    setOverlays((prev) => prev.filter((overlay) => overlay.id !== id));
    if (selectedOverlayId === id) {
      setSelectedOverlayId(null);
    }
  }, [selectedOverlayId]);

  const selectOverlay = useCallback((id: string | null) => {
    setSelectedOverlayId(id);
  }, []);

  const updateStreamUrl = useCallback((url: string) => {
    setStreamConfig((prev) => ({ ...prev, url }));
  }, []);

  const toggleLiveStatus = useCallback(() => {
    setStreamConfig((prev) => ({ ...prev, isLive: !prev.isLive }));
  }, []);

  const selectedOverlay = overlays.find((o) => o.id === selectedOverlayId) || null;

  return {
    overlays,
    selectedOverlay,
    selectedOverlayId,
    streamConfig,
    addOverlay,
    updateOverlay,
    deleteOverlay,
    selectOverlay,
    updateStreamUrl,
    toggleLiveStatus,
  };
}

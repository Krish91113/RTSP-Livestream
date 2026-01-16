export type OverlayType = 'text' | 'image';

export interface Overlay {
  id: string;
  type: OverlayType;
  content: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number; // percentage (0-100)
  height: number; // percentage (0-100)
  fontSize?: number;
  fontColor?: string;
  opacity?: number;
  rotation?: number;
  zIndex?: number;
  createdAt: string;
  updatedAt: string;
}

export interface StreamConfig {
  url: string;
  isLive: boolean;
  title?: string;
}

export interface OverlayState {
  overlays: Overlay[];
  selectedOverlayId: string | null;
  streamConfig: StreamConfig;
}

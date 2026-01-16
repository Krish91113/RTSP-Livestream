import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Overlay, OverlayType, StreamConfig } from '@/types/overlay';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_STREAM_CONFIG: StreamConfig = {
  url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  isLive: true,
  title: 'Demo Video Stream',
};

export function useOverlays() {
  const [selectedOverlayId, setSelectedOverlayId] = useState<string | null>(null);
  const [streamConfig, setStreamConfig] = useState<StreamConfig>(DEFAULT_STREAM_CONFIG);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch stream config from backend
  useEffect(() => {
    api.getConfig()
      .then(config => {
        // Only update URL if backend provides a valid, non-placeholder URL
        const backendUrl = config.rtsp_url;
        const isPlaceholder = !backendUrl ||
          backendUrl.includes('default-stream') ||
          backendUrl.includes('your-rtsp-stream') ||
          backendUrl === 'rtsp://localhost:8554/mystream';

        if (backendUrl && !isPlaceholder) {
          setStreamConfig(prev => ({
            ...prev,
            url: backendUrl,
          }));
        }
        // Otherwise keep the default Big Buck Bunny URL from initial state
      })
      .catch(error => {
        console.error('Failed to load stream config:', error);
        // Keep default URL on error
      });
  }, [toast]);

  // Fetch overlays from API with React Query
  const { data: overlays = [], isLoading, error } = useQuery({
    queryKey: ['overlays'],
    queryFn: api.getOverlays,
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  // Show error toast if query fails
  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Connection Error',
        description: 'Failed to load overlays from server',
      });
    }
  }, [error, toast]);

  // Create overlay mutation
  const addOverlayMutation = useMutation({
    mutationFn: (data: { type: OverlayType; content: string }) => {
      const newOverlay = {
        type: data.type,
        content: data.content,
        x: 15,
        y: 15,
        width: data.type === 'text' ? 30 : 20,
        height: data.type === 'text' ? 10 : 15,
      };
      return api.createOverlay(newOverlay);
    },
    onSuccess: (newOverlay) => {
      queryClient.invalidateQueries({ queryKey: ['overlays'] });
      setSelectedOverlayId(newOverlay._id || null);
      toast({
        title: 'Overlay Created',
        description: 'Overlay has been added successfully',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Creation Failed',
        description: 'Could not create overlay',
      });
    },
  });

  // Update overlay mutation
  const updateOverlayMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Overlay> }) =>
      api.updateOverlay(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overlays'] });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update overlay',
      });
    },
  });

  // Delete overlay mutation
  const deleteOverlayMutation = useMutation({
    mutationFn: api.deleteOverlay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overlays'] });
      toast({
        title: 'Overlay Deleted',
        description: 'Overlay has been removed',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: 'Could not delete overlay',
      });
    },
  });

  const addOverlay = useCallback((type: OverlayType, content: string) => {
    addOverlayMutation.mutate({ type, content });
  }, [addOverlayMutation]);

  const updateOverlay = useCallback((id: string, updates: Partial<Overlay>) => {
    updateOverlayMutation.mutate({ id, updates });
  }, [updateOverlayMutation]);

  const deleteOverlay = useCallback((id: string) => {
    deleteOverlayMutation.mutate(id);
    if (selectedOverlayId === id) {
      setSelectedOverlayId(null);
    }
  }, [deleteOverlayMutation, selectedOverlayId]);

  const selectOverlay = useCallback((id: string | null) => {
    setSelectedOverlayId(id);
  }, []);

  const updateStreamUrl = useCallback((url: string) => {
    setStreamConfig((prev) => ({ ...prev, url }));
  }, []);

  const toggleLiveStatus = useCallback(() => {
    setStreamConfig((prev) => ({ ...prev, isLive: !prev.isLive }));
  }, []);

  const selectedOverlay = overlays.find((o) => o._id === selectedOverlayId) || null;

  // Map backend overlay format to frontend format
  const mappedOverlays = overlays.map(overlay => ({
    id: overlay._id || '',
    type: overlay.type,
    content: overlay.content,
    x: overlay.x,
    y: overlay.y,
    width: overlay.width,
    height: overlay.height,
    fontSize: overlay.fontSize || 16,
    fontColor: overlay.fontColor || '#ffffff',
    opacity: overlay.opacity !== undefined ? overlay.opacity : 100,
    zIndex: overlay.zIndex || 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  return {
    overlays: mappedOverlays,
    selectedOverlay: selectedOverlay ? {
      id: selectedOverlay._id || '',
      type: selectedOverlay.type,
      content: selectedOverlay.content,
      x: selectedOverlay.x,
      y: selectedOverlay.y,
      width: selectedOverlay.width,
      height: selectedOverlay.height,
      fontSize: selectedOverlay.fontSize || 16,
      fontColor: selectedOverlay.fontColor || '#ffffff',
      opacity: selectedOverlay.opacity !== undefined ? selectedOverlay.opacity : 100,
      zIndex: selectedOverlay.zIndex || 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } : null,
    selectedOverlayId,
    streamConfig,
    addOverlay,
    updateOverlay,
    deleteOverlay,
    selectOverlay,
    updateStreamUrl,
    toggleLiveStatus,
    isLoading,
  };
}

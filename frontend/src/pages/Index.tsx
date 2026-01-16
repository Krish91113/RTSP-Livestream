import { useOverlays } from '@/hooks/useOverlays';
import { VideoPlayer } from '@/components/VideoPlayer';
import { DraggableOverlay } from '@/components/DraggableOverlay';
import { OverlaySidebar } from '@/components/OverlaySidebar';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const {
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
    isLoading,
  } = useOverlays();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            RTSP Livestream
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time video overlay management system
          </p>
        </header>

        {/* Video Player Container */}
        <div
          className="flex-1 flex items-center justify-center"
          onClick={() => selectOverlay(null)}
        >
          <div className="w-full max-w-5xl">
            <VideoPlayer streamConfig={streamConfig}>
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <span className="text-sm text-white">Loading overlays...</span>
                  </div>
                </div>
              ) : (
                overlays.map((overlay) => (
                  <DraggableOverlay
                    key={overlay.id}
                    overlay={overlay}
                    isSelected={selectedOverlayId === overlay.id}
                    onSelect={() => selectOverlay(overlay.id)}
                    onUpdate={(updates) => updateOverlay(overlay.id, updates)}
                    onDelete={() => deleteOverlay(overlay.id)}
                  />
                ))
              )}
            </VideoPlayer>

            {/* Video Controls Info */}
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-mono">{streamConfig.url}</span>
              <span>{overlays.length} overlay(s) active</span>
            </div>
          </div>
        </div>
      </main>

      {/* Sidebar */}
      <OverlaySidebar
        overlays={overlays}
        selectedOverlay={selectedOverlay}
        streamConfig={streamConfig}
        onAddOverlay={addOverlay}
        onUpdateOverlay={updateOverlay}
        onDeleteOverlay={deleteOverlay}
        onSelectOverlay={selectOverlay}
        onUpdateStreamUrl={updateStreamUrl}
        onToggleLive={toggleLiveStatus}
      />
    </div>
  );
};

export default Index;

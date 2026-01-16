import { useRef, useState, useEffect } from 'react';
import { Radio, Volume2, VolumeX, Play, Pause, Maximize } from 'lucide-react';
import { StreamConfig } from '@/types/overlay';

interface VideoPlayerProps {
  streamConfig: StreamConfig;
  children?: React.ReactNode;
}

export function VideoPlayer({ streamConfig, children }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setHasError(false);

    if (streamConfig.isLive) {
      video.play().catch(() => {
        // Autoplay might be blocked
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }
  }, [streamConfig.url, streamConfig.isLive]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  };

  const handleVideoError = () => {
    setHasError(true);
    setIsPlaying(false);
  };

  return (
    <div className="relative w-full">
      {/* Stream Status Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
        <div
          className={`stream-status ${
            streamConfig.isLive ? 'stream-status-live' : 'stream-status-offline'
          }`}
        >
          <Radio className="w-3 h-3" />
          <span>{streamConfig.isLive ? 'LIVE' : 'OFFLINE'}</span>
        </div>
        {streamConfig.title && (
          <span className="text-sm font-medium text-foreground/70">
            {streamConfig.title}
          </span>
        )}
      </div>

      {/* Video Container */}
      <div ref={containerRef} className="player-container group">
        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-player">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Unable to load stream</p>
              <code className="text-xs text-primary/60 font-mono block max-w-sm truncate px-4">
                {streamConfig.url}
              </code>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={streamConfig.url}
            className="absolute inset-0 w-full h-full object-contain bg-black"
            muted={isMuted}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={handleVideoError}
          />
        )}

        {/* Custom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-primary" />
              ) : (
                <Play className="w-4 h-4 text-primary" />
              )}
            </button>
            <button
              onClick={toggleMute}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-primary" />
              ) : (
                <Volume2 className="w-4 h-4 text-primary" />
              )}
            </button>
            <div className="flex-1" />
            <button
              onClick={toggleFullscreen}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
            >
              <Maximize className="w-4 h-4 text-primary" />
            </button>
          </div>
        </div>

        {/* Overlay Canvas - positioned over video */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="relative w-full h-full pointer-events-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

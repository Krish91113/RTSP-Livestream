import { useRef, useState, useEffect } from 'react';
import Hls from 'hls.js';
import { Radio, Volume2, VolumeX, Play, Pause, Maximize } from 'lucide-react';
import { StreamConfig } from '@/types/overlay';
import { Slider } from "@/components/ui/slider";

interface VideoPlayerProps {
  streamConfig: StreamConfig;
  children?: React.ReactNode;
}

export function VideoPlayer({ streamConfig, children }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset error state when URL changes
    setHasError(false);

    // If no URL is provided, don't try to load anything
    if (!streamConfig.url) {
      setHasError(true);
      return;
    }

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Check if URL is HLS (.m3u8)
    if (streamConfig.url.includes('.m3u8')) {
      if (Hls.isSupported()) {
        // Use hls.js for browsers that don't natively support HLS
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });

        hls.loadSource(streamConfig.url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (streamConfig.isLive) {
            video.play().catch((err) => {
              console.error('Play error:', err);
              setIsPlaying(false);
            });
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.error('HLS Error:', data);
            setHasError(true);
            setIsPlaying(false);
          }
        });

        hlsRef.current = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = streamConfig.url;
        video.load();
        if (streamConfig.isLive) {
          video.play().catch((err) => {
            console.error('Play error:', err);
            setIsPlaying(false);
          });
        }
      } else {
        setHasError(true);
      }
    } else {
      // Regular video file (MP4, WebM, etc.)
      video.src = streamConfig.url;
      video.load(); // Explicitly load the video

      const handleCanPlay = () => {
        if (streamConfig.isLive) {
          video.play().catch((err) => {
            console.error('Play error:', err);
            setIsPlaying(false);
          });
        }
      };

      video.addEventListener('canplay', handleCanPlay, { once: true });

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
      };
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
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

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0];
    video.volume = newVolume;
    setVolume(newVolume);

    if (newVolume > 0 && isMuted) {
      video.muted = false;
      setIsMuted(false);
    } else if (newVolume === 0 && !isMuted) {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const newMutedState = !video.muted;
    video.muted = newMutedState;
    setIsMuted(newMutedState);

    if (newMutedState) {
      setVolume(0);
    } else {
      // Restore previous volume or default to 1
      const restoreVolume = volume === 0 ? 1 : volume;
      setVolume(restoreVolume);
      video.volume = restoreVolume;
    }
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
          className={`stream-status ${streamConfig.isLive ? 'stream-status-live' : 'stream-status-offline'
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
              <p className="text-xs text-muted-foreground mt-2">
                {streamConfig.url.includes('.m3u8')
                  ? 'HLS stream support enabled. Check stream URL or network connection.'
                  : 'Supported formats: HLS (.m3u8), MP4, WebM, RTSP (with backend conversion)'}
              </p>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-contain bg-black"
            muted={isMuted}
            playsInline
            crossOrigin="anonymous"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => {
              // Fallback to default video if loading fails
              if (streamConfig.url !== 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4') {
                videoRef.current!.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
                videoRef.current!.load();
              } else {
                handleVideoError();
              }
            }}
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

            {/* Volume Control */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={toggleMute}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-primary" />
                ) : (
                  <Volume2 className="w-4 h-4 text-primary" />
                )}
              </button>
              <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300 ease-in-out">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-20 cursor-pointer"
                />
              </div>
            </div>

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

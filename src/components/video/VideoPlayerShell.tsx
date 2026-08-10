import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  ArrowLeft, 
  RotateCcw
} from 'lucide-react';
import { Movie } from '@/types/movie';
import { Badge } from '@/components/ui/Badge';
import { getVideoEmbedType } from '@/lib/videoSecurity';

export interface VideoPlayerShellProps {
  movie: Movie;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export const VideoPlayerShell: React.FC<VideoPlayerShellProps> = ({ movie, onTimeUpdate }) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!movie) return null;

  const embedType = getVideoEmbedType(movie.videoUrl);
  const isIframe = embedType === 'iframe' || movie.videoUrl.includes('vdohide') || movie.videoUrl.includes('streamhide') || movie.videoUrl.includes('/e/');

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 0;
      setCurrentTime(cur);
      setDuration(dur);
      if (onTimeUpdate) {
        onTimeUpdate(cur, dur);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume || 1;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full aspect-video max-h-[85vh] bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl group select-none flex items-center justify-center"
    >
      {/* If Video Provider is iFrame (Vdohide / StreamHide / YouTube Embed) */}
      {isIframe ? (
        <iframe
          src={movie.videoUrl}
          title={movie.title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        /* HTML5 Native Video Player */
        <>
          <video
            ref={videoRef}
            src={movie.videoUrl}
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            poster={movie.backdropUrl || movie.posterUrl}
          />

          {/* Top Header Overlay */}
          <div
            className={`absolute top-0 inset-x-0 p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <button
              onClick={() => navigate(`/movie/${movie.slug}`)}
              className="flex items-center gap-2 text-white hover:text-accent font-medium text-sm bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 transition-all hover:border-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Vegere Hûragahiyan</span>
            </button>

            <div className="flex items-center gap-3">
              <Badge variant="accent" className="font-semibold">FULL HD</Badge>
              <Badge variant="quality">{movie.quality || '1080p'}</Badge>
            </div>
          </div>

          {/* Center Big Play Button overlay if paused */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none">
              <button
                onClick={togglePlay}
                className="w-20 h-20 rounded-full bg-accent/90 text-white flex items-center justify-center shadow-2xl shadow-accent/50 scale-100 hover:scale-110 transition-transform pointer-events-auto"
              >
                <Play className="w-10 h-10 fill-white translate-x-1" />
              </button>
            </div>
          )}

          {/* Bottom Control Bar */}
          <div
            className={`absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-3 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Timeline Slider */}
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-accent hover:h-2.5 transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-white text-sm">
              {/* Left Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                  aria-label={isPlaying ? 'Durdur' : 'Oynat'}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white" />}
                </button>

                <button
                  onClick={() => {
                    if (videoRef.current) videoRef.current.currentTime -= 10;
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-cinema-300 hover:text-white"
                  title="10 saniye geriye"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                {/* Time Indicator */}
                <span className="text-xs font-mono text-cinema-300">
                  {formatSeconds(currentTime)} / {formatSeconds(duration)}
                </span>
              </div>

              {/* Title in center */}
              <span className="hidden md:inline-block font-semibold text-xs text-cinema-300 truncate max-w-xs">
                {movie.title} ({movie.year})
              </span>

              {/* Right Controls */}
              <div className="flex items-center gap-4">
                {/* Volume Control */}
                <div className="flex items-center gap-2 group/vol">
                  <button
                    onClick={toggleMute}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-cinema-300 hover:text-white"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5 text-accent" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-cinema-300 hover:text-white"
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

import { useState, useRef, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { 
  Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, 
  Bookmark, Settings, Maximize, Minimize, RectangleHorizontal,
  PictureInPicture, RotateCcw, RotateCw, Lightbulb
} from 'lucide-react';
import { formatDuration } from '../../utils/formatUtils';

type VideoPlayerProps = {
  videoUrl: string;
  title: string;
  onProgress?: (progress: number) => void;
  isTheaterMode?: boolean;
  onTheaterModeToggle?: () => void;
};

const VideoPlayer = ({ 
  videoUrl, 
  title, 
  onProgress, 
  isTheaterMode = false, 
  onTheaterModeToggle 
}: VideoPlayerProps) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const playerRef = useRef<ReactPlayer>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSkipForward = useCallback(() => {
    const currentTime = playerRef.current?.getCurrentTime() || 0;
    playerRef.current?.seekTo(currentTime + 10);
  }, []);

  const handleSkipBackward = useCallback(() => {
    const currentTime = playerRef.current?.getCurrentTime() || 0;
    playerRef.current?.seekTo(Math.max(0, currentTime - 10));
  }, []);

  const exitFullscreen = useCallback(() => {
    try {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
  }, []);

  const enterFullscreen = useCallback((element: HTMLElement) => {
    try {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen();
      }
    } catch (error) {
      console.error('Error entering fullscreen:', error);
    }
  }, []);

  const handleFullscreen = useCallback(() => {
    const container = playerContainerRef.current;
    if (!container) return;

    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen(container);
    }
  }, [isFullscreen, exitFullscreen, enterFullscreen]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case 'Space':
        e.preventDefault();
        setPlaying(prev => !prev);
        break;
      case 'KeyF':
        e.preventDefault();
        const container = playerContainerRef.current;
        if (!container) return;
        
        if (isFullscreen) {
          try {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if ((document as any).webkitExitFullscreen) {
              (document as any).webkitExitFullscreen();
            } else if ((document as any).mozCancelFullScreen) {
              (document as any).mozCancelFullScreen();
            } else if ((document as any).msExitFullscreen) {
              (document as any).msExitFullscreen();
            }
          } catch (error) {
            console.error('Error exiting fullscreen:', error);
          }
        } else {
          try {
            if (container.requestFullscreen) {
              container.requestFullscreen();
            } else if ((container as any).webkitRequestFullscreen) {
              (container as any).webkitRequestFullscreen();
            } else if ((container as any).mozRequestFullScreen) {
              (container as any).mozRequestFullScreen();
            } else if ((container as any).msRequestFullscreen) {
              (container as any).msRequestFullscreen();
            }
          } catch (error) {
            console.error('Error entering fullscreen:', error);
          }
        }
        break;
      case 'KeyT':
        e.preventDefault();
        if (onTheaterModeToggle) onTheaterModeToggle();
        break;
      case 'KeyM':
        e.preventDefault();
        setMuted(prev => !prev);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handleSkipBackward();
        break;
      case 'ArrowRight':
        e.preventDefault();
        handleSkipForward();
        break;
      case 'ArrowUp':
        e.preventDefault();
        setVolume(prev => Math.min(1, prev + 0.1));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setVolume(prev => Math.max(0, prev - 0.1));
        break;
      case 'Escape':
        if (isFullscreen) {
          e.preventDefault();
          try {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if ((document as any).webkitExitFullscreen) {
              (document as any).webkitExitFullscreen();
            } else if ((document as any).mozCancelFullScreen) {
              (document as any).mozCancelFullScreen();
            } else if ((document as any).msExitFullscreen) {
              (document as any).msExitFullscreen();
            }
          } catch (error) {
            console.error('Error exiting fullscreen:', error);
          }
        }
        break;
    }
  }, [isFullscreen, onTheaterModeToggle, handleSkipBackward, handleSkipForward]);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      if (playing) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };
    
    const handleMouseLeave = () => {
      if (playing) {
        setShowControls(false);
      }
    };

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };
    
    const playerContainer = playerContainerRef.current;
    if (playerContainer) {
      playerContainer.addEventListener('mousemove', handleMouseMove);
      playerContainer.addEventListener('mouseleave', handleMouseLeave);
      playerContainer.addEventListener('keydown', handleKeyPress);
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      if (playerContainer) {
        playerContainer.removeEventListener('mousemove', handleMouseMove);
        playerContainer.removeEventListener('mouseleave', handleMouseLeave);
        playerContainer.removeEventListener('keydown', handleKeyPress);
      }
      
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }
    };
  }, [playing, handleKeyPress, isFullscreen]);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (value === 0) {
      setMuted(true);
    } else {
      setMuted(false);
    }
  };

  const handleToggleMute = () => {
    setMuted(!muted);
  };

  const handleVolumeHover = () => {
    setShowVolumeSlider(true);
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
    }
  };

  const handleVolumeLeave = () => {
    volumeTimeoutRef.current = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 1000);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    const target = e.target as HTMLInputElement;
    playerRef.current?.seekTo(parseFloat(target.value));
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    if (!seeking) {
      setPlayed(state.played);
      if (onProgress) {
        onProgress(state.playedSeconds);
      }
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleAddBookmark = () => {
    const currentTime = playerRef.current?.getCurrentTime() || 0;
    if (!bookmarks.includes(currentTime)) {
      setBookmarks([...bookmarks, currentTime]);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    setShowSpeedMenu(false);
  };

  const handlePictureInPicture = async () => {
    try {
      const videoElement = playerRef.current?.getInternalPlayer() as HTMLVideoElement;
      if (videoElement && 'requestPictureInPicture' in videoElement) {
        if (isPiP) {
          await (document as any).exitPictureInPicture();
          setIsPiP(false);
        } else {
          await videoElement.requestPictureInPicture();
          setIsPiP(true);
        }
      }
    } catch (error) {
      console.error('Picture-in-Picture error:', error);
    }
  };

  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  return (
    <div 
      ref={playerContainerRef}
      className={`relative bg-black w-full ${
        isFullscreen 
          ? 'fixed inset-0 z-[9999]' 
          : isTheaterMode 
            ? 'h-[25vh] rounded-lg overflow-hidden' 
            : 'aspect-video rounded-lg overflow-hidden'
      }`}
      tabIndex={0}
    >
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        muted={muted}
        playbackRate={playbackRate}
        onProgress={handleProgress}
        onDuration={handleDuration}
        progressInterval={1000}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload',
              onContextMenu: (e: Event) => e.preventDefault(),
            },
          },
        }}
      />
      
      {/* Custom Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div className="relative w-full h-1 bg-white/30 rounded-full mb-4 group">
          <div
            className="absolute left-0 top-0 h-full bg-[#1E90FF] rounded-full"
            style={{ width: `${played * 100}%` }}
          ></div>
          <input
            type="range"
            min={0}
            max={1}
            step="any"
            value={played}
            onChange={handleSeekChange}
            onMouseDown={handleSeekMouseDown}
            onMouseUp={handleSeekMouseUp}
            className="absolute w-full h-1 opacity-0 cursor-pointer group-hover:h-2 transition-all"
            style={{
              background: `linear-gradient(to right, #1E90FF 0%, #1E90FF ${played * 100}%, rgba(255,255,255,0.3) ${played * 100}%, rgba(255,255,255,0.3) 100%)`
            }}
          />
          
          {/* Bookmarks */}
          {bookmarks.map((time, index) => (
            <div
              key={index}
              className="absolute top-0 w-1 h-3 bg-[#1E90FF] -mt-1 transform -translate-x-1/2 cursor-pointer"
              style={{ left: `${(time / duration) * 100}%` }}
              onClick={() => playerRef.current?.seekTo(time)}
              title={`Bookmark at ${formatDuration(time)}`}
            ></div>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Play/Pause */}
            <button
              onClick={handlePlayPause}
              className="text-white hover:text-[#1E90FF] transition p-1"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            {/* Skip Back 10s */}
            <button
              onClick={handleSkipBackward}
              className="text-white hover:text-[#1E90FF] transition p-1"
              aria-label="Skip backward 10 seconds"
            >
              <RotateCcw size={20} />
            </button>
            
            {/* Skip Forward 10s */}
            <button
              onClick={handleSkipForward}
              className="text-white hover:text-[#1E90FF] transition p-1"
              aria-label="Skip forward 10 seconds"
            >
              <RotateCw size={20} />
            </button>
            
            {/* Volume Control */}
            <div 
              className="flex items-center space-x-2 group relative"
              onMouseEnter={handleVolumeHover}
              onMouseLeave={handleVolumeLeave}
            >
              <button
                onClick={handleToggleMute}
                className="text-white hover:text-[#1E90FF] transition p-1"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              
              <div className={`flex items-center space-x-2 transition-all duration-200 overflow-hidden ${
                showVolumeSlider ? 'opacity-100 max-w-[120px]' : 'opacity-0 max-w-0'
              }`}>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step="any"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #1E90FF 0%, #1E90FF ${volume * 100}%, rgba(255,255,255,0.3) ${volume * 100}%, rgba(255,255,255,0.3) 100%)`
                  }}
                />
                <span className="text-white text-xs font-mono whitespace-nowrap">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
            
            {/* Time Display with Bulb Icon */}
            <div className="text-white text-sm font-mono whitespace-nowrap flex items-center space-x-1">
              <Lightbulb size={14} className="text-[#1E90FF]" />
              <span>{formatDuration(played * duration)} / {formatDuration(duration)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Bookmark */}
            <button
              onClick={handleAddBookmark}
              className="text-white hover:text-[#1E90FF] transition p-1"
              aria-label="Add bookmark"
              title="Add bookmark (B)"
            >
              <Bookmark size={20} />
            </button>
            
            {/* Playback Speed */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="flex items-center space-x-1 text-white hover:text-[#1E90FF] transition text-sm px-2 py-1 rounded"
              >
                <Settings size={16} />
                <span>{playbackRate}x</span>
              </button>
              
              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-black rounded-lg shadow-lg py-2 min-w-[80px] z-10">
                  {speedOptions.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      className={`block w-full px-3 py-1 text-left text-sm hover:bg-[#1E90FF] transition ${
                        playbackRate === speed ? 'text-[#1E90FF] bg-[#1E90FF]/20' : 'text-white'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Picture in Picture */}
            <button
              onClick={handlePictureInPicture}
              className="text-white hover:text-[#1E90FF] transition p-1"
              aria-label="Picture in Picture"
              title="Picture in Picture (P)"
            >
              <PictureInPicture size={20} />
            </button>
            
            {/* Theater Mode */}
            {onTheaterModeToggle && (
              <button
                onClick={onTheaterModeToggle}
                className={`text-white hover:text-[#1E90FF] transition p-1 ${isTheaterMode ? 'text-[#1E90FF]' : ''}`}
                aria-label="Toggle theater mode"
                title="Theater mode (T)"
              >
                <RectangleHorizontal size={20} />
              </button>
            )}
            
            {/* Fullscreen */}
            <button
              onClick={handleFullscreen}
              className="text-white hover:text-[#1E90FF] transition p-1"
              aria-label="Toggle fullscreen"
              title="Fullscreen (F)"
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
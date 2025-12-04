import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Mic2, Heart, Maximize2, ListMusic, Volume1, VolumeX, ChevronDown, Share2 } from 'lucide-react';

const SONG_URL = "/music/photograph.mp3"; // Ed Sheeran - Photograph

const Player: React.FC<{ isFullScreen?: boolean; onToggleFullScreen?: (state: boolean) => void }> = ({ isFullScreen = false, onToggleFullScreen }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <>
      {/* Fullscreen Player Overlay (Mobile Only) */}
      {/* Fullscreen Player Overlay (Mobile Only) */}
      <div className={`fixed inset-0 z-40 flex flex-col transition-transform duration-300 md:hidden bg-black ${isFullScreen ? 'translate-y-0' : 'translate-y-full'}`}>

        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src="/photograph_cover.png" className="w-full h-full object-cover opacity-60 blur-sm" alt="" onError={(e) => (e.currentTarget.src = "https://picsum.photos/400/800?random=99")} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 flex justify-between items-center p-6 pt-12">
          <ChevronDown className="text-white cursor-pointer" size={32} onClick={() => onToggleFullScreen?.(false)} />
          <span className="text-xs font-bold tracking-widest text-white uppercase">Ed Sheeran Mix</span>
          <div className="relative">
            <div className="w-8 flex justify-end cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <span className="text-white font-bold text-xl">...</span>
            </div>
            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-8 w-48 bg-[#282828] rounded shadow-xl py-2 z-50 border border-[#333]">
                <div className="px-4 py-2 hover:bg-[#3E3E3E] text-white text-sm cursor-pointer flex items-center gap-2">
                  <Heart size={16} /> Add to Liked Songs
                </div>
                <div className="px-4 py-2 hover:bg-[#3E3E3E] text-white text-sm cursor-pointer flex items-center gap-2">
                  <Mic2 size={16} /> View Artist
                </div>
                <div className="px-4 py-2 hover:bg-[#3E3E3E] text-white text-sm cursor-pointer flex items-center gap-2">
                  <Share2 size={16} /> Share
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spacer to push content down */}
        <div className="flex-1"></div>

        {/* Bottom Controls Section */}
        <div className="relative z-10 px-6 pb-24">

          {/* Track Info Row */}
          <div className="flex items-center gap-4 mb-6">
            {/* Small image removed as requested */}
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-bold text-white truncate leading-tight">Photograph</h2>
              <p className="text-lg text-[#b3b3b3] truncate">Ed Sheeran</p>
            </div>
            <div className="flex gap-4">
              <Heart size={24} className="text-white" />
              <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-lg leading-none mb-0.5">+</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="w-full h-1 bg-[#4d4d4d] rounded-full mb-2 relative group">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="h-full bg-white rounded-full relative pointer-events-none" style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-[#b3b3b3] font-medium">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-between mb-8 px-2">
            <Shuffle size={24} className="text-[#1DB954]" />
            <SkipBack size={36} className="text-white fill-white" />
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shadow-xl" onClick={togglePlay}>
              {isPlaying ? <Pause size={32} className="text-black fill-black" /> : <Play size={32} className="text-black fill-black ml-1" />}
            </div>
            <SkipForward size={36} className="text-white fill-white" />
            <Repeat size={24} className="text-[#b3b3b3]" />
          </div>

          {/* Footer Icons */}
          <div className="flex justify-between items-center px-4">
            <Mic2 size={20} className="text-white" />
            <div className="flex gap-6">
              <Share2 size={20} className="text-white" />
              <ListMusic size={20} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Mini Player Bar */}
      <div className="h-auto py-2 md:py-0 md:h-[90px] bg-[#000000] border-t border-[#282828] px-2 md:px-4 flex items-center justify-between z-50 relative" onClick={() => !isFullScreen && onToggleFullScreen?.(true)}>
        <audio
          ref={audioRef}
          src={SONG_URL}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Now Playing info */}
        <div className="flex items-center w-full md:w-[30%] md:min-w-[180px]">
          <div className="w-10 h-10 md:w-14 md:h-14 bg-[#282828] flex items-center justify-center shadow-lg group relative cursor-pointer rounded-sm overflow-hidden shrink-0">
            <img src="/photograph_cover.png" className="w-full h-full object-cover absolute top-0 left-0" alt="Cover" onError={(e) => (e.currentTarget.src = "https://picsum.photos/60/60?random=99")} />
            <div className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
              <span className="text-[8px] text-white">^</span>
            </div>
          </div>
          <div className="ml-3 md:ml-4 flex flex-col justify-center overflow-hidden min-w-0 flex-1">
            <div className="text-white text-sm hover:underline cursor-pointer font-normal truncate">Photograph</div>
            <div className="text-[#b3b3b3] text-xs hover:text-white hover:underline cursor-pointer truncate">Ed Sheeran</div>
          </div>
          <div className="flex items-center md:ml-4">
            <Heart size={20} className="mx-2 cursor-pointer hover:scale-105 transition-transform shrink-0 md:w-4 md:h-4" style={{ color: 'var(--accent)', fill: 'var(--accent)' }} />
            {/* Mobile Play Button directly in Now Playing section */}
            <div className="md:hidden w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform cursor-pointer ml-2" onClick={togglePlay}>
              {isPlaying ? <Pause size={16} className="text-black fill-black ml-0.5" /> : <Play size={16} className="text-black fill-black ml-0.5" />}
            </div>
          </div>
        </div>

        {/* Player Controls - Hidden on Mobile, specific mobile play button above */}
        <div className="hidden md:flex flex-col items-center max-w-[40%] w-full px-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-6 mb-2">
            <Shuffle size={16} className="cursor-pointer transition-colors text-[#b3b3b3] hover:text-white" />
            <SkipBack size={20} className="text-[#b3b3b3] hover:text-white cursor-pointer fill-[#b3b3b3] hover:fill-white transition-colors" />
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform cursor-pointer" onClick={togglePlay}>
              {isPlaying ? <Pause size={16} className="text-black fill-black" /> : <Play size={16} className="text-black fill-black ml-1" />}
            </div>
            <SkipForward size={20} className="text-[#b3b3b3] hover:text-white cursor-pointer fill-[#b3b3b3] hover:fill-white transition-colors" />
            <Repeat size={16} className="text-[#b3b3b3] hover:text-white cursor-pointer" />
          </div>
          <div className="w-full flex items-center gap-2 text-xs text-[#b3b3b3] font-sans">
            <span>{formatTime(currentTime)}</span>
            <div className="h-1 flex-1 bg-[#4d4d4d] rounded-full overflow-hidden group cursor-pointer relative">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="h-full bg-white rounded-full relative pointer-events-none" style={{ width: `${(currentTime / (duration || 1)) * 100}%`, backgroundColor: 'var(--accent)' }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md"></div>
              </div>
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume / Extra - Hidden on Mobile */}
        <div className="hidden md:flex items-center justify-end w-[30%] gap-3 min-w-[180px]" onClick={(e) => e.stopPropagation()}>
          <div title="Lyrics">
            <Mic2 size={16} className="text-[#b3b3b3] hover:text-white cursor-pointer" />
          </div>
          <div title="Queue">
            <ListMusic size={16} className="text-[#b3b3b3] hover:text-white cursor-pointer" />
          </div>
          {volume === 0 ? <VolumeX size={16} className="text-[#b3b3b3]" /> : <Volume2 size={16} className="text-[#b3b3b3]" />}

          <div className="w-24 h-1 bg-[#4d4d4d] rounded-full overflow-hidden group cursor-pointer relative flex items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="h-full bg-white rounded-full pointer-events-none" style={{ width: `${volume * 100}%`, backgroundColor: 'var(--accent)' }}></div>
          </div>
          <Maximize2 size={16} className="text-[#b3b3b3] hover:text-white cursor-pointer ml-2" />
        </div>
      </div>
    </>
  );
};

export default Player;
import { useState, useRef, useEffect, useCallback } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const formatTime = (seconds) => {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const SPEEDS = [1, 1.5, 2];

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const SpeakerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-20" />
    <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const AudioPlayer = ({ audioUrl, slug, onAudioGenerated }) => {
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Sync playback rate when speed changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = SPEEDS[speedIndex];
    }
  }, [speedIndex]);

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [audioUrl]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleProgressClick = useCallback((e) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar || !duration) return;

    const rect = bar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * duration;
  }, [duration]);

  const cycleSpeed = useCallback(() => {
    setSpeedIndex((prev) => (prev + 1) % SPEEDS.length);
  }, []);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ slug }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate audio');
      }

      onAudioGenerated(data.audio_url);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  }, [slug, onAudioGenerated]);

  // Generate button state (no audio yet)
  if (!audioUrl) {
    return (
      <div className="bg-[#0B0E14] border border-accent/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="text-accent/60">
            <SpeakerIcon />
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-primary/40">
            Listen to this article
          </span>
        </div>

        {error && (
          <p className="mt-3 text-red-400/80 text-sm font-mono">{error}</p>
        )}

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="mt-3 flex items-center gap-2.5 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-mono tracking-wide hover:bg-accent/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <SpinnerIcon />
              <span>Generating audio&hellip;</span>
            </>
          ) : (
            <>
              <PlayIcon />
              <span>{error ? 'Try again' : 'Generate audio'}</span>
            </>
          )}
        </button>

        {isGenerating && (
          <p className="mt-2 text-primary/30 text-xs font-mono">
            This may take 30–60 seconds
          </p>
        )}
      </div>
    );
  }

  // Player state (audio available)
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-[#0B0E14] border border-accent/10 rounded-lg p-4">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex items-center gap-3 mb-3">
        <div className="text-accent/60">
          <SpeakerIcon />
        </div>
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-primary/40">
          Listen to this article
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent hover:bg-accent/20 transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        {/* Elapsed time */}
        <span className="flex-shrink-0 w-10 text-right font-mono text-xs text-primary/40">
          {formatTime(currentTime)}
        </span>

        {/* Progress bar */}
        <div
          ref={progressRef}
          onClick={handleProgressClick}
          className="flex-1 h-1.5 bg-primary/10 rounded-full cursor-pointer group relative"
          role="progressbar"
          aria-valuenow={currentTime}
          aria-valuemin={0}
          aria-valuemax={duration}
        >
          <div
            className="h-full bg-accent rounded-full relative transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-accent/20" />
          </div>
        </div>

        {/* Total time */}
        <span className="flex-shrink-0 w-10 font-mono text-xs text-primary/40">
          {formatTime(duration)}
        </span>

        {/* Speed */}
        <button
          onClick={cycleSpeed}
          className="flex-shrink-0 px-2 py-1 rounded bg-white/5 text-primary/40 text-xs font-mono hover:text-accent hover:bg-white/10 transition-colors"
          aria-label={`Playback speed: ${SPEEDS[speedIndex]}x`}
        >
          {SPEEDS[speedIndex]}x
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;

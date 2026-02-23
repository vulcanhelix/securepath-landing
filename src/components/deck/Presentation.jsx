import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize } from 'lucide-react';

const Presentation = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const numSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, numSlides - 1));
  }, [numSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ': // Spacebar
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          prevSlide();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            toggleFullscreen();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, toggleFullscreen, isFullscreen]);

  // Fullscreen change listener for escape key
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000); // hide after 3 seconds
    };

    document.addEventListener('mousemove', handleMouseMove);
    // Initial hide timeout
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-screen h-screen overflow-hidden bg-black text-white font-deck select-none"
    >
      {/* Slides Container */}
      {slides.map((SlideComponent, index) => {
        const isActive = index === currentSlide;
        const isPast = index < currentSlide;
        const isFuture = index > currentSlide;

        // Scale: 0.95 for past, 1.05 for future, 1 for current
        const scale = isActive ? 1 : isPast ? 0.95 : 1.05;
        const opacity = isActive ? 1 : 0;
        // Optimization: don't render slides that are far away structurally if they have heavy videos
        // But the prompt implies fading between all slides gracefully.
        const pointerEvents = isActive ? 'auto' : 'none';

        return (
          <div
            key={index}
            className="absolute inset-0 transition-all duration-500 ease-in-out origin-center"
            style={{
              opacity,
              transform: `scale(${scale})`,
              pointerEvents,
              zIndex: isActive ? 10 : 0
            }}
          >
            {/* The slide itself needs relative z-10 for content above video z-0 */}
            <SlideComponent isActive={isActive} />
          </div>
        );
      })}

      {/* Top Right Keyboard Hint */}
      <div 
        className={`absolute top-[4%] right-[4%] text-[11px] text-white/40 tracking-wider z-50 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        &larr; &rarr; Navigate &middot; F Fullscreen
      </div>

      {/* Bottom Navigation Control Bar */}
      <div 
        className={`absolute bottom-[4%] left-[4%] right-[4%] flex justify-between items-center z-50 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Slide Counter */}
        <div className="w-16 text-[13px] text-white/50 tabular-nums">
          {currentSlide + 1} / {numSlides}
        </div>

        {/* Progress Dots */}
        <div className="flex gap-2 items-center">
          {slides.map((_, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={index}
                className={`h-[6px] rounded-full transition-all duration-300 ${isActive ? 'w-[24px] bg-white/90' : 'w-[6px] bg-white/30'}`}
              />
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button 
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`p-2 rounded-full transition-colors ${currentSlide === 0 ? 'opacity-20 cursor-not-allowed' : 'text-white/50 hover:text-white/90 hover:bg-white/10'}`}
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            disabled={currentSlide === numSlides - 1}
            className={`p-2 rounded-full transition-colors ${currentSlide === numSlides - 1 ? 'opacity-20 cursor-not-allowed' : 'text-white/50 hover:text-white/90 hover:bg-white/10'}`}
          >
            <ChevronRight size={20} />
          </button>
          <div className="w-[1px] h-4 bg-white/20 mx-2" />
          <button 
            onClick={toggleFullscreen}
            className="p-2 rounded-full text-white/50 hover:text-white/90 hover:bg-white/10 transition-colors"
          >
            <Maximize size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Presentation;

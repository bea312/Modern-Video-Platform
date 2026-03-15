import { useRef } from 'react';

const VideoPlayer = ({ videoId }) => {
  const playerRef = useRef(null);

  const handleFullScreen = () => {
    const el = playerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }
    el.requestFullscreen?.();
  };

  return (
    <div className="video-player" ref={playerRef}>
      <iframe
        title="Video playback"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <button type="button" className="fullscreen" onClick={handleFullScreen}>
        Full screen
      </button>
    </div>
  );
};

export default VideoPlayer;

import React from "react";
import { GiPauseButton } from "react-icons/gi";
import { FaCirclePlay } from "react-icons/fa6";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import "../../css/footer/ControlArea.css";

const ControlArea = ({
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  currentTime,
  duration,
  onSeek,
  onLike,
  isLiked
}) => {
  const handleLike = () => {
    if (onLike) onLike();
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="control-root">
      {/* Control Buttons */}
      <div className="control-buttons">
        <button
          type="button"
          aria-label="previous"
          className="control-icon-btn"
          onClick={onPrev}
        >
          <TbPlayerTrackPrevFilled color="#a855f7" size={24} />
        </button>
        <button
          type="button"
          aria-label="play"
          className="control-play-btn"
          onClick={onPlayPause}
        >
          {isPlaying ? (
            <GiPauseButton color="#a855f7" size={42} />
          ) : (
            <FaCirclePlay color="#a855f7" size={42} />
          )}
        </button>

        <button
          type="button"
          aria-label="next"
          className="control-icon-btn"
          onClick={onNext}
        >
          <TbPlayerTrackNextFilled color="#a855f7" size={24} />
        </button>
        <button
          type="button"
          aria-label="like"
          className="control-icon-btn"
          onClick={handleLike}
        >
          {isLiked ? (
            <FaHeart color="#ef4444" size={22} />
          ) : (
            <FaRegHeart color="#a855f7" size={22} />
          )}
        </button>
      </div>

      <div className="control-progress-wrapper">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime || 0}
          className="control-progress"
          onChange={(e) => onSeek(Number(e.target.value))}
        />
        <div className="control-times">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default ControlArea;

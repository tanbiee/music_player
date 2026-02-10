import { IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { TbArrowsShuffle } from "react-icons/tb";
import { RiLoopRightLine } from "react-icons/ri";

import "../../css/footer/Feature.css";

const Features = ({
  isMuted,
  volume,
  shuffleEnabled,
  loopEnabled,
  playbackSpeed,
  onToggleMute,
  onToggleShuffle,
  onToggleLoop,
  onSetPlaybackSpeed,
  onVolumeChange
}) => {
  return (
    <div className="features-root">
      <div className="features-row">
        {/* Mute */}
        <button
          className="features-btn"
          aria-label="mute"
          onClick={onToggleMute}
        >
          {isMuted || volume === 0 ? (
            <IoVolumeMuteOutline color="#ef4444" size={26} />
          ) : (
            <IoVolumeHighOutline color="#a855f7" size={26} />
          )}
        </button>

        {/* Shuffle */}
        <button
          className="features-btn"
          aria-label="shuffle"
          onClick={onToggleShuffle}
        >
          <TbArrowsShuffle color={shuffleEnabled ? "#a855f7" : "#9ca3af"} size={26} />
        </button>

        {/* Loop */}
        <button
          className="features-btn"
          aria-label="loop"
          onClick={onToggleLoop}
        >
          <RiLoopRightLine color={loopEnabled ? "#a855f7" : "#9ca3af"} size={26} />
        </button>

        {/* Playback Speed */}
        <label className="features-speed-label">
          <select
            className="features-speed-select"
            value={playbackSpeed}
            onChange={(e) => onSetPlaybackSpeed(Number(e.target.value))}
          >
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </label>
      </div>

      {/* Volume */}
      <div className="features-volume-wrapper">
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          className="features-volume-range"
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          style={{
            backgroundSize: `${(isMuted ? 0 : volume) * 100}% 100%`,
          }}
        />
      </div>
    </div>
  );
};

export default Features;

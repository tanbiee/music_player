import React from "react";
import "../../css/mainArea/Playlist.css";
import { FiBox } from "react-icons/fi";

const Playlist = ({ onCategorySelect, selectedCategory }) => {
  const items = [
    {
      id: 1,
      label: "Workout",
      img: "https://media.istockphoto.com/id/904837138/vector/folded-white-paper-heart-icon-with-shadow-on-red-background-minimal-flat-red-love-symbol.jpg?s=170667a&w=0&k=20&c=CmncVqn5htsD8x6ENBt2bLnhyUluMJuD8VpZbPEwHWE=",
    },
    {
      id: 2,
      label: "Chill",
      img: "https://media.istockphoto.com/id/1073941846/vector/3d-sound-waves-with-colored-dots-big-data-abstract-visualization.jpg?s=612x612&w=0&k=20&c=duxGn_eTDtlYqKyLvv0OAHibwv0dA5xRU3TGQEgGjwQ=",
    },
    {
      id: 3,
      label: "Happy",
      img: "https://thumbs.dreamstime.com/b/cassette-tape-eighties-inspired-retro-colors-vintage-music-theme-blended-modern-art-deep-space-elements-featuring-mix-414923588.jpg",
    },
    {
      id: 4,
      label: "Relaxing",
      img: "https://media.istockphoto.com/id/636342222/photo/man-running-outdoors.jpg?s=612x612&w=0&k=20&c=i-igbJRtN_-xux2ErLQMNUBQ9ekRsMxTymv_5TlVJgU=",
    },
    {
      id: 5,
      label: "Rock",
      img: "https://media.istockphoto.com/id/958707426/vector/monochrome-antique-hipster-vintage-label-badge-crest-rock-and-roll-for-flyer-poster-logo-or-t.jpg?s=1024x1024&w=is&k=20&c=bES_zaAIR4z4IcvRQQeUq9fjcc7pGGxzuV_2Hi_ziS4=",
    },
  ];

  return (
    <div className="playlist-root">
      <div className="flex justify-between items-center mb-4">
        <h1 className="playlist-title">Playlists</h1>
        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors">
          <FiBox className="text-white text-xl" />
        </div>
      </div>

      <div className="playlist-wrapper">
        <div className="playlist-grid">
          {items.map((item) => (
            <div
              className={`playlist-card ${selectedCategory === item.label ? "selected" : ""}`}
              key={item.id}
              onClick={() => onCategorySelect && onCategorySelect(item.label)}
              style={{
                cursor: "pointer",
                border: selectedCategory === item.label ? "2px solid #a855f7" : "none"
              }}
            >
              <img src={item.img} alt={item.label} className="playlist-image" />
              <h4 className="playlist-label">{item.label}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Playlist;

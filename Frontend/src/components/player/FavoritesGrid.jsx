import React from "react";
import "../../css/player/FavoritesGrid.css";
import { FaPlay } from "react-icons/fa";

const FavoritesGrid = ({ songs, onSongSelect }) => {
    if (!songs || songs.length === 0) {
        return (
            <div className="favorites-grid-root">
                <div className="favorites-header">
                    <h2 className="favorites-title">Your Favourites</h2>
                    <div className="favorites-header-line"></div>
                </div>
                <div className="favorites-empty">
                    <p>No favorite songs yet.</p>
                    <p className="text-sm mt-2">Go like some songs to see them here! ❤️</p>
                </div>
            </div>
        );
    }

    return (
        <div className="favorites-grid-root">
            <div className="favorites-header">
                <h2 className="favorites-title">Your Favourites</h2>
                <div className="favorites-header-line"></div>
            </div>

            <div className="favorites-grid">
                {songs.map((song, index) => (
                    <div
                        key={song.id || index}
                        className="fav-card group"
                        onClick={() => onSongSelect(index)}
                    >
                        <div className="fav-img-wrapper">
                            <img
                                src={song.cover}
                                alt={song.name}
                                className="fav-img"
                                onError={(e) => {
                                    e.target.src = "https://placehold.co/300x300?text=No+Image";
                                }}
                            />
                            <div className="fav-overlay">
                                <button className="fav-play-btn">
                                    <FaPlay size={18} className="translate-x-0.5" />
                                </button>
                            </div>
                        </div>
                        <div className="fav-info">
                            <h3 className="fav-name">{song.name}</h3>
                            <p className="fav-artist">{song.artist_name || "Unknown Artist"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavoritesGrid;

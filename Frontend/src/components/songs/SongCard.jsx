import React from "react";
import "../../css/songs/SongCard.css";

const SongCard = ({ song, onSelectFavourite }) => {
    return <div className="song-card" onClick={onSelectFavourite}>
        <div className="song-card-image">
            <img src={song.image} alt={song.name} loading="lazy" />
        </div>
        <div className="song-card-info">
            <h4 className="song-card-title">{song.name}</h4>
            <p className="song-card-artist">{song.artist}</p>
        </div>
    </div>
};

export default SongCard;
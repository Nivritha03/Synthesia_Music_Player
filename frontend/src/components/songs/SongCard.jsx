import React from "react";
import "../../css/songs/SongCard.css";

const SongCard = ({ song, index, onPlay }) => {
  return (
    <div className="song-card" onClick={() => onPlay(index)}>
      <div className="song-card-image">
        <img src={song.image} alt={song.name} loading="lazy" />
      </div>

      <div className="song-card-info">
        <h4 className="song-title">{song.name}</h4>
        <p className="song-artist">{song.artist_name}</p>
      </div>
    </div>
  );
};

export default SongCard;

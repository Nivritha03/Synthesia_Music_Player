import "../../css/mainArea/SongList.css";
import { formatTime } from "../utils/helper";

const SongList = ({
  songs,
  onSelectSong,
  currentIndex,
  isEmptyFavourite = false,
}) => {
  if (!Array.isArray(songs) || songs.length === 0) {
    return (
      <div className="songlist-root">
        <div className="songlist-empty">
          <p className="songlist-empty-text">
            {isEmptyFavourite
              ? "No favourite songs yet"
              : "🎵 No songs found"}
          </p>

          <span className="songlist-empty-subtext">
            {isEmptyFavourite
              ? "Start exploring and add songs to your favourites!"
              : "Select a playlist to load songs"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="songlist-root">
      <div className="songlist-scroll">
        <table className="songlist-table">
          <colgroup>
            <col className="col-index" />
            <col className="col-name" />
            <col className="col-artist" />
            <col className="col-year" />
            <col className="col-duration" />
          </colgroup>

          <thead>
            <tr>
              <th className="songlist-th th-index">No</th>
              <th className="songlist-th">Name</th>
              <th className="songlist-th">Artist</th>
              <th className="songlist-th">Year</th>
              <th className="songlist-th th-duration">Duration</th>
            </tr>
          </thead>

          <tbody>
            {songs.map((song, index) => {
              const year =
                typeof song.releasedate === "string"
                  ? song.releasedate.slice(0, 4)
                  : "—";

              return (
                <tr
                  key={String(song.id)}
                  onClick={() => {
                    if (song.audio) {
                      onSelectSong(index);
                    }
                  }}
                  className={`songlist-row ${
                    currentIndex === index
                      ? "songlist-row-active"
                      : ""
                  }`}
                >
                  <td className="songlist-td td-index">
                    {index + 1}
                  </td>
                  <td className="songlist-td">
                    {song.name || "Unknown"}
                  </td>
                  <td className="songlist-td">
                    {song.artist_name || "Unknown"}
                  </td>
                  <td className="songlist-td">{year}</td>
                  <td className="songlist-td td-duration">
                    {formatTime(Number(song.duration) || 0)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SongList;

import Playlist from "../player/Playlist";
import SongList from "../player/SongList";
import SearchBar from "../search/SearchBar";

const MainArea = ({
  view,
  songsToDisplay,
  currentIndex,
  onSelectSong,
  onSelectTag,
  setSearchSongs,
}) => {
  return (
    <div className="mainarea-root">
      {/* HOME */}
      {view === "home" && <Playlist onSelectTag={onSelectTag} />}

      {/* SEARCH */}
      {view === "search" && (
        <SearchBar setSearchSongs={setSearchSongs} />
      )}

      {/* SONG LIST */}
      <SongList
        songs={songsToDisplay}
        currentIndex={currentIndex}
        onSelectSong={onSelectSong}
        isEmptyFavourite={view === "favourite"}
      />
    </div>
  );
};

export default MainArea;

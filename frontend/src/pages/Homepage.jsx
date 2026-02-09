import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

/* ✅ AUTH BUTTONS */
import Auth from "../components/auth/Auth";

/* Layout */
import Footer from "../components/layout/Footer";
import SideMenu from "../components/layout/SideMenu";
import MainArea from "../components/layout/MainArea";

/* Modals */
import Modal from "../components/common/Modal";
import EditProfile from "../components/auth/EditProfile";

/* Audio */
import useAudioPlayer from "../hooks/useAudioPlayer";

/* Styles */
import "../css/pages/HomePage.css";

const Homepage = () => {
  const [view, setView] = useState("home");
  const [songs, setSongs] = useState([]);
  const [searchSongs, setSearchSongs] = useState([]);
  const [openEditprofile, setOpenEditprofile] = useState(false);

  const auth = useSelector((state) => state.auth);

  /* ✅ SINGLE FIX (NO UI CHANGE) */
  const favourites = auth.user?.favourites || [];

  const songsToDisplay =
    view === "search"
      ? searchSongs
      : view === "favourite"
      ? favourites
      : songs;

  const {
    audioRef,
    currentIndex,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    loopEnabled,
    shuffleEnabled,
    playbackSpeed,
    volume,
    isLoading,

    playSongAtIndex,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    handleToggleMute,
    handleToggleLoop,
    handleToggleShuffle,
    handleChangeSpeed,
    handleSeek,
    handleChangeVolume,
  } = useAudioPlayer(songsToDisplay);

  const playerState = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    loopEnabled,
    shuffleEnabled,
    playbackSpeed,
    volume,
    isLoading,
  };

  const playerControls = {
    playSongAtIndex,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleSeek,
  };

  const playerFeatures = {
    onToggleMute: handleToggleMute,
    onToggleLoop: handleToggleLoop,
    onToggleShuffle: handleToggleShuffle,
    onChangeSpeed: handleChangeSpeed,
    onChangeVolume: handleChangeVolume,
  };

  /* 🔥 Load initial songs */
  useEffect(() => {
    const fetchInitialSongs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/songs`
        );
        setSongs(res.data?.results || []);
      } catch (error) {
        console.error("Error while fetching songs", error);
        setSongs([]);
      }
    };

    fetchInitialSongs();
  }, []);

  const loadPlaylist = async (tag) => {
    if (!tag) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/songs/playlistByTag/${tag}`
      );
      setSongs(res.data?.results || []);
      setView("home");
    } catch (error) {
      console.error("Failed to load playlist", error);
      setSongs([]);
    }
  };

  /* ▶ Play selected song */
  const handleSelectSong = (index) => {
    playSongAtIndex(index);
  };

  /* ❤️ Favourite play (UNCHANGED) */
  const handlePlayFavourite = (song) => {
    if (!favourites.length) return;

    const index = favourites.findIndex((fav) => fav.id === song.id);
    setView("favourite");

    setTimeout(() => {
      if (index !== -1) playSongAtIndex(index);
    }, 0);
  };

  return (
    <div className="homepage-root">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <Auth />

      <div className="homepage-main-wrapper">
        <div className="homepage-sidebar">
          <SideMenu
            setView={setView}
            view={view}
            onOpenEditProfile={() => setOpenEditprofile(true)}
          />
        </div>

        <div className="homepage-content" >
          
          <MainArea
            view={view}
            currentIndex={currentIndex}
            onSelectSong={handleSelectSong}
            onSelectFavourite={handlePlayFavourite}
            onSelectTag={loadPlaylist}
            songsToDisplay={songsToDisplay}
            setSearchSongs={setSearchSongs}
          />
        </div>
      </div>

      <Footer
        playerState={playerState}
        playerControls={playerControls}
        playerFeatures={playerFeatures}
      />

      {openEditprofile && (
        <Modal onClose={() => setOpenEditprofile(false)}>
          <EditProfile onClose={() => setOpenEditprofile(false)} />
        </Modal>
      )}
    </div>
  );
};

export default Homepage;

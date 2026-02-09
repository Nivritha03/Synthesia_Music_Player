import { useReducer, useState, useRef } from "react";

const initialAudioState = {
  isPlaying: false,
  isLoading: false,
  isMuted: false,
  volume: 1,
  loopEnabled: false,
  shuffleEnabled: false,
  playbackSpeed: 1,
  currentIndex: null,
  currentSong: null,
  currentTime: 0,
};

function audioReducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, isLoading: true };

    case "PLAY":
      return { ...state, isPlaying: true, isLoading: false };

    case "PAUSE":
      return { ...state, isPlaying: false };

    case "MUTE":
      return { ...state, isMuted: true };

    case "UNMUTE":
      return { ...state, isMuted: false };

    case "SET_VOLUME":
      return { ...state, volume: action.payload };

    case "TOGGLE_LOOP":
      return {
        ...state,
        loopEnabled: !state.loopEnabled,
        shuffleEnabled: false,
      };

    case "TOGGLE_SHUFFLE":
      return {
        ...state,
        shuffleEnabled: !state.shuffleEnabled,
        loopEnabled: false,
      };

    case "SET_PLAYBACK_SPEED":
      return { ...state, playbackSpeed: action.payload };

    case "SET_CURRENT_TRACK":
      return {
        ...state,
        currentIndex: action.payload.index,
        currentSong: action.payload.song,
        isLoading: true,
      };

    case "SET_CURRENT_TIME":
      return { ...state, currentTime: action.payload };

    default:
      return state;
  }
}

const useAudioPlayer = (songs = []) => {
  const [audioState, dispatch] = useReducer(
    audioReducer,
    initialAudioState
  );
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const previousVolumeRef = useRef(1);

  const playSongAtIndex = (index) => {
    if (!Array.isArray(songs) || songs.length === 0) return;
    if (index < 0 || index >= songs.length) return;

    const song = songs[index];
    if (!song?.audio) return;

    dispatch({
      type: "SET_CURRENT_TRACK",
      payload: { index, song },
    });

    dispatch({ type: "SET_CURRENT_TIME", payload: 0 });

    const audio = audioRef.current;
    if (!audio) return;

    if (audio.src !== song.audio) {
      audio.src = song.audio;
    }

    audio.currentTime = 0;
    audio.playbackRate = audioState.playbackSpeed;

    audio
      .play()
      .then(() => dispatch({ type: "PLAY" }))
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Play Error:", err);
        }
      });
  };

  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio
        .play()
        .then(() => dispatch({ type: "PLAY" }))
        .catch(() => {});
    } else {
      audio.pause();
      dispatch({ type: "PAUSE" });
    }
  };

  const handleNext = () => {
    if (!songs.length) return;

    if (audioState.currentIndex === null) {
      playSongAtIndex(0);
      return;
    }

    if (audioState.shuffleEnabled && songs.length > 1) {
      let randomIndex = audioState.currentIndex;
      while (randomIndex === audioState.currentIndex) {
        randomIndex = Math.floor(Math.random() * songs.length);
      }
      playSongAtIndex(randomIndex);
      return;
    }

    playSongAtIndex((audioState.currentIndex + 1) % songs.length);
  };

  const handlePrev = () => {
    if (!songs.length) return;

    if (audioState.currentIndex === null) {
      playSongAtIndex(0);
      return;
    }

    playSongAtIndex(
      (audioState.currentIndex - 1 + songs.length) % songs.length
    );
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    dispatch({
      type: "SET_CURRENT_TIME",
      payload: audio.currentTime || 0,
    });
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setDuration(audio.duration || 0);
    audio.volume = audioState.volume;
    audio.muted = audioState.isMuted;
  };

  const handleEnded = () => {
    if (audioState.loopEnabled) {
      const audio = audioRef.current;
      if (!audio) return;

      audio.currentTime = 0;
      audio.play().catch(() => {});
    } else {
      handleNext();
    }
  };

  const handleToggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audioState.isMuted) {
      audio.muted = false;
      audio.volume = previousVolumeRef.current;
      dispatch({ type: "UNMUTE" });
      dispatch({
        type: "SET_VOLUME",
        payload: previousVolumeRef.current,
      });
    } else {
      previousVolumeRef.current = audioState.volume;
      audio.muted = true;
      audio.volume = 0;
      dispatch({ type: "MUTE" });
      dispatch({ type: "SET_VOLUME", payload: 0 });
    }
  };

  const handleToggleLoop = () =>
    dispatch({ type: "TOGGLE_LOOP" });

  const handleToggleShuffle = () =>
    dispatch({ type: "TOGGLE_SHUFFLE" });

  const handleChangeSpeed = (speed) => {
    const audio = audioRef.current;
    dispatch({ type: "SET_PLAYBACK_SPEED", payload: speed });
    if (audio) audio.playbackRate = speed;
  };

  const handleSeek = (time) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = time;
    dispatch({ type: "SET_CURRENT_TIME", payload: time });
  };

  const handleChangeVolume = (vol) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = vol;
    dispatch({ type: "SET_VOLUME", payload: vol });

    if (vol === 0) {
      audio.muted = true;
      dispatch({ type: "MUTE" });
    } else if (audioState.isMuted) {
      audio.muted = false;
      dispatch({ type: "UNMUTE" });
    }
  };

  return {
    audioRef,
    currentIndex: audioState.currentIndex,
    currentSong: audioState.currentSong,
    isPlaying: audioState.isPlaying,
    isLoading: audioState.isLoading,
    currentTime: audioState.currentTime,
    duration,
    isMuted: audioState.isMuted,
    loopEnabled: audioState.loopEnabled,
    shuffleEnabled: audioState.shuffleEnabled,
    playbackSpeed: audioState.playbackSpeed,
    volume: audioState.volume,
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
  };
};

export default useAudioPlayer;

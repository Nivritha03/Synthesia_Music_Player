import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import "../../css/search/SearchBar.css";

const SearchBar = ({ setSearchSongs }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSearchSongs([]);
      return;
    }

    const fetchSongs = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/songs/playlistByTag/${encodeURIComponent(
            query
          )}`
        );

        setSearchSongs(res.data?.results || []);
      } catch (error) {
        console.error("Search failed", error);
        setSearchSongs([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchSongs, 500);
    return () => clearTimeout(debounceTimeout);
  }, [query, setSearchSongs]);

  return (
    <div className="searchbar-root">
      <div
        className="searchbar-input-wrapper"
        style={{ position: "relative" }}
      >
        <input
          className="searchbar-input"
          type="text"
          placeholder="Search songs, artists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ paddingRight: "42px" }}   // space for icon
        />

        <CiSearch
          size={20}
          style={{
            position: "absolute",
            right: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#a855f7",
            pointerEvents: "none",
          }}
        />
      </div>

      {!query && !loading && (
        <p className="searchbar-empty">Search songs to display 🎧</p>
      )}

      {loading && <p className="searchbar-loading">Searching...</p>}
    </div>
  );
};

export default SearchBar;

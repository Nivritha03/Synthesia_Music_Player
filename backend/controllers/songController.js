import axios from "axios";

const JAMENDO_BASE_URL = "https://api.jamendo.com/v3.0/tracks/";
const CLIENT_ID = "c0b5f533";

// ✅ GET ALL SONGS
export const getSongs = async (req, res) => {
  try {
    const response = await axios.get(JAMENDO_BASE_URL, {
      timeout: 5000,
      params: {
        client_id: CLIENT_ID,
        format: "json",
        limit: 15,
        order: "popularity_total",
        audioformat: "mp32",
      },
    });

    res.status(200).json({
      results: response.data?.results || [],
    });
  } catch (error) {
    res.status(200).json({ results: [] });
  }
};

// ✅ SEARCH / PLAYLIST BY TAG OR TEXT
export const getPlayListByTag = async (req, res) => {
  try {
    const { tag } = req.params;

    const response = await axios.get(JAMENDO_BASE_URL, {
      timeout: 5000,
      params: {
        client_id: CLIENT_ID,
        format: "json",
        limit: 15,
        namesearch: tag,   // ✅ FIX: text search
        tags: tag,         // ✅ still supports genre search
        audioformat: "mp32",
      },
    });

    // ✅ FALLBACK IF SEARCH RETURNS EMPTY
    if (!response.data?.results || response.data.results.length === 0) {
      const fallback = await axios.get(JAMENDO_BASE_URL, {
        timeout: 5000,
        params: {
          client_id: CLIENT_ID,
          format: "json",
          limit: 15,
          order: "popularity_total",
          audioformat: "mp32",
        },
      });

      return res.status(200).json({
        results: fallback.data?.results || [],
      });
    }

    res.status(200).json({
      results: response.data.results,
    });
  } catch (error) {
    res.status(200).json({ results: [] });
  }
};

// ✅ TOGGLE FAVOURITES
export const toggleFavourite = async (req, res) => {
  try {
    const user = req.user;
    const song = req.body.song;

    const exists = user.favourites.find((fav) => fav.id === song.id);

    if (exists) {
      user.favourites = user.favourites.filter(
        (fav) => fav.id !== song.id
      );
    } else {
      user.favourites.push(song);
    }

    await user.save();
    res.status(200).json(user.favourites);
  } catch (error) {
    res.status(200).json([]);
  }
};

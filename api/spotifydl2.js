const SpotifyDL = require('spotidownloader');
const axios = require('axios');

const meta = {
  name: "Spotify Downloader Search",
  version: "1.0.0",
  description: "API to search for a Spotify track based on a query and download it",
  author: "Azad 💥",
  method: "get",
  category: "downloader",
  path: "/spotifysearch?search="
};

async function getSpotifyToken() {
  try {
    const url = "https://accounts.spotify.com/api/token";
    const clientId = "0be741ce2d1448b0b0ffcf8e626ff2d9"; // Replace with your own or use environment variables
    const clientSecret = "d5675a90b653419e8eb853a40d82a6fa"; // Replace with your own or use environment variables
    const response = await axios.post(
      url,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error generating Spotify token:", error.response?.data || error.message);
    throw new Error("Failed to generate Spotify token.");
  }
}

async function onStart({ res, req }) {
  try {
    const keyword = req.query.search;
    const artist = req.query.artist; // Optional

    if (!keyword) {
      return res.json({
        error: "Please provide a search query using the 'search' parameter."
      });
    }

    // Obtain Spotify API access token
    const token = await getSpotifyToken();

    // Build the search query
    let query = `track:${keyword}`;
    if (artist) query += ` artist:${artist}`;
    const encodedQuery = encodeURIComponent(query);

    // Call Spotify's search API
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&limit=1&offset=0`;
    const response = await axios.get(searchUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = response.data.tracks;
    if (!data || !data.items || data.items.length === 0) {
      return res.json({
        error: `No tracks found for '${keyword}'${artist ? ` by '${artist}'` : ''}!`
      });
    }

    // Use the first search result
    const track = data.items[0];
    const url = track.external_urls.spotify;

    // Get track details and download link using SpotifyDL (aligned with snippet usage)
    const trackInfo = await SpotifyDL.get(url);
    if (trackInfo.error) {
      return res.json({ error: trackInfo.error });
    }
    if (!trackInfo.download) {
      return res.json({ error: "Download link not found in track info." });
    }

    // Send response with track info and download link
    res.json({
      searchQuery: keyword,
      trackInfo: trackInfo,           // Full track info as in the snippet
      downloadLink: trackInfo.download, // Explicit download link as in the snippet
      spotifySearchResult: track      // Original Spotify search data
    });
  } catch (error) {
    res.json({ error: error.message });
  }
}

module.exports = { meta, onStart };

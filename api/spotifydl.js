const SpotifyDL = require('spotidownloader');

const meta = {
  name: "Spotify Downloader Link",
  version: "1.0.0",
  description: "API to fetch Spotify track info and download link",
  author: "Azad 💥", 
  method: "get",
  category: "downloader",
  path: "/spotifydl?url="
};

async function onStart({ res, req }) {
  try {
    // Get the Spotify track URL from the query parameters, or default to a sample URL.
    const url = req.query.url || 'https://open.spotify.com/track/7eRieAYqAG7rBEOMlvR0xy';

    if (!url) {
      res.json({ error: 'No Spotify track URL provided.' });
      return;
    }

    // Fetch track info using the SpotifyDL module.
    const track = await SpotifyDL.get(url);

    if (track.error) {
      res.json({ error: track.error });
    } else {
      res.json({
        trackInfo: track,
        downloadLink: track.download
      });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
}

module.exports = { meta, onStart };

const axios = require("axios");

module.exports = {
  meta: {
    name: "YouTube Search",
    version: "1.0.0",
    description: "Search on YouTube",
    author: "Azad 💥",
    method: "get",
    path: "/ytsearch?query=",
    category: "search"
  },
  onStart: async function({ req, res }) {
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const url = `https://me0xn4hy3i.execute-api.us-east-1.amazonaws.com/staging/api/resolve/resolveYoutubeSearch?search=${encodeURIComponent(query)}`;

    const headers = {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      Referer: "https://v4.mp3paw.link/",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    };

    try {
      const response = await axios.get(url, { headers });
      res.json(response.data);
    } catch (error) {
      console.error('Error in Music Search API:', error);
      res.status(500).json({ error: "Internal server error", message: error.message });
    }
  }
};

const axios = require("axios");

module.exports = {
  meta: {
    name: "YouTube Mp3 Downloader",
    version: "1.0.0",
    author: "Azad 💥",
    method: "get",
    description: "Download music tracks",
    path: "/ytmp3dl?url=",
    category: "downloader"
  },
  onStart: async function({ req, res }) {
    const youtubeUrl = req.query.url;

    if (!youtubeUrl) {
      return res.status(400).json({ error: "YouTube URL is required" });
    }

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
      const apiKey = "30de256ad09118bd6b60a13de631ae2cea6e5f9d";
      const downloadUrl = `https://p.oceansaver.in/ajax/download.php?copyright=0&format=mp3&url=${encodeURIComponent(youtubeUrl)}&api=${apiKey}`;

      const { data: downloadData } = await axios.get(downloadUrl, { headers });

      if (downloadData.success) {
        const { id } = downloadData;
        const progressUrl = `https://p.oceansaver.in/ajax/progress.php?id=${id}`;
        const { data: progressData } = await axios.get(progressUrl, { headers });

        res.json(progressData);
      } else {
        res.status(400).json({ error: "Failed to initiate download" });
      }
    } catch (error) {
      console.error('Error in Music Download API:', error);
      res.status(500).json({ error: "Internal server error", message: error.message });
    }
  }
};

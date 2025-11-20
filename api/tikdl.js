const axios = require("axios");

module.exports = {
  meta: {
    name: "TikTok Downloader",
    version: "1.0.0",
    description: "Download tiktok videos without watermark.",
    author: "Azad 💥",
    path: "/tikdl?url=",
    method: "get",
    category: "downloader"
  },
  onStart: async function({ req, res }) {
    const tiktokUrl = req.query.url;

    if (!tiktokUrl) {
      return res.status(400).json({ error: "TikTok URL is required" });
    }

    const url = "https://ssstik.io/abc?url=dl";

    const headers = {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/x-www-form-urlencoded",
      origin: "https://ssstik.io",
      referer: "https://ssstik.io/",
      "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    };

    const data = new URLSearchParams({
      id: tiktokUrl,
      locale: "en",
      tt: "YVJLR1Fi",
    }).toString();

    try {
      const { data: html } = await axios.post(url, data, { headers });

      const extractMatch = (regex, fallback = "Unknown") => html.match(regex)?.[1] ?? fallback;

      const result = {
        author: extractMatch(/<h2>(.*?)<\/h2>/),
        profilePic: extractMatch(/<img class="result_author" src="(.*?)"/, "No profile picture found"),
        description: extractMatch(/<p class="maintext">(.*?)<\/p>/, "No description"),
        likes: extractMatch(/<div>\s*(\d+)\s*<\/div>\s*<\/div>\s*<\/div>\s*<div class="d-flex flex-1 align-items-center justify-content-center">/, "0"),
        comments: extractMatch(/<div class="d-flex flex-1 align-items-center justify-content-center">\s*<svg[^>]*><\/svg>\s*<div>\s*(\d+)\s*<\/div>/, "0"),
        downloadLink: extractMatch(/href="(https:\/\/tikcdn\.io\/ssstik\/[^\"]+)"/, "No download link found."),
        mp3DownloadLink: extractMatch(/<a href="(https:\/\/tikcdn\.io\/ssstik\/[^\"]+)"[^>]*class="pure-button[^>]*download_link music[^>]*">/, "No MP3 download link found."),
      };

      res.json(result);
    } catch (error) {
      console.error('Error in TikTok DL API:', error);
      res.status(500).json({ error: "Internal server error", message: error.message });
    }
  }
};

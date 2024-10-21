const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/songs", (req, res) => {
  const songDir = path.join(__dirname, "public", "songs");
  fs.readdir(songDir, (err, files) => {
    if (err) {
      console.error("Error reading songs directory:", err);
      return res.status(500).send("Server error");
    }
    const songs = files
      .filter((file) => file.endsWith(".mp3"))
      .map((file) => ({
        songName: file,
        songURL: `/songs/${file}`,
      }));
    console.log(songs);
    res.setHeader("Content-Type", "application/json");
    res.json(songs);
  });
  //   res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on  http://localhost:${port}`);
});

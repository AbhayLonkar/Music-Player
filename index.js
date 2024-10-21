const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/songs", (req, res) => {
  const songDir = path.join(__dirname, "public");
  fs.readdir(songDir, (err, files) => {
    if (err) {
      console.error("Error reading songs directory:", err);
      return res.status(500).send("Server error");
    }
    let songs = files
      .filter((file) => file.endsWith(".mp3"))
      .map((file) => ({
        songName: `${file}`,
        songURL: `/${file}`,
      }));
    songs = JSON.stringify(songs);
    // console.log(songs);
    fs.writeFileSync(path.join(__dirname, "public", "response.json"), songs);
    res.setHeader("Content-Type", "application/json");
    res.send(songs);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on  http://localhost:${port}`);
});

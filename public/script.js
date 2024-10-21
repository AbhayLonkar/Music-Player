const audio = new Audio();
const body = document.querySelector("body");
const toggleSong = document.querySelector("#play-pause");
const seekBar = document.querySelector("#seekbar");
const currentTime = document.querySelector(".current-time");
const songDuraton = document.querySelector(".song-length");
const songName = document.querySelector(".song-name");
const next = document.querySelector("#next-song");
const previous = document.querySelector("#previous-song");
const songList = document.querySelector(".song-list");
const songThumbnail = document.querySelector("#song-thumbnail");
const container = document.querySelector(".container");
const closeBtn = document.querySelector("#close-sidebar");
const sidebar = document.querySelector(".sidebar-container");
const menu = document.querySelector("#menu");
let songIndex = 0;

let songStatus = false;
let songs = [],
  temp,
  songNames = [];

const loadImage = (songURL) => {
  fetch(songURL)
    .then((response) => response.blob())
    .then((blob) => {
      const jsmediatags = window.jsmediatags;
      jsmediatags.read(blob, {
        onSuccess: function (tag) {
          // console.log(tag);
          var image = tag.tags.picture;
          if (image) {
            var base64String = "";
            for (var i = 0; i < image.data.length; i++) {
              base64String += String.fromCharCode(image.data[i]);
            }
            var base64 =
              `data:${tag.tags.picture.format};base64,` +
              window.btoa(base64String);
            body.style.backgroundImage = `url(${base64})`;
            songThumbnail.setAttribute("src", base64);
          } else {
            let imgURL = "./moon.jpg";
            body.style.backgroundImage = `url(${imgURL})`;
            songThumbnail.setAttribute("src", imgURL);
            // console.log("something went wrong");
          }
        },
        onError: function (error) {
          console.log(error);
          const imgURL = "./moon.jpg";
          body.style.backgroundImage = `url(${imgURL})`;
          songThumbnail.setAttribute("src", imgURL);
        },
      });
    })
    .catch((error) => {
      console.error("Error fetching song:", error);
      // Fallback image
      const imgURL = "./moon.jpg";
      body.style.backgroundImage = `url(${imgURL})`;
      songThumbnail.setAttribute("src", imgURL);
    });
};

const fetchSongs = async () => {
  let a = await fetch("https://music-player-beige-alpha.vercel.app/songs");
  let b = await a.json();
  temp = b;
  b.forEach((item) => {
    songs.push(item.songURL);
    songNames.push(item.songName);
    const list = document.createElement("li");
    list.classList.add("list-item");
    list.textContent = item.songName;
    songList.append(list);
  });

  let listItems = document.querySelectorAll(".list-item");
  Array.from(listItems).forEach((x, index) => {
    x.addEventListener("click", (e) => {
      changeSong(index);
      if (audio.paused) toggleSongStatus();
    });
  });

  audio.src = songs[songIndex];
  loadImage(songs[songIndex]);
  songName.textContent = songNames[0];
  audio.load();
};

audio.addEventListener("loadedmetadata", () => {
  calSongDuration();
});

fetchSongs();

const toggleSongStatus = () => {
  if (songStatus) {
    audio?.pause();
    toggleSong.src = "./play.svg";
    songStatus = false;
  } else {
    audio?.play();
    toggleSong.src = "./pause.svg";
    songStatus = true;
  }
};

toggleSong.addEventListener("click", toggleSongStatus);

const ontimeUpdate = () => {
  // console.log(audio.currentTime, audio.duration);
  let min = Math.floor(audio.currentTime / 60);
  min = min < 10 ? `0${min}` : min;
  let sec = Math.floor(audio.currentTime % 60);
  sec = sec < 10 ? `0${sec}` : sec;
  currentTime.textContent = `${min}:${sec}`;
  seekBar.value = audio.currentTime;
};
audio.addEventListener("timeupdate", ontimeUpdate);

const calSongDuration = () => {
  seekBar.max = audio.duration;
  seekBar.value = `0`;
  let min = Math.floor(audio.duration / 60);
  min = min < 10 ? `0${min}` : min;
  let sec = Math.floor(audio.duration % 60);
  sec = sec < 10 ? `0${sec}` : sec;

  songDuraton.textContent = `${min}:${sec}`;
};

seekBar.addEventListener("input", (e) => {
  audio.currentTime = e.target.value;
});

const changeSong = (index) => {
  audio.src = songs[index];
  songName.textContent = songNames[index];
  loadImage(songs[index]);
  toggleSongStatus();
};

next.addEventListener("click", () => {
  if (!audio.paused) {
    toggleSongStatus();
  }
  if (songIndex >= songNames.length - 1) {
    songIndex = 0;
  } else songIndex++;
  changeSong(songIndex);
});

previous.addEventListener("click", () => {
  if (!audio.paused) {
    toggleSongStatus();
  }
  if (songIndex == 0) {
    songIndex = songNames.length - 1;
  } else songIndex--;
  changeSong(songIndex);
});

const checkScreenSize = () => {
  if (screen.availWidth < 920) {
    if (!sidebar.classList.contains("hide")) {
      container.style.filter = `blur(10px)`;
      closeBtn.style.display = "inline-block";
    }
  } else {
    container.style.filter = "none";
    closeBtn.style.display = "none";
    menu.style.display = "none";
    if (sidebar.classList.contains("hide")) {
      sidebar.classList.remove("hide");
    }
  }
};

window.addEventListener("load", checkScreenSize);
window.addEventListener("resize", checkScreenSize);
closeBtn.addEventListener("click", () => {
  sidebar.classList.add("hide");
  container.style.filter = "none";
  menu.style.display = "inline-block";
});

menu.addEventListener("click", () => {
  sidebar.classList.remove("hide");
  menu.style.display = "none";
  container.style.filter = `blur(10px)`;
});

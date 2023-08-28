const image = document.getElementById("cover");
const title = document.getElementById("musicTitle");
const artist = document.getElementById("musicArtist");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const progress = document.getElementById("progress");
const playerProgress = document.getElementById("playerProgress");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const playBtn = document.getElementById("play");
const background = document.getElementById("bgImg");
const music = new Audio();
const songs = [
  {
    path: "songs/nightwish.mp3",
    displayName: "Over the Hills and Far Away",
    cover: "songs/night.jpg",
    artist: "Nightwish",
  },
  {
    path: "songs/goldenSun.mp3",
    displayName: "The Elemental Stars",
    cover: "songs/goldenSun.jpg",
    artist: "Golden Sun OST",
  },
  {
    path: "songs/bonjovi.mp3",
    displayName: "I'll Be There For You",
    cover: "songs/bonjovii.jpg",
    artist: "Bon Jovi",
  },
  {
    path: "songs/donkeyc2.mp3",
    displayName: "Hot Head Bop",
    cover: "songs/dkc2.jpg",
    artist: "David Wise",
  },
  {
    path: "songs/hola.mp3",
    displayName: "Hola!",
    cover: "songs/Hola!.jpg",
    artist: "PXNDX",
  },
  {
    path: "songs/mining.mp3",
    displayName: "Mining Melancholy",
    cover: "songs/dkcountry.jpg",
    artist: "David Wise",
  },
];

let musicIndex = 0;
let isPlaying = false;

function togglePlay() {
  if (isPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

function playMusic() {
  isPlaying = true;
  playBtn.classList.replace("fa-play", "fa-pause");
  playBtn.setAttribute("title", "Pause");
  music.play();
}

function pauseMusic() {
  isPlaying = false;
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
  music.pause();
}

function loadMusic(song) {
  music.src = song.path;
  title.textContent = song.displayName;
  artist.textContent = song.artist;
  image.src = song.cover;
  background.src = song.cover;
}

function changeMusic(direction) {
  musicIndex = (musicIndex + direction + songs.length) % songs.length;
  loadMusic(songs[musicIndex]);
  playMusic();
}

function updateProgressBar() {
  const { duration, currentTime } = music;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
  const formatTime = (time) => String(Math.floor(time)).padStart(2, "0");
  durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(
    duration % 60
  )}`;
  currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(
    currentTime % 60
  )}`;
}

function setProgressBar(e) {
  const width = playerProgress.clientWidth;
  const clickX = e.offsetX;
  music.currentTime = (clickX / width) * music.duration;
}

playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", () => changeMusic(-1));
nextBtn.addEventListener("click", () => changeMusic(1));
music.addEventListener("ended", () => changeMusic(1));
music.addEventListener("timeupdate", updateProgressBar);
playerProgress.addEventListener("click", setProgressBar);
loadMusic(songs[musicIndex]);

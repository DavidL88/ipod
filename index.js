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
const volumeBar = document.getElementById("volumeBar");
const volumeRelleno = document.getElementById("volumeRelleno");
const volumeBolita = document.getElementById("volumeBolita");
const music = new Audio();
let isDragging = false;
const songs = [
  {
    path: "songs/pumpit.mp3",
    displayName: "Pump It",
    cover: "songs/pump.jpg",
    artist: "The Black Eyed Peas",
  },
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
    path: "songs/sonador.mp3",
    displayName: "El Gran Soñador",
    cover: "songs/dig3.jpg",
    artist: "Ricardo Silva",
  },
  {
    path: "songs/yaloveia.mp3",
    displayName: "Ya lo veía venir",
    cover: "songs/mode.jpg",
    artist: "Moderatto",
  },
  {
    path: "songs/mining.mp3",
    displayName: "Mining Melancholy",
    cover: "songs/dkcountry.jpg",
    artist: "David Wise",
  },
  {
    path: "songs/atrapasuenos.mp3",
    displayName: "El Atrapahumjenjos Yo Soy",
    cover: "songs/atrapa.jpg",
    artist: "Mägo de Oz",
  },
  {
    path: "songs/digop2.mp3",
    displayName: "Impacto Rojo",
    cover: "songs/dig2.jpg",
    artist: "Ricardo Silva",
  },
  {
    path: "songs/coolo.mp3",
    displayName: "Coolo",
    cover: "songs/valderrama.jpg",
    artist: "Illya Kuryaki & The Valderramas",
  },
  {
    path: "songs/mundo.mp3",
    displayName: "Amor Inmortal",
    cover: "songs/maguie.jpg",
    artist: "Maggie Vera",
  },
  {
    path: "songs/digop1.mp3",
    displayName: "Butterfly",
    cover: "songs/cesar.jpg",
    artist: "Cisar Franck",
  },
  {
    path: "songs/bird.mp3",
    displayName: "Blue Bird",
    cover: "songs/blue.jpg",
    artist: "Ikimono Gakari",
  },
  {
    path: "songs/pokerap.mp3",
    displayName: "Pokerap",
    cover: "songs/pokerap.jpg",
    artist: "Oscar Roa",
  },
  {
    path: "songs/air.mp3",
    displayName: "Playground Love",
    cover: "songs/air.jpg",
    artist: "AIR",
  },
  {
    path: "songs/scotpilgrim.mp3",
    displayName: "Black Sheep",
    cover: "songs/scottpilgrim.jpg",
    artist: "Brie Larson",
  },
  {
    path: "songs/pelotero.mp3",
    displayName: "Grandes Ligas",
    cover: "songs/pelotero.jpg",
    artist: "Lupillo, Alemán, Santa Fe Klan,Snoop Dogg",
  },
  {
    path: "songs/rocket.mp3",
    displayName: "Son Problemas",
    cover: "songs/rocket.jpg",
    artist: "Equipo Rocket",
  },
  {
    path: "songs/msnoop.mp3",
    displayName: "Qué Maldición",
    cover: "songs/msnoop.jpg",
    artist: "Banda Ms feat. Snoop Dog",
  },
  {
    path: "songs/rompecabezas.mp3",
    displayName: "Rompecabezas",
    cover: "songs/rompecabezas.jpg",
    artist: "Los concorde",
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
  if (!isNaN(duration) && duration !== 0) {
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    const formatTime = (time) => String(Math.floor(time)).padStart(2, "0");
    durationEl.textContent = `${formatTime(
      Math.floor(duration / 60)
    )}:${formatTime(Math.floor(duration % 60))}`;
    currentTimeEl.textContent = `${formatTime(
      Math.floor(currentTime / 60)
    )}:${formatTime(Math.floor(currentTime % 60))}`;
  }
}

function setProgressBar(e) {
  const width = playerProgress.clientWidth;
  const clickX = e.offsetX;
  music.currentTime = (clickX / width) * music.duration;
}

function adjustVolume(e) {
  const boundingRect = volumeBar.getBoundingClientRect();
  const offsetX = e.clientX - boundingRect.left;
  const volumeLevel = Math.min(1, Math.max(0, offsetX / boundingRect.width));

  music.volume = volumeLevel;
  volumeRelleno.style.setProperty("--fill", volumeLevel * 100 + "%");
  volumeBolita.style.left = volumeLevel * 100 + "%";
}

playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", () => changeMusic(-1));
nextBtn.addEventListener("click", () => changeMusic(1));
music.addEventListener("ended", () => changeMusic(1));
music.addEventListener("timeupdate", updateProgressBar);
playerProgress.addEventListener("click", setProgressBar);
volumeBar.addEventListener("mousedown", (e) => {
  isDragging = true;
  adjustVolume(e);
});
document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    adjustVolume(e);
  }
});
document.addEventListener("mouseup", () => {
  isDragging = false;
});

loadMusic(songs[musicIndex]);

import songs from "./songs.js";

const image = document.getElementById("cover");
const title = document.getElementById("musicTitle");
const artist = document.getElementById("musicArtist");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const progress = document.getElementById("progress");
const playerProgress = document.getElementById("playerProgress");
const shuffleBtn = document.getElementById("shufle");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const playBtn = document.getElementById("play");
const repeatBtn = document.getElementById("repeat");
const guitarBtn = document.getElementById("guitar");
const background = document.getElementById("bgImg");
const volumeBar = document.getElementById("volumeBar");
const volumeRelleno = document.getElementById("volumeRelleno");
const volumeBolita = document.getElementById("volumeBolita");
const lyricsSection = document.getElementById("lyrics");

const music = new Audio();
let isRepeatOn = false;
let isDragging = false;
let isShuffleOn = false;
let isGuitarOn = false;
let currentLyricIndex = 0;

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
  const currentTime = music.currentTime;
  localStorage.setItem("currentTime", currentTime);
  musicIndex = (musicIndex + direction + songs.length) % songs.length;
  loadMusic(songs[musicIndex]);
  localStorage.setItem("musicIndex", musicIndex);
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
    localStorage.setItem("currentTime", currentTime);
  }
}

function setProgressBar(e) {
  const width = playerProgress.clientWidth;
  const clickX = e.offsetX;
  music.currentTime = (clickX / width) * music.duration;
  localStorage.setItem("currentTime", currentTimeEl);
}

function adjustVolume(e) {
  const boundingRect = volumeBar.getBoundingClientRect();
  const offsetX = e.clientX - boundingRect.left;
  const volumeLevel = Math.min(1, Math.max(0, offsetX / boundingRect.width));
  music.volume = volumeLevel;
  volumeRelleno.style.setProperty("--fill", volumeLevel * 100 + "%");
  volumeBolita.style.left = volumeLevel * 100 + "%";
  localStorage.setItem("volumeLevel", volumeLevel);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

playBtn.addEventListener("click", () => {
  togglePlay();
});
prevBtn.addEventListener("click", () => changeMusic(-1));
nextBtn.addEventListener("click", () => changeMusic(1));
playerProgress.addEventListener("click", setProgressBar);

music.addEventListener("timeupdate", () => {
  updateProgressBar();

  if (isPlaying) {
    const currentSong = songs[musicIndex];
    const lyrics = currentSong.lyrics || "Letras no disponibles.";
    const lyricLines = lyrics.split("\n");

    let currentTime = music.currentTime;
    let displayedLyrics = "";
    let hasTimestamps = false;

    for (let i = 0; i < lyricLines.length; i++) {
      const line = lyricLines[i];
      if (line.trim() === "") continue;

      const match = line.match(/(\d+):(\d+)\.?(\d+)?\s+(.*)/);
      if (match) {
        hasTimestamps = true;

        const [, minute, second, millisecond] = match;
        const timestamp = parseInt(minute) * 60 + parseInt(second);
        if (millisecond) {
          timestamp += parseInt(millisecond) / 1000;
        }

        if (
          !isNaN(currentTime) &&
          !isNaN(timestamp) &&
          timestamp > currentTime
        ) {
          displayedLyrics = lyricLines
            .slice(i)
            .map((line, index) => {
              if (index === 0) {
                return `<span style="color: #ff8800;">${line.replace(
                  /^\d+:\d+(\.\d+)?\s+/,
                  ""
                )}</span>`;
              }
              return line.replace(/^\d+:\d+(\.\d+)?\s+/, "");
            })
            .join("\n");
          break;
        }
      }
    }

    if (!hasTimestamps) {
      displayedLyrics = lyricLines.join("\n");
    }

    const songTitle = document.getElementById("songTitle");
    const songText = document.getElementById("songText");

    songTitle.textContent = currentSong.displayName;
    songText.innerHTML = displayedLyrics;
  }
});

music.addEventListener("ended", () => {
  if (isRepeatOn) {
    music.currentTime = 0;
    playMusic();
  } else if (isShuffleOn) {
    musicIndex = Math.floor(Math.random() * songs.length);
    loadMusic(songs[musicIndex]);
    playMusic();
  } else {
    changeMusic(1);
  }
});
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

document.addEventListener("DOMContentLoaded", () => {
  const storedMusicIndex = localStorage.getItem("musicIndex");
  const storedVolumeLevel = localStorage.getItem("volumeLevel");
  const storedCurrentTime = localStorage.getItem("currentTime");
  if (storedMusicIndex !== null) {
    musicIndex = parseInt(storedMusicIndex);
    loadMusic(songs[musicIndex]);
    music.volume = parseFloat(storedVolumeLevel);
    volumeRelleno.style.setProperty("--fill", storedVolumeLevel * 100 + "%");
    volumeBolita.style.left = storedVolumeLevel * 100 + "%";
    if (storedCurrentTime !== null) {
      music.currentTime = parseFloat(storedCurrentTime);
    }
  } else {
    loadMusic(songs[musicIndex]);
  }
});

shuffleBtn.addEventListener("click", () => {
  isShuffleOn = !isShuffleOn;

  if (isShuffleOn) {
    shuffleBtn.classList.add("active");
  } else {
    shuffleBtn.classList.remove("active");
  }
});
repeatBtn.addEventListener("click", () => {
  isRepeatOn = !isRepeatOn;

  if (isRepeatOn) {
    repeatBtn.classList.add("active");
  } else {
    repeatBtn.classList.remove("active");
  }
});

guitarBtn.addEventListener("click", () => {
  isGuitarOn = !isGuitarOn;

  if (isGuitarOn) {
    lyricsSection.classList.remove("hidden");
    guitarBtn.classList.add("active");
  } else {
    lyricsSection.classList.add("hidden");
    guitarBtn.classList.remove("active");
  }
});

loadMusic(songs[musicIndex]);

// async function fetchLyrics(artist, term) {
//   const url = `https://www.stands4.com/services/v2/lyrics.php?uid=11997&tokenid=07E6iA4K2TEoQdMn&term=${encodeURIComponent(
//     term
//   )}&artist=${encodeURIComponent(artist)}&format=json`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();
//     console.log("API response:", data); // Log the API response
//     return data.result.lyrics;
//   } catch (error) {
//     console.error("Error fetching lyrics:", error);
//     return "Lyrics not available.";
//   }
// }

// Esta es para API
// async function displayLyrics(artist, term) {
//   const lyrics = await fetchLyrics(artist, term);
//   lyricsSection.innerHTML = `
//     <h1>Letra de la canción</h1>
//     <p>${lyrics}</p>
//   `;
// }

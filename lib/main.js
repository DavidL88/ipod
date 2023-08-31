const getLyrics = require("./getLyrics");
const getSong = require("./getSong");
const options = {
  apiKey: "30ea47e57amsha2d7270afc525e2p1f066cjsn778f2bb20bc1",
  title: "Ya lo veía venir",
  artist: "Moderatto",
  optimizeQuery: true,
};

getLyrics(options).then((lyrics) => console.log(lyrics));
getSong(options).then((song) => console.log(`${song.lyrics}`));

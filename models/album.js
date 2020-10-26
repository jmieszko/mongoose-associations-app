const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  songName: String,
}, 
{timestamps: true} //Optional which is added after the initial set of attributes
);

const albumSchema = new mongoose.Schema({
  albumTitle: String,
  // embed songs in album
  songs: [songSchema], //For any given album, there'll be a songs array.
},
{timestamps: true}
);

const Album = mongoose.model('Album', albumSchema);
const Song = mongoose.model('Song', songSchema);

module.exports = {Album, Song};
const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  tweetText: String,
}, 
{timestamps: true} //Optional which is added after the initial set of attributes
);

const userSchema = new mongoose.Schema({
  name: String,
  // embed tweets in user
  tweets: [tweetSchema], //For any given user, there'll be a tweets array.
},
{timestamps: true}
);

const User = mongoose.model('User', userSchema);
const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = {User, Tweet};

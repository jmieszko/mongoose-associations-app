const router = require("express").Router(); //Router comes with Express.  Enables us to attach routes to a file and express looks at that file for pattern matching
const User = require("../models/user").User;
const Tweet = require("../models/user").Tweet; //Use . notation to refer to specific schema (object)

// const {User, Tweet } = require('..models/user'); //Another way of re-writing the declaratinos for User and Tweet

// NEW USER FORM
router.get("/new", (req, res) => {
	res.render("users/new.ejs");
});

// ADD EMPTY FORM TO USER SHOW PAGE TO ADD TWEET TO A USER
router.get("/:userId", (req, res) => {
	// find user in db by id and add new tweet
	User.findById(req.params.userId, (error, user) => {
		res.render("users/show.ejs", { user });
	});
});

// CREATE A NEW USER
router.post("/", (req, res) => {
	User.create(req.body, (error, user) => {
		res.redirect(`/users/${user.id}`);
	});
});

// CREATE TWEET EMBEDDED IN USER
router.post("/:userId/tweets", (req, res) => {
	console.log(req.body);
	// store new tweet in memory with data from request body
	const newTweet = new Tweet({ tweetText: req.body.tweetText });

	// find user in db by id and add new tweet
	User.findById(req.params.userId, (error, user) => {
		user.tweets.push(newTweet); //Push the most recent tweet onto the array
		user.save((err, user) => { //Saves the user array
			res.redirect(`/users/${user.id}`);
		});
	});
});

router.get('/:userId/tweets/:tweetId/edit', (req, res) => {
    // set the value of the user and tweet ids
    const userId = req.params.userId;
    const tweetId = req.params.tweetId;
    // find user in db by id
    User.findById(userId, (err, foundUser) => {
      // find tweet embedded in user
      const foundTweet = foundUser.tweets.id(tweetId);//Go into foundUser's array of tweets and find the tweet with the id of tweetID
      // update tweet text and completed with data from request body
      res.render('tweets/edit.ejs', { foundUser, foundTweet });
    });
  });
  
  // UPDATE TWEET EMBEDDED IN A USER DOCUMENT
  router.put('/:userId/tweets/:tweetId', (req, res) => { //endpoint in the form
    console.log('PUT ROUTE');
    // set the value of the user and tweet ids
    const userId = req.params.userId;
    const tweetId = req.params.tweetId;
  
    // find user in db by id
    User.findById(userId, (err, foundUser) => {
      // find tweet embedded in user
      const foundTweet = foundUser.tweets.id(tweetId); //Go into foundUser's array of tweets and find the tweet with the id of tweetID
      // update tweet text and completed with data from request body
      foundTweet.tweetText = req.body.tweetText;
      foundUser.save((err, savedUser) => {
        res.redirect(`/users/${foundUser.id}`); //redirects to the show page for the user
      });
    });
  });
  
  router.delete('/:userId/tweets/:tweetId', (req, res) => {
    console.log('DELETE TWEET');
    // set the value of the user and tweet ids
    const userId = req.params.userId;
    const tweetId = req.params.tweetId;
  
    // find user in db by id
    User.findById(userId, (err, foundUser) => {
      // find tweet embedded in user
      foundUser.tweets.id(tweetId).remove(); //Specific for embedded documents when using Mongoose and Mongo
      // update tweet text and completed with data from request body
      foundUser.save((err, savedUser) => {
        res.redirect(`/users/${foundUser.id}`);
      });
    });
  });

module.exports = router; //Exports so that it can be used in other parts of the site

const router = require("express").Router();
const Album = require("../models/album").Album;
const Song = require("../models/album").Song;

//INDEX
router.get("/", (req, res) => {
	Album.find({}, (error, allAlbums) => {
		console.log(allAlbums);
		res.render("albums/index.ejs", {
			albums: allAlbums,
		});
	});
});

//NEW ALBUM FORM
router.get("/new", (req, res) => {
	res.render("albums/new.ejs");
});

router.get("/:albumID", (req, res) => {
	Album.findById(req.params.albumID, (error, album) => {
        console.log(album);
		res.render("albums/show.ejs", { album });
	});
});

//CREATE A NEW ALBUM
router.post("/", (req, res) => {
	Album.create(req.body, (error, newAlbum) => {
		res.redirect(`/albums/${newAlbum.id}`);
	});
});

// CREATE SONG IN ALBUM
router.post("/:albumId/songs", (req, res) => {
	console.log(req.body);
	// store new tweet in memory with data from request body
	const newSong = new Song({ songName: req.body.songName });

	// find user in db by id and add new tweet
	Album.findById(req.params.albumId, (error, album) => {
		album.songs.push(newSong);
		album.save((err, album) => {
			res.redirect(`/albums/${album.id}`);
		});
	});
});

router.get("/:albumId/songs/:songId/edit", (req, res) => {
	// set the value of the user and tweet ids
	const albumId = req.params.albumId;
	const songId = req.params.songId;
	// find user in db by id
	Album.findById(albumId, (err, foundAlbum) => {
		// find tweet embedded in user
		const foundSong = foundAlbum.songs.id(songId);
		// update tweet text and completed with data from request body
		res.render("songs/edit.ejs", { foundAlbum, foundSong });
	});
});

// UPDATE SONG EMBEDDED IN A ALBUM DOCUMENT
router.put("/:albumID/songs/:songId", (req, res) => {
	console.log("PUT ROUTE");
	// set the value of the user and tweet ids
	const albumID = req.params.albumId;
	const songId = req.params.songId;

	// find user in db by id
	Album.findById(albumId, (err, foundAlbum) => {
		// find tweet embedded in user
		const foundSong = foundAlbum.songs.id(songId);
		// update tweet text and completed with data from request body
		foundSong.songName = req.body.songName;
		foundAlbum.save((err, savedAlbum) => {
			res.json(foundSong);
		});
	});
});

router.delete("/:albumId/songs/:songId", (req, res) => {
	console.log("DELETE SONG");
	// set the value of the user and tweet ids
	const albumId = req.params.albumId;
	const songId = req.params.songId;

	// find user in db by id
	Album.findById(albumId, (err, foundAlbum) => {
		// find tweet embedded in user
		foundAlbum.songs.id(songId).remove();
		// update tweet text and completed with data from request body
		foundAlbum.save((err, savedAlbum) => {
			res.redirect(`/albums/${foundAlbum.id}`);
		});
	});
});

router.delete("/:albumID/", (req, res) => {
	console.log("DELETE ALBUM", req.params.albumID);
	// set the value of the user id
	const albumId = req.params.albumID;
	// find user in db by id
	Album.findById(albumId, (err, foundAlbum) => {
		// find tweet embedded in user
		foundAlbum.remove(); //Specific for embedded documents when using Mongoose and Mongo
		res.redirect(`/albums/`);
	});
});

module.exports = router;

// backend/routes/user.js
const express = require('express');

const router = express.Router();
const zod = require("zod");
const { User, Movie, List } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const  { authMiddleware } = require("../middleware");
const axios = require('axios');

const signupBody = zod.object({
    username: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId = user._id;



    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token,
        userId: user._id
    })
})


const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token,
            userId: user._id
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})

router.get("/details", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        res.json({ username: user.username });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user details' });
    }
});

router.post("/movies", authMiddleware, async (req, res) => {
    const { title, imdbRating, director, genre, year, actors, poster, playlistName } = req.body; // Include playlistName
    const movie = new Movie({ title, imdbRating, director, genre, year, actors, poster, playlistName, userId: req.userId });
    await movie.save();
    res.status(201).json(movie);
});

router.get("/movies", authMiddleware, async (req, res) => {
    const { playlistName } = req.query;
    console.log("UserID:", req.userId, "PlaylistName:", playlistName);
    const movies = await Movie.find({ userId: req.userId, playlistName: playlistName });
    res.json(movies);
});

router.delete('/movies/:id', authMiddleware, async (req, res) => {
    try {
        const result = await Movie.deleteOne({ _id: req.params.id, userId: req.userId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json({ message: 'Movie removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing movie' });
    }
});

router.post("/lists", authMiddleware, async (req, res) => {
    const { name } = req.body;
    const newList = new List({ name, userId: req.userId });
    await newList.save();
    res.status(201).json(newList);
});

router.get("/playlists", authMiddleware, async (req, res) => {
    try {
        const playlists = await Movie.distinct("playlistName", { userId: req.userId });
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching playlists' });
    }
});

router.get("/fetch-movie", authMiddleware, async (req, res) => {
    try {
        const response = await axios.get(`https://www.omdbapi.com/?t=${encodeURIComponent(req.query.title)}&apikey=33cf5764`);
        console.log('Poster URL:', response.data.Poster);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch movie from OMDB' });
    }
});

module.exports = router;


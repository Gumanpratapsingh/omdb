// backend/db.js
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://gumanpratap:459Zl396y0YOcvD8@cluster0.f2yikyy.mongodb.net/")

// Create a Schema for Users
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});
const movieSchema = new mongoose.Schema({
    title: String,
    imdbRating: String,
    director: String,
    genre: String,
    year: String,
    actors: String,
    poster: String, // Field for the image URL
    playlistName: String, // Add this line
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});
const listSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const List = mongoose.model('List', listSchema);

const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
	User,
    Movie,
    List
};

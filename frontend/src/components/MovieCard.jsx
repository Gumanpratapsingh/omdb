import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heading } from './Heading';
import { SubHeading } from './SubHeading';
import { Button } from './Button'; // Adjust the path as necessary
import { InputBox } from './InputBox'; // Ensure this import is present

export const MovieCard = () => {
    const [movie, setMovie] = useState(null);
    const [search, setSearch] = useState('');
    const [timeoutId, setTimeoutId] = useState(null);
    const [popup, setPopup] = useState({ show: false, message: '' });
    const [playlistName, setPlaylistName] = useState(''); // State to store the playlist name

    useEffect(() => {
        if (timeoutId) clearTimeout(timeoutId);
        const id = setTimeout(() => {
            fetchMovie();
        }, 2000); 
        setTimeoutId(id);
    }, [search]);

    

    const fetchMovie = async () => {
        setMovie(null); // Set movie to null to trigger the loading state
        try {
            const response = await axios.get(`http://localhost:3000/api/v1/user/fetch-movie?title=${encodeURIComponent(search)}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMovie(response.data);
        } catch (error) {
            console.error('Failed to fetch movie:', error);
            if (error.response && error.response.status === 401) { // Check for unauthorized status
                setPopup({ show: true, message: 'You must be signed in to fetch movies.' });
            } else {
                setPopup({ show: true, message: 'Failed to fetch movie.' });
            }
            setTimeout(() => setPopup({ show: false, message: '' }), 3000); // Hide popup after 3 seconds
        }
    };

    const truncatePlot = (plot) => {
        if (!plot) return ""; // Return an empty string if plot is undefined
        return plot.split(" ").slice(0, 10).join(" ") + (plot.split(" ").length > 10 ? "..." : "");
    };

    const saveMovie = async () => {
        if (playlistName) {
            const movieToSave = {
                title: movie.Title,
                imdbRating: movie.imdbRating,
                director: movie.Director,
                genre: movie.Genre,
                year: movie.Year,
                actors: movie.Actors,
                poster: movie.Poster,
                playlistName: playlistName
            };
            try {
                await axios.post('http://localhost:3000/api/v1/user/movies', movieToSave, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setPopup({ show: true, message: 'Movie added to playlist!' });
                setTimeout(() => setPopup({ show: false, message: '' }), 3000);
            } catch (error) {
                console.error('Failed to save movie:', error);
                setPopup({ show: true, message: 'Failed to add movie to playlist.' });
                setTimeout(() => setPopup({ show: false, message: '' }), 3000);
            }
        } else {
            alert("You must enter a playlist name to save the movie.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen h-30 w-30">
            {popup.show && (
                <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2">
                    {popup.message}
                </div>
            )}
            <div className="bg-white shadow-lg p-4 rounded-lg ">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Enter movie title"
                    className="mb-4 p-2 border rounded"
                />
                {!movie ? (
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <div className="card">
                        <Heading label={movie.Title} />
                        <SubHeading label="Movie Details" />
                        
                        <img src={movie.Poster} alt={movie.Title} className="w-24 h-36" />
                        <p className="w-50 break-words">{truncatePlot(movie.Plot)}</p>
                        <ul>
                            <li>IMDb Rating: {movie.imdbRating}</li>
                            <li>Director: {movie.Director}</li>
                            <li>Genre: {movie.Genre}</li>
                            <li>Year: {movie.Year}</li>
                            <li>Actors: {movie.Actors}</li>
                        </ul>
                        <InputBox
                            label="Playlist Name"
                            placeholder="Enter playlist name"
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e.target.value)}
                        />
                        <Button label="Save Movie" onClick={() => saveMovie()} />
                    </div>
                )}
            </div>
        </div>
    );
};


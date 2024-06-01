import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';

export const PlaylistMovies = () => {
    const { name } = useParams();
    const [movies, setMovies] = useState([]);

    const removeMovie = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/v1/user/movies/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMovies(movies.filter(movie => movie._id !== id)); // Update the state to remove the movie from the list
        } catch (error) {
            console.error('Error removing movie:', error);
        }
    };

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/user/movies?playlistName=${encodeURIComponent(name)}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setMovies(response.data);
                console.log("Fetched movies:", response.data); // Log fetched movies
            } catch (error) {
                console.error('Failed to fetch movies:', error);
            }
        };
        fetchMovies();
    }, [name]);

    return (
        <div>
            <Navbar title={`${name} - MoviesApp`} />
            <h1 className="text-center font-bold text-xl mb-4">Movies in {name}</h1>
            {movies.length === 0 ? (
                <p className="text-center  text-xl mb-4">No movies found in this playlist.</p>
            ) : (
                <div className="flex flex-wrap justify-center">
                    {movies.map((movie, index) => (
                        <div key={index} className="card bg-white shadow-lg p-2 rounded-lg m-2 w-64">
                            <h3>{movie.title}</h3>
                            <img src={movie.poster} alt={movie.title} className="w-32 h-auto" />
                            <p>Director: {movie.director}</p>
                            <p>Genre: {movie.genre}</p>
                            <p>Year: {movie.year}</p>
                            <p>IMDb Rating: {movie.imdbRating}</p>
                            <Button label="Remove" onClick={() => removeMovie(movie._id)} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

};

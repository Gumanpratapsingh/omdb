import React from 'react';
import { MovieCard } from '../components/MovieCard';
import { Navbar } from '../components/Navbar'; // Import the Navbar component

export const Home = () => {
    return (
        <div>
            <Navbar />
            <MovieCard />
        </div>
    );
};

import React from 'react';
import { FaFilm } from 'react-icons/fa'; // Importing a film icon from react-icons
import { UserIcon } from './UserIcon'; // Import UserIcon component

export function Navbar({ title }) { // Accept title as a prop
    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
                <FaFilm className="text-2xl mr-2" /> {/* Icon */}
                <span className="font-semibold text-xl">{title || 'MovieApp'}</span> {/* Display title or default */}
            </div>
            <UserIcon /> {/* Move UserIcon to the right side */}
        </nav>
    );
}


import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Importing user icon from react-icons
import axios from 'axios';
import { Button } from './Button'; // Import the Button component
import { Link } from 'react-router-dom'; // Import the Link component

export const UserIcon = () => {
    const [email, setEmail] = useState('');
    const [showDetails, setShowDetails] = useState(false);
    const isLoggedIn = localStorage.getItem('token');
    const [key, setKey] = useState(0); // Add a key state

    useEffect(() => {
        if (isLoggedIn) {
            const fetchUserDetails = async () => {
                try {
                    const response = await axios.get('http://localhost:3000/api/v1/user/details', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    console.log(response.data); // Add this line to log the response data
                    setEmail(response.data.username); // Ensure this is the correct data field
                    console.log("Email set to:", response.data.username); // Add this to verify the email is being set
                    setKey(prev => prev + 1); // Update key to force rerender
                } catch (error) {
                    console.error('Failed to fetch user details:', error);
                }
            };
            fetchUserDetails();
        }
    }, [isLoggedIn]);

    const handleSignOut = () => {
        localStorage.clear();
        window.location.href = '/signin';
    };

    return (
        <div key={key} className="flex items-center" onClick={() => setShowDetails(!showDetails)}> {/* Use key here */}
           
            <FaUserCircle className="text-2xl mr-2 cursor-pointer" />
            {showDetails && (
                <div className={`absolute right-0 top-10 w-48 bg-white shadow-lg p-4 rounded-lg ${showDetails ? 'block' : 'hidden'}`}>
                    
                    <span className="text-gray-800">{email}</span>
                    
                    <Link to="/list" className="block mt-2 text-center text-blue-600">Go to List</Link>
                    <Button label="Sign out" onClick={handleSignOut} />
                </div>
            )}
        </div>
    );
};

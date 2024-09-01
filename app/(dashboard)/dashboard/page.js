'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export default function Dashboard() {
    // State to hold the fetched data
    const [uses, setUsers] = useState([]);
    // State to handle spinner and error states
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to fetch uses
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/v1/uses');
                setUsers(response.data.data); // Assuming the response data is the array of uses
                setIsLoading(false);
                toast.success('Data fetched successfully.');
            } catch (err) {
                setError(err.message); // Handle errors
                setIsLoading(false); // Set spinner to false if an error occurs
            }
        };

        fetchUsers();
    }, []); // Empty dependency array ensures this runs only once on mount

    // Render UI based on data fetching state
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Display data
    return (
        <div>
            <h1>Uses</h1>
            {uses.use > 0 ? <div>{uses.use}</div> : <div>No uses found.</div>}
        </div>
    );
}

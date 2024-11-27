import React, { useState, useEffect } from 'react';
import '../css/CurrentDateTime.css';

function CurrentDateTime() {
    const [dateTime, setDateTime] = useState(new Date());

    // Update the time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer); // Cleanup on component unmount
    }, []);

    // Format date and time
    const formattedDate = dateTime.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    const formattedTime = dateTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    return (
        <div className="datetime-container">
            <div className="datetime-card">
                <h3 className="datetime-date">{formattedDate}</h3>
                <p className="datetime-time">{formattedTime}</p>
            </div>
        </div>
    );
}

export default CurrentDateTime;
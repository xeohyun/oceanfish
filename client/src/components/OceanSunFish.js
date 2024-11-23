import React, { useState, useEffect } from 'react';
import '../css/OceanSunFish.css';

function OceanSunFish() {
    const [level, setLevel] = useState(1); // Initial level
    const [dailyContribution, setDailyContribution] = useState(0); // Placeholder for daily contribution
    const [stage, setStage] = useState('dust'); // Initial stage

    // Simulate daily contribution updates
    useEffect(() => {
        // Example: Fetch daily contributions (replace with real API call)
        const fetchDailyContribution = () => {
            const contribution = Math.floor(Math.random() * 5) + 1; // Simulated contribution (1–5)
            setDailyContribution(contribution);
            setLevel((prevLevel) => prevLevel + contribution); // Increase level by contribution
        };

        const interval = setInterval(fetchDailyContribution, 24 * 60 * 60 * 1000); // Every 24 hours
        return () => clearInterval(interval); // Cleanup
    }, []);

    // Update stage based on level
    useEffect(() => {
        if (level >= 1 && level <= 3) {
            setStage('dust'); // 먼지 단계
        } else if (level >= 4 && level <= 10) {
            setStage('baby'); // 아기 단계
        } else if (level >= 11 && level <= 30) {
            setStage('adult'); // 개복치 단계
        } else if (level >= 31 && level <= 50) {
            setStage('king'); // 왕복치 단계
        } else if (level >= 51) {
            setStage('new'); // 새로운 개복치 생성
            setLevel(1); // Reset level for new ocean sunfish
        }
    }, [level]);

    return (
        <div className="ocean-level-container">
            <h2>Level: {level}</h2>
            <p>Stage: {stage}</p>
            <div className="ocean-image">
                <img
                    src={`../img/ocean-${stage}.png`} // Dynamically load images based on stage
                    alt={stage}
                />
            </div>
            <p>Today's Contribution: {dailyContribution}</p>
        </div>
    );
}

export default OceanSunFish;

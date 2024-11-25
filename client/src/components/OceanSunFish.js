import React, { useState, useEffect } from 'react';
import dustLeft from '../img/dust_left.png';
import dustRight from '../img/dust_right.png';
import fishLeft from '../img/adult_left.png';
import fishLeft1 from '../img/adult_left1.png';
import fishRight from '../img/adult_right.png';
import fishRight1 from '../img/adult_right1.png';
import '../css/OceanSunFish.css';

function OceanSunFish() {
    const [level, setLevel] = useState(1);
    const [isAlive, setIsAlive] = useState(true);
    const [dailyContribution, setDailyContribution] = useState(0);
    const [stage, setStage] = useState('dust');

    const images = {
        dust: dustLeft,
        dustRight: dustRight,
        fishLeft: fishLeft,
        fishLeft1: fishLeft1,
        fishRight: fishRight,
        fishRight1: fishRight1,
    };

    useEffect(() => {
        const fetchSunfishData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/sunfish/');
                if (!response.ok) {
                    throw new Error('Failed to fetch sunfish data');
                }
                const data = await response.json();
                setLevel(data.level);
                setIsAlive(data.is_alive);
                setDailyContribution(data.daily_contribution);
                updateStage(data.level);
            } catch (error) {
                console.error('Error fetching sunfish data:', error);
            }
        };

        fetchSunfishData();
    }, []);

    const updateStage = (level) => {
        if (level >= 1 && level <= 3) {
            setStage('dust');
        } else if (level >= 4 && level <= 10) {
            setStage('baby');
        } else if (level >= 11 && level <= 30) {
            setStage('adult');
        } else if (level >= 31 && level <= 50) {
            setStage('king');
        } else if (level >= 51) {
            setStage('new');
            setLevel(1);
        }
    };

    return (
        <div className="ocean-level-container">
            <h2>Level: {level}</h2>
            <p>Stage: {stage}</p>
            <p>Status: {isAlive ? 'Alive' : 'Dead'}</p>
            <div className="ocean-image">
                <img src={images[stage]} alt={stage} />
            </div>
            <p>Today's Contribution: {dailyContribution}</p>
        </div>
    );
}

export default OceanSunFish;

import React, { useState, useEffect } from 'react';
import dustLeft from '../img/dust_left.png';
import dustLeft1 from '../img/dust_left1.png';
import dustRight from '../img/dust_right.png';
import dustRight1 from '../img/dust_right1.png';
import fishLeft from '../img/adult_left.png';
import fishLeft1 from '../img/adult_left1.png';
import fishRight from '../img/adult_right.png';
import fishRight1 from '../img/adult_right1.png';
import '../css/MovingFish.css';

function MovingFish() {
    const [position, setPosition] = useState({ x: 0, y: 0 }); // Fish position
    const [direction, setDirection] = useState('right'); // Movement direction
    const [frame, setFrame] = useState(0); // Animation frame
    const [stage, setStage] = useState('dust'); // Fish stage (dust/fish)
    const [isAlive, setIsAlive] = useState(true); // Fish alive state
    const [level, setLevel] = useState(1); // Fish level

    // 이미지 맵 정의
    const images = {
        dust: {
            left: [dustLeft],
            right: [dustRight],
        },
        fish: {
            left: [fishLeft, fishLeft1],
            right: [fishRight, fishRight1],
        },
    };

    // Fetch initial fish data from backend
    useEffect(() => {
        const fetchFishData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/sunfish/');
                if (!response.ok) {
                    throw new Error('Failed to fetch fish data');
                }
                const data = await response.json();
                setLevel(data.level);
                setStage(data.level <= 3 ? 'dust' : 'fish');
                setIsAlive(data.is_alive);
            } catch (error) {
                console.error('Error fetching fish data:', error);
            }
        };

        fetchFishData();
    }, []);

    // Random movement logic
    useEffect(() => {
        if (!isAlive) return;

        const moveFish = () => {
            setPosition((prev) => ({
                x: Math.max(0, Math.min(window.innerWidth - 150, prev.x + (Math.random() * 100 - 50))),
                y: Math.max(0, Math.min(window.innerHeight - 150, prev.y + (Math.random() * 100 - 50))),
            }));

            // 방향 전환은 천천히 이루어지도록 간격을 둠
            const shouldChangeDirection = Math.random() > 0.7; // 30% 확률로 방향 변경
            if (shouldChangeDirection) {
                setDirection((prev) => (prev === 'left' ? 'right' : 'left'));
            }

            setFrame((prevFrame) => (prevFrame === 0 ? 1 : 0)); // Alternate frame for animation
        };

        const interval = setInterval(moveFish, 3000); // Move every 4 seconds (더 느리게 이동)
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [isAlive]);

    // Handle fish death
    useEffect(() => {
        if (!isAlive) {
            console.log('The fish has died!');
        }
    }, [isAlive]);

    // Image selection based on state
    const getImageSrc = () => {
        return images[stage][direction]/*[frame]*/;
    };

    return (
        <>
            {isAlive && (
                <div
                    className="moving-fish"
                    style={{
                        position: 'absolute',
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        transition: 'top 2s ease, left 2 ease', // 천천히 이동
                    }}
                >
                    <img
                        src={getImageSrc()}
                        alt={stage}
                        style={{ width: '80px', height: 'auto' }}
                    />
                </div>
            )}
        </>
    );
}

export default MovingFish;

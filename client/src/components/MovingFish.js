import React, { useEffect, useState } from 'react';
import '../css/MovingFish.css';
import dustLeft from '../img/dust_left.png';
import babyLeft from '../img/baby_left.png';
import fishLeft from '../img/adult_left.png';
import kingLeft from '../img/king_left.png';


function MovingFish({ stage, level=0 }) {
    // Random initial position
    const getRandomPosition = () => {
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        return {
            top: Math.random() * (windowHeight - 100), // Random top position within window bounds
            left: Math.random() * (windowWidth - 100), // Random left position within window bounds
        };
    };

    // State for position and direction
    const [position, setPosition] = useState(getRandomPosition());
    const [direction, setDirection] = useState(1); // 1: right, -1: left



    // Map stages to corresponding images
    const stageImages = {
        dust: dustLeft,
        baby: babyLeft,
        adult: fishLeft,
        king: kingLeft,
    };

    // Get the current image based on the stage
    const currentImage = stageImages[stage]

    const getZIndex = (stage) => (stage === 'king' ? 0 : 10);

    const zIndex = getZIndex(stage);

    const getDefaultScale = (stage) => {
    if (stage === 'king') {
        return 2.5; // king은 고정된 값 반환
    }

    // Define scale factors for other stages
    const scaleFactors = {
        dust: 1.5,
        baby: 2.2,
        adult: 1.8,
        king: 3.0, // fallback value for king, though it's overridden above
    };

    // Return the scale factor for the given stage, or 1.0 if unknown
    return scaleFactors[stage] || 1.0;
};

    const getScaleByLevel = (stage, level) => {
    const baseScale = getDefaultScale(stage);
    const scaleIncrement = 0.1;
    return baseScale + level * scaleIncrement;
};

    const scale = getScaleByLevel(stage,level); // Get size based on current level

    useEffect(() => {
        const moveFish = () => {
            const windowHeight = window.innerHeight - 30;
            const windowWidth = window.innerWidth;

            const randomTop = Math.max(0, Math.min(windowHeight - 100, position.top + Math.random() * 100 - 50));
            const randomLeft = Math.max(0, Math.min(windowWidth - 100, position.left + Math.random() * 100 - 50));

            setPosition({ top: randomTop, left: randomLeft });

            // Flip direction based on movement
            setDirection(randomLeft > position.left ? 1 : -1);
        };

        // Move the fish every 2 seconds
        const interval = setInterval(moveFish, 2000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [position]);

    return (
        <div
            className="moving-fish"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                transform: `scaleX(${direction}) scale(${scale})`, // Flip image based on direction
                zIndex: zIndex,
            }}
        >
            <img src={currentImage} alt="Sunfish" style={{ width: '100%', height: '100%' }} />
        </div>
    );
}

export default MovingFish;

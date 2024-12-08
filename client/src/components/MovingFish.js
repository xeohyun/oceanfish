import React, { useEffect, useState } from 'react';
import '../css/MovingFish.css'; // Ensure the correct CSS file is linked

// Import images for different stages
import dustLeft from '../img/dust_left.png';
import babyLeft from '../img/baby_left.png';
import fishLeft from '../img/adult_left.png';
import kingLeft from '../img/king_left.png';
import OceanSunFishStatus from "./OceanSunFishStatus";

function MovingFish({ stage, level }) {
    const [position, setPosition] = useState({ top: 400, left: 700 }); // Initial position (center of screen)
    const [direction, setDirection] = useState(1); // 1: right, -1: left (for flipping the image)

    // Map stages to corresponding images
    const stageImages = {
        dust: dustLeft,
        baby: babyLeft,
        adult: fishLeft,
        king: kingLeft,
    };

    // Get the current image based on the stage
    const currentImage = stageImages[stage] || dustLeft; // Default to dustLeft if stage is unknown

    const getDefaultSize = (stage) => {
    // Define default sizes for each stage
    const defaultSizes = {
        dust: 20, // Default size for dust
        baby: 80, // Default size for baby
        adult: 200, // Default size for adult
        king: 400, // Default size for king
    };

    // Return the default size for the given stage, or 50 as a fallback
    return defaultSizes[stage] || 50;
};

    const getSizeByLevel = (level) => {
        const baseSize = getDefaultSize(stage); // Minimum size (level 1)
        const sizeIncrement = 10; // Increment per level
        return baseSize + level * sizeIncrement;
    };


    const size = getSizeByLevel(level + 10); // Get size based on current level

    useEffect(() => {
        const moveFish = () => {
            const windowHeight = window.innerHeight;
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
                transform: `scaleX(${direction})`, // Flip image based on direction
                width: `${size}px`, // Dynamically set width
                height: `${size}px`, // Dynamically set height
            }}
        >
            <img src={currentImage} alt="Sunfish" style={{ width: '100%', height: '100%' }} />
        </div>
    );
}

export default MovingFish;

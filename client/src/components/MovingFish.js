import React, { useEffect, useState } from 'react';
import '../css/MovingFish.css';
import dustLeft from '../img/dust_left.png';
import babyLeft from '../img/baby_left.png';
import fishLeft from '../img/adult_left.png';
import kingLeft from '../img/king_left.png';
import OceanSunFishStatus from "./OceanSunFishStatus";

function MovingFish({ stage, level=0 }) {
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
    const currentImage = stageImages[stage]

    const getDefaultScale = (stage) => {
        if(stage == 'king'){
            return 2.5;
        }
        const defaultSizes=(stage) => {
                const scaleFactors = {
                dust: 0.5,
                baby: 1.0,
                adult: 2.0,
                king: 3.0,
            };
            const scale = scaleFactors[stage];
            return scale || 1.0; // Fallback to 1.0 if stage is unknown
        };
    // Return the default size for the given stage, or 50 as a fallback
    return defaultSizes[stage] || 1.0;
};

    const getScaleByLevel = (stage, level) => {
    const baseScale = getDefaultScale(stage);
    const scaleIncrement = 0.1;
    return baseScale + level * scaleIncrement;
};

    const scale = getScaleByLevel(stage,level); // Get size based on current level

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
                transform: `scaleX(${direction}) scale(${scale})`, // Flip image based on direction
            }}
        >
            <img src={currentImage} alt="Sunfish" style={{ width: '100%', height: '100%' }} />
        </div>
    );
}

export default MovingFish;

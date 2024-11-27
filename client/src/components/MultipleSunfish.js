/*
import React, { useState, useEffect } from "react";
import "../css/MultipleSunfish.css";

function MultipleSunfish() {
    const [sunfishList, setSunfishList] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false); // Toggle state for expansion

    useEffect(() => {
        const fetchSunfishData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/sunfish/");
                if (!response.ok) {
                    throw new Error("Failed to fetch sunfish data");
                }
                const data = await response.json();
                setSunfishList(data);
            } catch (error) {
                console.error("Error fetching sunfish data:", error);
            }
        };

        fetchSunfishData();
    }, []);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded); // Toggle expansion state
    };

    return (
            <div className={`sunfish-container ${isExpanded ? "active" : ""}`} onClick={toggleExpansion}>
                {sunfishList.length > 0 ? (
                    sunfishList.map((sunfish, index) => (
                        <div key={index} className="sunfish-item">
                            <p>Name: {sunfish.name}</p>
                            <p>Level: {sunfish.level}</p>
                            <p>Status: {sunfish.is_alive ? "Alive" : "Dead"}</p>
                        </div>
                    ))
                ) : (
                    <p>No sunfish available.</p>
                )}
            </div>
    );
}

export default MultipleSunfish;*/

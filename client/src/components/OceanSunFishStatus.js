import React, { useState, useEffect } from 'react';
import dustLeft from '../img/dust_left.png';
import dustRight from '../img/dust_right.png';
import fishLeft from '../img/adult_left.png';
import kingLeft from '../img/king_left.png';
import '../css/OceanSunFish.css';

function OceanSunFishStatus() {
    const [sunfish, setSunfish] = useState(null); // 가장 최근 Sunfish 데이터를 저장
    const [allSunfish, setAllSunfish] = useState([]); // 모든 Sunfish 데이터를 저장
    const [dropdownOpen, setDropdownOpen] = useState(false); // 드롭다운 상태

    const images = {
        dust: dustLeft,
        baby: dustRight,
        adult: fishLeft,
        king: kingLeft,
    };

    // API에서 데이터를 가져오는 함수
    useEffect(() => {
        const fetchSunfishData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/sunfish/');
                if (!response.ok) {
                    throw new Error('Failed to fetch sunfish data');
                }
                const data = await response.json();

                if (Array.isArray(data) && data.length > 0) {
                    // 가장 최근 Sunfish를 설정
                    const latestSunfish = data[data.length - 1];
                    setSunfish(latestSunfish);

                    // 살아있는 Sunfish만 필터링하여 저장
                    const aliveSunfish = data.filter((fish) => fish.is_alive);
                    setAllSunfish(aliveSunfish);
                } else {
                    console.warn("No Sunfish data available");
                    setSunfish(null);
                    setAllSunfish([]);
                }
            } catch (error) {
                console.error('Error fetching sunfish data:', error);
            }
        };

        fetchSunfishData();
    }, []);

    if (!sunfish) {
        return <div>Loading Sunfish...</div>; // Sunfish 데이터가 없을 경우 로딩 메시지
    }

    // 단계(stage) 계산
    const getStage = (level) => {
        if (level >= 1 && level <= 3) {
            return 'dust';
        } else if (level >= 4 && level <= 10) {
            return 'baby';
        } else if (level >= 11 && level <= 30) {
            return 'adult';
        } else if (level >= 31 && level <= 50) {
            return 'king';
        }
        return 'dust'; // 기본값
    };

    const stage = getStage(sunfish.level);
    const currentImage = images[stage]; // 현재 단계에 맞는 이미지 선택

    return (
        <div className="ocean-level-container">
            {/* 현재 Sunfish 상태 표시 */}
            <div
                className="current-sunfish-container"
                onClick={() => setDropdownOpen((prev) => !prev)} // 클릭 시 드롭다운 토글
            >
                <h2>Level: {sunfish.level}</h2>
                <p>Stage: {stage}</p>
                <p>Status: {sunfish.is_alive ? 'Alive' : 'Dead'}</p>
                <div className="ocean-image">
                    <img src={currentImage} alt={stage} />
                </div>
                <p>Today's Contribution: {sunfish.daily_contribution || 0}</p>
                <p className="dropdown-toggle">{dropdownOpen ? 'Hide All Fish ▼' : 'Show All Fish ▲'}</p>
            </div>

            {/* 드롭다운: 모든 살아있는 Sunfish 표시 */}
            {dropdownOpen && (
                <div className="sunfish-dropdown">
                    {allSunfish.length === 0 ? (
                        <p>No alive Sunfish available.</p>
                    ) : (
                        allSunfish.map((fish) => {
                            const fishStage = getStage(fish.level);
                            const fishImage = images[fishStage];

                            return (
                                <div key={fish.id} className="dropdown-sunfish-item">
                                    <img src={fishImage} alt={fishStage} className="dropdown-sunfish-image" />
                                    <div className="dropdown-sunfish-info">
                                        <p>Name: {fish.name}</p>
                                        <p>Status: {fish.is_alive ? 'Alive' : 'Dead'}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}

export default OceanSunFishStatus;

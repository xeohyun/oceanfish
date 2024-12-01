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

    useEffect(() => {
        const fetchSunfishData = async () => {
            try {
                // Sunfish 데이터를 가져오기
                const response = await fetch('http://127.0.0.1:8000/api/sunfish/');
                if (!response.ok) {
                    throw new Error('Failed to fetch Sunfish data');
                }
                const data = await response.json();

                if (Array.isArray(data) && data.length > 0) {
                    const latestSunfish = data[data.length - 1];
                    setSunfish(latestSunfish);

                    // 살아있는 Sunfish만 필터링하여 저장
                    const aliveSunfish = data.filter((fish) => fish.is_alive);
                    setAllSunfish(aliveSunfish);

                    // 기여도를 기반으로 레벨업 처리
                    await handleLevelUp(latestSunfish.id);
                } else {
                    console.warn("No Sunfish data available");
                    setSunfish(null);
                    setAllSunfish([]);
                }
            } catch (error) {
                console.error('Error fetching Sunfish data:', error);
            }
        };

        fetchSunfishData();
    }, []);

    const handleLevelUp = async (sunfishId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/contributions/${sunfishId}/`);
            if (!response.ok) {
                throw new Error('Failed to fetch contributions');
            }
            const contributions = await response.json();

            // 오늘의 기여도를 합산
            const totalContributions = contributions.reduce((sum, entry) => sum + entry.count, 0);

            // 레벨업 계산 (하루 최대 4 레벨)
            const levelUp = Math.min(4, totalContributions);

            // 새로운 레벨을 서버에 반영
            await updateSunfishLevel(sunfishId, levelUp);
        } catch (error) {
            console.error('Error fetching contributions:', error);
        }
    };

    const updateSunfishLevel = async (sunfishId, levelUp) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/sunfish/${sunfishId}/level-up/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ levelUp }),
            });

            if (!response.ok) {
                throw new Error('Failed to update Sunfish level');
            }

            const updatedSunfish = await response.json();
            setSunfish(updatedSunfish); // 업데이트된 Sunfish 데이터 반영
            console.log('Sunfish level updated:', updatedSunfish);
        } catch (error) {
            console.error('Error updating Sunfish level:', error);
        }
    };

    if (!sunfish) {
        return <div>Loading Sunfish...</div>;
    }

    const getStage = (level) => {
        if (level >= 1 && level <= 3) {
            return 'dust';
        } else if (level >= 4 && level <= 10) {
            return 'baby';
        } else if (level >= 11 && level <= 30) {
            return 'adult';
        } else if (level >= 31) {
            return 'king';
        }
        return 'dust'; // 기본값
    };

    const stage = getStage(sunfish.level);
    const currentImage = images[stage];

    return (
        <div className="ocean-level-container">
            {/* 현재 Sunfish 상태 표시 */}
            <div
                className="current-sunfish-container"
                onClick={() => setDropdownOpen((prev) => !prev)}
            >
                <h2>Level: {sunfish.level}</h2>
                <p>Stage: {stage}</p>
                <p>Status: {sunfish.is_alive ? 'Alive' : 'Dead'}</p>
                <div className="ocean-image">
                    <img src={currentImage} alt={stage} />
                </div>
                <p className="dropdown-toggle">{dropdownOpen ? 'Hide All Fish ▲' : 'Show All Fish ▼'}</p>
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

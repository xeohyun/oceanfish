import React, { useState, useEffect } from 'react';
import dustLeft from '../img/dust_left.png';
import babyLeft from '../img/baby_left.png';
import fishLeft from '../img/adult_left.png';
import kingLeft from '../img/king_left.png';
import '../css/OceanSunFish.css';
import CreateFishModal from "./CreateFishModal";

function OceanSunFishStatus() {
    const [sunfish, setSunfish] = useState(null); // 가장 최근 Sunfish 데이터를 저장
    const [allSunfish, setAllSunfish] = useState([]); // 모든 Sunfish 데이터를 저장
    const [dropdownOpen, setDropdownOpen] = useState(false); // 드롭다운 상태
    const [refreshFlag, setRefreshFlag] = useState(false); // 데이터 강제 동기화 플래그
    const [isModalVisible, setModalVisible] = useState(false); // create Sunfish 모달창

    const images = {
        dust: dustLeft,
        baby: babyLeft,
        adult: fishLeft,
        king: kingLeft,
    };

    // 데이터 동기화 API 호출
    const fetchSunfishData = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/sunfish/');
        if (!response.ok) {
            throw new Error('Failed to fetch Sunfish data');
        }
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            // 성장 중인 Sunfish 필터링
            const aliveSunfish = data.filter((fish) => fish.is_alive);

            if (aliveSunfish.length > 0) {
                // 가장 최근 성장 중인 Sunfish 선택
                const latestSunfish = aliveSunfish.sort(
                    (a, b) => new Date(b.creation_date) - new Date(a.creation_date)
                )[0];
                setSunfish(latestSunfish); // 현재 Sunfish 설정
                setAllSunfish(aliveSunfish); // 모든 성장 중인 Sunfish 설정

                // 레벨 및 기여도 동기화
                await handleLevelUp(latestSunfish.id);
            } else {
                // 성장 중인 Sunfish가 없는 경우
                setSunfish(null);
                setAllSunfish([]);
            }
        } else {
            setSunfish(null);
            setAllSunfish([]);
        }
    } catch (error) {
        console.error('Error fetching Sunfish data:', error);
    }
};

    // Sunfish name 생성
     const handleCreateFish = (newName) => {
        fetch('http://127.0.0.1:8000/api/sunfish/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newName }),
        })
            .then(async (response) => {
            if (response.ok) {
                alert(`New Sunfish "${newName}" has been created!`);
            } else {
                // 서버에서 오류 메시지를 받는 경우 처리
                const errorData = await response.json();
                const errorMessage = errorData.error || 'Failed to create Sunfish.';
                alert(`Error: ${errorMessage}`);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An unexpected error occurred while creating the Sunfish.');
        })
        .finally(() => setModalVisible(false));
    }

    // Sunfish 레벨 업데이트 및 기여도 동기화
    const handleLevelUp = async (sunfishId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/contributions/${sunfishId}/`);
            if (!response.ok) {
                throw new Error('Failed to fetch contributions');
            }
            const contributions = await response.json();

            const totalContributions = contributions.reduce((sum, entry) => sum + entry.count, 0);

            const levelUp = Math.min(4, totalContributions);
            await updateSunfishLevel(sunfishId, levelUp);
        } catch (error) {
            console.error('Error handling level up:', error);
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

    // 데이터 동기화: 컴포넌트 마운트 또는 플래그 변경 시 실행
    useEffect(() => {
        fetchSunfishData();
    }, [refreshFlag]); // refreshFlag 변경 시마다 데이터 다시 가져옴


    // 동기화를 강제하는 함수
    const forceRefresh = () => {
        setRefreshFlag((prev) => !prev); // 플래그 토글
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

     if (allSunfish.length === 0) {
         return <div>No alive Sunfish available.</div>;
     }

    const stage = getStage(sunfish.level);
    const currentImage = images[stage];

    return (
        <div className="ocean-level-container">
            {/* 새로고침 버튼 추가 */}
                <button className="refresh-button" onClick={forceRefresh}>
                    Refresh Data
                </button>
                {/* Sunfish가 없는 경우 Modal 표시 */}
                <CreateFishModal
                    isVisible={isModalVisible}
                    onCreate={handleCreateFish}
                    onClose={() => setModalVisible(false)}
                />
                <button onClick={() => setModalVisible(true)}>Simulate Sunfish Creation</button>

                {/* 현재 Sunfish 상태 표시 */}
                <div
                    className="current-sunfish-container"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                >
                    <h2>Level: {sunfish.level}</h2>
                    <p>Stage: {stage}</p>
                    <p>Status: {sunfish.is_alive ? 'Alive' : 'Dead'}</p>
                    <div className="ocean-image">
                        <img src={currentImage} alt={stage}/>
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
                                        <img src={fishImage} alt={fishStage} className="dropdown-sunfish-image"/>
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

import React, { useEffect, useState } from 'react';
import Background from './components/Background';
import OceanSunfish from './components/OceanSunFishStatus';
import './App.css';
import ToDoList from "./components/ToDoList";
import CurrentDateTime from "./components/CurrentDateTime";
import ContributionDisplay from "./components/ContributionDisplay";
import MovingFish from "./components/MovingFish";
import CreateFishModal from "./components/CreateFishModal";

function App() {
    const [sunfishList, setSunfishList] = useState([]); // 모든 Sunfish 데이터를 저장
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [modalVisible, setModalVisible] = useState(false); // 모달 표시 상태

    // Sunfish 데이터를 가져오는 함수
    const fetchSunfishData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/sunfish/');
            if (!response.ok) {
                throw new Error('Failed to fetch Sunfish data');
            }

            const data = await response.json();
            const aliveSunfish = data.filter((fish) => fish.is_alive); // `is_alive` 필터링
            setSunfishList(aliveSunfish); // Sunfish 리스트 저장
        } catch (error) {
            console.error('Error fetching Sunfish data:', error);
        } finally {
            setLoading(false); // 로딩 완료
        }
    };

    // 컴포넌트가 마운트될 때 데이터 가져오기
    useEffect(() => {
        fetchSunfishData();
    }, []);

    // 새로운 Sunfish 생성 함수
    const handleCreateFish = async (newName) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/sunfish/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newName }),
            });

            if (response.ok) {
                alert(`New Sunfish "${newName}" has been created!`);
                setModalVisible(false); // 모달 닫기
                await fetchSunfishData(); // 데이터 다시 가져오기
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.error || 'Failed to create Sunfish.';
                alert(`Error: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred while creating the Sunfish.');
        }
    };

    // 로딩 중일 때 표시할 내용
    if (loading) {
        return <div>Loading Sunfish...</div>;
    }

    // Sunfish가 없을 때 CreateFishModal 표시
    if (sunfishList.length === 0) {
        return (
            <CreateFishModal
                isVisible={true} // Sunfish가 없으므로 항상 모달이 보이도록 설정
                onCreate={handleCreateFish} // 새로운 Sunfish 생성
                onClose={() => setModalVisible(false)} // 모달 닫기 버튼 동작
            />
        );
    }

    // Sunfish가 있는 경우 렌더링
    return (
        <div className="App">
            <Background />
            <ContributionDisplay />
            <OceanSunfish />
            <ToDoList />
            <CurrentDateTime />
            <div className="app-container">
                {sunfishList.map((fish) => (
                    <MovingFish key={fish.id} stage={fish.stage} /> // 각 Sunfish에 대해 MovingFish 렌더링
                ))}
            </div>
        </div>
    );
}

export default App;

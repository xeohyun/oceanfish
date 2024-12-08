import React, {useEffect, useState} from 'react';
import Background from './components/Background';
import OceanSunfish from './components/OceanSunFishStatus';
import './App.css';
import ToDoList from "./components/ToDoList";
import CurrentDateTime from "./components/CurrentDateTime";
import ContributionDisplay from "./components/ContributionDisplay";
import MovingFish from "./components/MovingFish";


function App() {
    const [sunfishList, setSunfishList] = useState([]); // 모든 Sunfish 데이터를 저장
    const [loading, setLoading] = useState(true); // 로딩 상태

    useEffect(() => {
        const fetchSunfishData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/sunfish/');
                if (!response.ok) {
                    throw new Error('Failed to fetch Sunfish data');
                }

                const data = await response.json();
                const aliveSunfish = data.filter((fish) => fish.is_alive); // `is_alive` 필터링
                setSunfishList(aliveSunfish); // Sunfish 리스트 저장
                setLoading(false); // 로딩 완료
            } catch (error) {
                console.error('Error fetching Sunfish data:', error);
                setLoading(false); // 로딩 완료
            }
        };

        fetchSunfishData();
    }, []);

    if (loading) {
        return <div>Loading Sunfish...</div>;
    }

    if (sunfishList.length === 0) {
        return <div>No alive Sunfish available.</div>;
    }

  return (
      <div className="App">
          <Background/>
          <ContributionDisplay/>
          <OceanSunfish/>
          <ToDoList/>
          <CurrentDateTime/>
          <div className="app-container">
              {sunfishList.map((fish) => (
                  <MovingFish key={fish.id} stage={fish.stage}/> // 각 Sunfish에 대해 MovingFish 렌더링
              ))}
          </div>
      </div>
  );
}

export default App;

import React from 'react';
import Background from './components/Background';
import OceanSunfish from './components/OceanSunFish';
import ContributionCalendar from './components/ContributionCalendar';
import './App.css';

function App() {
  return (
      <div className="App">
        <Background />
        <OceanSunfish />
        <ContributionCalendar/>
      </div>
  );
}

export default App;

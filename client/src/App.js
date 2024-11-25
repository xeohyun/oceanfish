import React from 'react';
import Background from './components/Background';
import OceanSunfish from './components/OceanSunFish';
import ContributionCalendar from './components/ContributionCalendar';
import './App.css';
import ToDoList from "./components/ToDoList";
import CurrentDateTime from "./components/CurrentDateTime";
import MovingFish from "./components/MovingFish";

function App() {
  return (
      <div className="App">
        <Background />
        <OceanSunfish />
        <ContributionCalendar/>
          <ToDoList/>
          <CurrentDateTime />
          <MovingFish/>
      </div>
  );
}

export default App;

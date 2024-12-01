import React from 'react';
import Background from './components/Background';
import OceanSunfish from './components/OceanSunFishStatus';
import './App.css';
import ToDoList from "./components/ToDoList";
import CurrentDateTime from "./components/CurrentDateTime";
/*import CreateSunfish from "./components/CreateSunfish";*/
import ContributionDisplay from "./components/ContributionDisplay";


function App() {
  return (
      <div className="App">
        <Background />
          <ContributionDisplay/>
{/*          <CreateSunfish/>*/}
        <OceanSunfish />
          <ToDoList/>
          <CurrentDateTime />
      </div>
  );
}

export default App;

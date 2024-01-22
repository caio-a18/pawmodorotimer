import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {

    const [numClicks, setNumClicks] = useState(0)

    const clickHandler = () => {
      setNumClicks(numClicks + 1); 
    };

  return (
    <div className="App">
    <div className={`dot larger-${numClicks}`}></div>   
    <span className = "foodbowl" onClick={clickHandler}></span>
    </div>
  );
}

export default App;

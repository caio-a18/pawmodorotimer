import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {

    const [numClicks, setNumClicks] = useState(0)

    const clickHandler = () => {
      
      if (numClicks < 4) {
        setNumClicks(numClicks + 1); 
      }
    };
console.log(numClicks)
  return (
    <div className="App">
    <div className={`dot larger-${numClicks}`}></div>   
    <span className = "foodbowl" onClick={clickHandler}></span>
    <div className = "timeset">The Time Is: {numClicks*5}</div>
    </div>
  );
}

export default App;

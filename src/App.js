import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

function App() {

    const [numClicks, setNumClicks] = useState(0)
    //const [hours, setHours] = useState(0)
    ///const [minutes, setMinutes] = useState(0)
    //const [seconds, setSeconds] = useState(0)
    const [timeElapsed, setTimeElapsed] = useState(0)
    const deadline = "December, 31, 2022";

    //handles the gui portion that counts up 20 mins 
    const clickHandler = () => {
      
      if (numClicks < 4) {
        setNumClicks(numClicks + 1); 
      }
      if (numClicks === 4) {
        setTimeElapsed(Date.now()); 
      }
      
    };
    
    //timer functionality starts here 
    const getTime = () => {
      if (numClicks === 4) {
        setTimeElapsed(Date.now()); 
      }
    }; 

    //get the timer to render every second since it errors out otherwise 
    useEffect(() => {
      const interval = setInterval(() => getTime(deadline), 1000);

      return () => clearInterval(interval);
    }, []); 

  return (
    <div className="App">
    <div className={`dot larger-${numClicks}`}></div>   
    <span className = "foodbowl" onClick={clickHandler}></span>
    <div className = "timeset">The Time You Want to Set Is: {numClicks*5}</div>
    <div className = "timer">{timeElapsed}</div>
    </div>
  );
}

export default App;

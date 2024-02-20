import './App.css';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import React from 'react'; 


function App() {
    //variables that control the stopwatch 
    const [isCounting, setIsCounting] = useState(false); 
    const [selectedTime, setSelectedTime] = useState(0)
    const [isPaused, setIsPaused] = useState(true);
    const [time, setTime] = useState(0);
    const [numClicks, setNumClicks] = useState(1);

    useEffect(() => {
      let interval = null; 

      if (isCounting && isPaused === false && time > 0) {
        interval = setInterval(() => {
            setTime((prev) => prev - 1000);
        }, 1000); 
      } else {
        clearInterval(interval); 
      }
      return () => {
        clearInterval(interval); 
      }; 
    }, [isCounting, isPaused, time]); 

    const handleStart = (duration) => {
      setSelectedTime(duration * 60 * 1000); 
      setTime(duration * 60 * 1000); 
      setIsCounting(true); 
      setIsPaused(false); 
    }; 
    
    const handlePause = () => {
      setIsPaused(!isPaused); 
    }; 

    const resetHandler = () => {
      setIsCounting(false); 
      setIsPaused(true); 
      setTime(0); 
      setSelectedTime(0); 
      
    }; 

    //handles the gui portion that counts up 20 mins 
    const clickHandler = () => {
      if (numClicks < 4) {
        setNumClicks(numClicks + 1); 
      }
    };
  
  return (
    <div className="App">
      <div className={`dot larger-${numClicks}`}></div>   
      <span className = "foodbowl" onClick={clickHandler}></span>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div className = "timeset">The Time You Want to Set Is: {numClicks*5}</div>
      <div>
      <Box>
      <Button onClick = {handleStart}>Start</Button>
      <Button onClick = {handlePause}>Stop</Button>
      <Button onClick = {resetHandler}>Reset</Button>
      </Box>
      </div>
    </div>
  );
}

export default App;

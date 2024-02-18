import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import moment from 'moment';
import React from 'react'; 


function App() {

    const [numClicks, setNumClicks] = useState(1)
    const [timeElapsed, setTimeElapsed] = useState(0)
    const initialTime = 20 * 60 * 1000; // 20 minutes in milliseconds
    const [time, setTime] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);
    const formattedTime = moment().utc(time).format('mm:ss');

    const startTimer = () => {
      setIsRunning(true);
    };
  
    const stopTimer = () => {
      setIsRunning(false);
    };
  
    const resetTimer = () => {
      setTime(initialTime);
      setIsRunning(false);
    };

    useEffect(() => {
      let interval;
      if (isRunning) {
        interval = setInterval(() => {
          setTime(prevTime => {
            if (prevTime <= 0) {
              clearInterval(interval);
              setIsRunning(false);
              return 0;
            }
            return prevTime - 1000;
          });
        }, 1000);
      } else {
        clearInterval(interval);
      }
  
      return () => clearInterval(interval);
    }, [isRunning]);

    //handles the gui portion that counts up 20 mins 
    const clickHandler = () => {
      
      //increment the number of clicks over time to keep track of how much time
      //ur putting on the timer 
      if (numClicks < 4) {
        setNumClicks(numClicks + 1); 
      }

      //set time when you 
      if (numClicks === 4) {
        setTimeElapsed(Date.now()); 
      }

      if (numClicks === 4) {
        
      }
      
    };
  
  return (
    <div className="App">
    <div className={`dot larger-${numClicks}`}></div>   
    <span className = "foodbowl" onClick={clickHandler}></span>
    <div className = "timeset">The Time You Want to Set Is: {numClicks*5}</div>
    <div className = "timer">{timeElapsed}</div>

    <h1>20 Minute Timer</h1>
      <div>{formattedTime}</div>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}

export default App;

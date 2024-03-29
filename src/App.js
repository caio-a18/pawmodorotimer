import './App.css';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import React from 'react'; 
import Dashboard from './components/Dashboard';
import Login from './components/Login/Login';
import Preferences from './components/Preferences';
import { BrowserRouter, Route, Switch } from 'react-router-dom'; 
import useToken from './components/App/useToken';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';

function App() {
    const { token, setToken } = useToken();
    const [isCounting, setIsCounting] = useState(false); 
    const [selectedTime, setSelectedTime] = useState(0)
    const [isPaused, setIsPaused] = useState(true);
    const [time, setTime] = useState(0);
    const [numClicks, setNumClicks] = useState(1);
    const [levelTracker, setLevelTracker] = useState(1);
    const [customTime, setCustomTime] = useState(0); 

    const handleChange = e => {
      setCustomTime(e.target.value);
    };

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

    const handleStart = () => {
      if (isPaused || !isCounting) {
        setIsPaused(false);
        setIsCounting(true);
      }
    };
    
    const handlePause = () => {
      setIsPaused(!isPaused);
    };
    
    
    const resetHandler = () => {
      setIsCounting(false);
      setIsPaused(true);
      setTime(selectedTime);
    };

    //handles the gui portion that counts up 20 mins 
    const clickHandler = () => {
      if (numClicks < 4) {
        setNumClicks(numClicks + 1); 
      }
    };

    const howMuchTime = (minutes) => {
      const newTime = minutes * 60 * 1000; // Convert minutes to milliseconds
      if (newTime !== selectedTime || isPaused) { // Check if a new time is selected or if the timer is paused
        setSelectedTime(newTime);
        setTime(newTime);
        setIsPaused(false); // Ensure timer is not paused
        if (!isCounting) {
          setIsCounting(true); // Start counting only if it wasn't already started
        }
      }
    };

    const timeGUI = (ms) => {
      const minutes = Math.floor(ms/60000); 
      const seconds = Math.floor((ms % 60000) / 1000); 
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; 
    }; 

    // Handler to check when time is over
    const handleTimerIsDone = (duration) => {
      if (time === 0 && selectedTime === duration * 60 * 1000) {
        // Timer is over for the specified duration
        // Increases levelTracker
        setLevelTracker(prevLevel => prevLevel + 1);
        alert("Congratulations. You are now level " + (levelTracker + 1) + "!");
      }
    };

    // UseEffect for HandleTimer
    useEffect(() => {
      handleTimerIsDone(1);
      handleTimerIsDone(5);
      handleTimerIsDone(20);
      handleTimerIsDone(60);
    }, [time]);

    if(!token) {
      return <Login setToken={setToken} />
    }
  
  return (
    <div className="App">
      <div className="wrapper">
      <h1>Tomato Paws Timer</h1>
      <BrowserRouter>
        <Switch>
          <Route path="/Dashboard">
            <Dashboard />
          </Route>
          <Route path="/Preferences">
            <Preferences />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
     {/*} <div className={`dot larger-${numClicks}`}></div>   
      
  <span className = "foodbowl" onClick={clickHandler}></span>*/}
      <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '5vh',
                    }}>
      <Button onClick = {() => howMuchTime(60)}>60 Minutes</Button>
      <Button onClick = {() => howMuchTime(20)}>20 Minutes</Button>
      <Button onClick = {() => howMuchTime(5)}>5 Minutes</Button>
      <Button onClick = {() => howMuchTime(1)}>1 Minute</Button>
      </Box>
      <div>
      { (
                    <>
                    <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '5vh',
                    }}>
                        <div>Selected Time: {timeGUI(selectedTime)}</div>
                        </Box>
                        <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '5vh', 
                    }}>
                        <div>Time Remaining: {timeGUI(time)}</div>
                        </Box>
                        <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '5vh', // Adjust the height as needed
                    }}>
                            {isPaused ? (
                               <Button onClick={handleStart}>Start</Button>
                            ) : (
                                <Button onClick={handlePause}>Pause</Button>
                            )}
                            <Button onClick={resetHandler}>Reset</Button>
                        </Box>
                    </>
                )}
      </div>
    </div>
  );

}

export default App;

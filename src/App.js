import './App.css';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import React from 'react'; 
import Dashboard from './components/Dashboard';
import Login from './components/Login/Login';
import Preferences from './components/Preferences';
import { BrowserRouter, Route, Switch } from 'react-router-dom'; 
import useToken from './components/UseToken';


function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken?.token
}

function App() {
    //variables that control the stopwatch 
    const { token, setToken } = useToken();
    //const token = getToken(); 
    const [isCounting, setIsCounting] = useState(false); 
    const [selectedTime, setSelectedTime] = useState(0)
    const [isPaused, setIsPaused] = useState(true);
    const [time, setTime] = useState(0);
    const [numClicks, setNumClicks] = useState(1);
    const [levelTracker, setLevelTracker] = useState(1);

    //const token = getToken();

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

    const howMuchTime = (minutes) => {
      if (!isCounting) {
        handleStart(minutes); 
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
      //stuff for dom 
      <div className="wrapper">
      <h1>Application</h1>
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
      <div className={`dot larger-${numClicks}`}></div>   
      <span className = "foodbowl" onClick={clickHandler}></span>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Button onClick = {() => howMuchTime(60)}>60 Minutes</Button>
      <Button onClick = {() => howMuchTime(20)}>20 Minutes</Button>
      <Button onClick = {() => howMuchTime(5)}>5 Minutes</Button>
      <Button onClick = {() => howMuchTime(1)}>1 Minute</Button>
      <div className = "timeset">The Time You Want to Set Is: {numClicks*5}</div>
      <div>
      {selectedTime > 0 && (
                    <>
                        <div>Selected Time: {timeGUI(selectedTime)}</div>
                        <div>Time Remaining: {timeGUI(time)}</div>
                        <Box>
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

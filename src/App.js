import './App.css';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import React from 'react'; 
import Dashboard from './components/Dashboard';
import Login from './components/Login/Login';
import Preferences from './components/Preferences';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom'; 
import useToken from './components/App/useToken';
import soundFile from './components/Domestic-cat-purring-and-meowing-sound-effect.mp3';
import { useHistory } from 'react-router-dom';
import Challenges from './Challenges'; 

function App() {
    const { token, setToken } = useToken();
    const [isCounting, setIsCounting] = useState(false); 
    const [selectedTime, setSelectedTime] = useState(0)
    const [isPaused, setIsPaused] = useState(true);
    const [time, setTime] = useState(0);
    const [numClicks, setNumClicks] = useState(1);
    const [levelTracker, setLevelTracker] = useState(1);
    const [customTime, setCustomTime] = useState(0); 
    const history = useHistory();

    const sound = new Audio(soundFile);

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
    const handleTimerIsDone = async (duration) => {
      if (time === 0 && selectedTime === duration * 60 * 1000) {
        console.log(selectedTime); 
        sound.play(); 
        try {
          const userId = 'theUserId'; // Ensure you have a way to get the actual user ID
          const newLevel = await updateUserLevel(userId, duration);
    
          setLevelTracker(newLevel); // Update levelTracker with the new level
          alert(`Congratulations. You are now level ${newLevel}!`);
        } catch (error) {
          alert('There was a problem updating your level. Please try again.');
        }
        setLevelTracker(prevLevel => prevLevel + 1);
        
      }
    };

    const handleLogout = () => {
      setToken(0); 
      return <Login/>
    }; 

    const handleChallenges = () => {
      return <Challenges/>
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
      <BrowserRouter>
        <div className="App">
          <div className="top-bar">
            <div></div>
            <div className = "level-container">
            <Box className="level-box">
              Level: {levelTracker + 1}
            </Box>
            </div>
            <div style={{ marginRight: 'left' }} auto className = "logout-container">
            <Box className="logout-button">
              <Button onClick={handleLogout}>Logout</Button>
            </Box>
            </div>
            <div style = {{marginRight: 'auto'}} auto className = "challenge-container">
              <Box>
                <Button onClick={handleChallenges}>Challenges</Button>
              </Box>
              </div>
            <div className="title-container">
          <h1>Tomato Paws Timer</h1>
            </div>
          

            <div className="control-buttons">
          <Button variant="contained" onClick={handlePause}>{isPaused ? "Resume" : "Pause"}</Button>
          <Button variant="contained" color="secondary" onClick={resetHandler}>Reset</Button>
            </div>
        </div>
          
          <div className="time-info">
            <div>Selected Time: {timeGUI(selectedTime)}</div>
            <div>Time Remaining: {timeGUI(time)}</div>
          </div>
    
          <Switch>
            <Route path="/Dashboard">
              <Dashboard />
            </Route>
            <Route path="/Preferences">
              <Preferences />
            </Route>
          </Switch>
    
          <div className="wrapper">
            {/* Your time options and other content here */}
            <div className="time-options">
              <Box className="time-option-box"><Button onClick={() => howMuchTime(60)}>Start: 60 Minutes</Button></Box>
              <Box className="time-option-box"><Button onClick={() => howMuchTime(20)}>Start: 20 Minutes</Button></Box>
              <Box className="time-option-box"><Button onClick={() => howMuchTime(5)}>Start: 5 Minutes</Button></Box>
              <Box className="time-option-box"><Button onClick={() => howMuchTime(1)}>Start: 1 Minute</Button></Box>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );

}

export default App;
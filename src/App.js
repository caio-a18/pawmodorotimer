import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';

function App() {

    const [numClicks, setNumClicks] = useState(1)
    //const [hours, setHours] = useState(0)
    ///const [minutes, setMinutes] = useState(0)
    //const [seconds, setSeconds] = useState(0)
    const [timeElapsed, setTimeElapsed] = useState(0)
    const deadline = "December, 31, 2022";

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
        setTimeElapsed("20:00"); 
      }
      
    };

    //get the timer to render every second since it errors out otherwise 
    /*
    useEffect(() => {
      const interval = setInterval(() => getTime(deadline), 1000);

      return () => clearInterval(interval);
    }, []); */

  return (
    <div className="App">
    <div className={`dot larger-${numClicks}`}></div>   
    <span className = "foodbowl" onClick={clickHandler}></span>
    <div className = "timeset">The Time You Want to Set Is: {numClicks*5}</div>
    <div className = "timer">{timeElapsed}</div>
    <Box>
    <ButtonGroup>
    <Button sx={{ justifyContent: "flex-end" }}>Start Timer</Button>
    <Button sx={{ justifyContent: "flex-end" }}>Pause Timer</Button>
    </ButtonGroup>
    </Box>
    </div>
  );
}

export default App;

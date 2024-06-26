import './App.css';
import 'animate.css';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import React from 'react'; 
import Dashboard from './components/Dashboard';
import Login from './components/Login/Login';
import Preferences from './components/Preferences';
import { BrowserRouter, Route, Switch } from 'react-router-dom'; 
import useToken from './../src/components/UseToken';
import soundFile from './components/Domestic-cat-purring-and-meowing-sound-effect.mp3';
import Challenges from './components/Login/Challenges'; 
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TextField from '@mui/material/TextField'; 
import CalendarView from './CalendarView';
import { ReactComponent as CatIcon } from './components/CAT.svg';

//API imports
import {updateUserStudyTimeByEmail, logStudySession, fetchUserIdByEmail} from './components/api'; 

function App() {
    const { token, setToken } = useToken();
    const [isCounting, setIsCounting] = useState(false); 
    const [selectedTime, setSelectedTime] = useState(0)
    const [isPaused, setIsPaused] = useState(true);
    const [time, setTime] = useState(0);
    const [numClicks, setNumClicks] = useState(1);
    const [levelTracker, setLevelTracker] = useState(1);
    const [customTime, setCustomTime] = useState(0); 
    const [catSize, setCatSize] = useState('small');
    const [catShrinkDuration, setCatShrinkDuration] = useState(0); 


    const [userDialog, setUserDialog] = useState("false"); 
    const sound = new Audio(soundFile);
    // Challenges info
    const [showChallenges, setShowChallenges] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [email, setEmail] = useState("");
    const [userId, setUserId] = useState(null);

    //array that we use to match the levels and other user stats up with each individual user 
    const [usernameArray, setUsernameArray] = useState(["Noah", "Asya", "Maisoon", "Hart", "Caio", "Profsegovia"]); 
    
    /*userLevel and totalStudyTime are both arrays of length 6, with each index corresponding to the level of the users in the system. 
    index 0 corresponds to Noah's level, index 1 corresponds to Asya's level, etc. Same with study time. */
    const [userLevel, setUserLevel] = useState([1, 1, 1, 1, 1, 1]);
    const [currUserLevel, setCurrUserLevel] = useState(1);
    const [currStudyTime, setCurrStudyTime] = useState(0);
    const [totalStudyTime, setTotalStudyTime] = useState([0, 0, 0, 0, 0, 0]);
    const [dailyStudyTime, setDailyStudyTime] = useState([0, 0, 0, 0, 0, 0]); 
    const [weeklyStudyTime, setWeeklyStudyTime] = useState([0, 0, 0, 0, 0, 0]);
    const [monthlyStudyTime, setMonthlyStudyTime] = useState([0, 0, 0, 0, 0, 0]);
    const [yearlyStudyTime, setYearlyStudyTime] = useState([0, 0, 0, 0, 0, 0]);

    // variables for study and break tasks
    const [studyItems, setStudyItems] = useState(JSON.parse(localStorage.getItem('studyItems')) || []);
    const [breakItems, setBreakItems] =  useState(JSON.parse(localStorage.getItem('breakItems')) || []);
    const [newStudyItem, setNewStudyItem] = useState('');
    const [newBreakItem, setNewBreakItem] = useState('');

    // Variables for challenges tab
    const [playerToChallenge, setPlayerToChallenge] = useState('');
    const [pastChallenges, setPastChallenges] = useState(JSON.parse(localStorage.getItem('pastChallenges')) || []);



    // Add new state to control the visibility of the calendar dialog
    const [showCalendar, setShowCalendar] = useState(false);

    // Function to open and close the calendar dialog
    const handleOpenCalendar = () => {
      setShowCalendar(true);
    };

    const handleCloseCalendar = () => {
      setShowCalendar(false);
    };

    // At the beginning of your component, add the suggestedStudyItems state
    const [suggestedStudyItems, setSuggestedStudyItems] = useState([
    "Respond to emails",
    "Listen to podcast",
    "Study notes",
    "Outline calendar",
    "Review lecture"
  ]);

     // Function to update user data in localStorage
    const updateUserLocalStorage = () => {
    localStorage.setItem('username', username);
    localStorage.setItem('userLevel', userLevel);
    localStorage.setItem('totalStudyTime', totalStudyTime);
    localStorage.setItem('suggestedStudyItems', suggestedStudyItems); 
    localStorage.setItem('studyItems', JSON.stringify(studyItems)); 
    localStorage.setItem('breakItems', JSON.stringify(breakItems)); 
    localStorage.setItem('newStudyItem', newStudyItem); 
    localStorage.setItem('newBreakItem', newBreakItem); 
    localStorage.setItem('playerToChallenge', playerToChallenge); 
    localStorage.setItem('pastChallenges', JSON.stringify(pastChallenges));
  };

  // useEffect to update localStorage when user data changes
    useEffect(() => {
    updateUserLocalStorage();
  }, [username, 
      userLevel, 
      totalStudyTime, 
      suggestedStudyItems, 
      studyItems, 
      breakItems,
      newStudyItem,
      newBreakItem,
      playerToChallenge,
      pastChallenges]);

const updateUserLevel = (time) => {

  //find which user we are interested in 
  const userIndex = usernameArray.indexOf(username);
  if (time == 0 && userIndex !== -1) {
   userLevel[userIndex]++; // Increment the userLevel at userIndex
   setUserLevel(userLevel); // Set the updated userLevel array
  }
}; 

const updateStudyTime = (time, duration) => {
  //find which user we are interested in 
  const userIndex = usernameArray.indexOf(username); 
  if (time == 0 && userIndex !== -1) {
    totalStudyTime[userIndex] = totalStudyTime[userIndex] + duration; 
   // setTotalStudyTime(totalStudyTime + duration); 
  }
}; 

const handleAddStudyItem = (itemToAdd) => {
  // Ensure itemToAdd is a string; if not provided, default to newStudyItem
  const newItem = (typeof itemToAdd === 'string' ? itemToAdd : newStudyItem).trim();
  
  if (newItem) {
    setStudyItems([...studyItems, newItem]);
    setNewStudyItem(''); // Reset input field
  }
};

const handleAddSuggestedItem = (index) => {
  const itemToAdd = suggestedStudyItems[index];
  if (typeof itemToAdd === 'string') {
    handleAddStudyItem(itemToAdd); // Pass the string value to handleAddStudyItem
    // Filter out the added item from the suggested list
    const updatedSuggestedItems = suggestedStudyItems.filter((_, i) => i !== index);
    setSuggestedStudyItems(updatedSuggestedItems);
  }
};

  // Update removeItem to handleRemoveStudyItem
  const handleRemoveStudyItem = (index) => {
    const updatedStudyItems = [...studyItems];
    updatedStudyItems.splice(index, 1);
    setStudyItems(updatedStudyItems);
  };

  // function for adding break items
  const handleAddBreakItem = () => {
    if (newBreakItem.trim() !== '') {
      setBreakItems([...breakItems, newBreakItem]);
      setNewBreakItem(''); // Reset input
    }
  };

  // function for removing break items
  const handleRemoveBreakItem = (index) => {
    const updatedBreakItems = [...breakItems];
    updatedBreakItems.splice(index, 1);
    setBreakItems(updatedBreakItems);
  };



  const handleLoginSuccess = async (username, email, token) => {
    setUsername(username);  // Store the username in state
    setEmail(email);        // Store the email in state
    setToken(token);        // Store the token in state

    // Directly use the 'email' parameter to fetch the user ID
    try {
        const id = await fetchUserIdByEmail(email);
        const time = await updateUserStudyTimeByEmail(email, 0);
        setCurrStudyTime(time.totalFocusTime);
        setUserId(id); // Update the user ID state
        setCurrUserLevel(time.totalFocusTime);
    } catch (error) {
        console.error('Failed to fetch user ID:', error);
        // Handle errors appropriately, possibly setting user ID to null or showing an error message
    }
};

    const handleOpenDialog = () => {
      setUserDialog(true); // Open the dialog
    }; 

    const handleCloseDialog = () => {
      setUserDialog(false); // Close the dialog
    };

    // Start of reseting times for calendar
    const resetStudyTimes = (period) => {
      const now = new Date();
    
      let newDailyStudyTime = dailyStudyTime;
      let newWeeklyStudyTime = weeklyStudyTime;
      let newMonthlyStudyTime = monthlyStudyTime;
      let newYearlyStudyTime = yearlyStudyTime;
    
      switch (period) {
        case 'daily':
          newDailyStudyTime = newDailyStudyTime.map(() => 0);
          setDailyStudyTime(newDailyStudyTime);
          localStorage.setItem('lastDailyReset', now.toString());
          localStorage.setItem('dailyStudyTime', JSON.stringify(newDailyStudyTime));
          break;
        case 'weekly':
          newWeeklyStudyTime = newWeeklyStudyTime.map(() => 0);
          setWeeklyStudyTime(newWeeklyStudyTime);
          localStorage.setItem('lastWeeklyReset', now.toString());
          localStorage.setItem('weeklyStudyTime', JSON.stringify(newWeeklyStudyTime));
          break;
        case 'monthly':
          newMonthlyStudyTime = newMonthlyStudyTime.map(() => 0);
          setMonthlyStudyTime(newMonthlyStudyTime);
          localStorage.setItem('lastMonthlyReset', now.toString());
          localStorage.setItem('monthlyStudyTime', JSON.stringify(newMonthlyStudyTime));
          break;
        case 'yearly':
          newYearlyStudyTime = newYearlyStudyTime.map(() => 0);
          setYearlyStudyTime(newYearlyStudyTime);
          localStorage.setItem('lastYearlyReset', now.toString());
          localStorage.setItem('yearlyStudyTime', JSON.stringify(newYearlyStudyTime));
          break;
        default:
      }
    };

    // logic to calculate new date / week / month / year
    useEffect(() => {
      const now = new Date();
  
      // Calculate the start of today (at 00:00:00)
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
      // Calculate the start of the current week (Sunday at 00:00:00)
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  
      // Calculate the start of the current month (1st day at 00:00:00)
      const startOfMonth = new Date(now.getFullYear(), now.getMonth());
  
      // Calculate the start of the current year (January 1st at 00:00:00)
      const startOfYear = new Date(now.getFullYear(), 0);
  
      // Check for end of day
      if (now.getTime() >= startOfToday.getTime() + 86400000) { // 24 * 60 * 60 * 1000
        resetStudyTimes('daily');
      }
  
      // Check for end of week
      if (now.getTime() >= startOfWeek.getTime() + 604800000) { // 7 * 24 * 60 * 60 * 1000
        resetStudyTimes('weekly');
      }
  
      // Check for end of month
      if (now > new Date(now.getFullYear(), now.getMonth() + 1, 0)) {
        resetStudyTimes('monthly');
      }
  
      // Check for end of year
      if (now > new Date(now.getFullYear(), 11, 31)) {
        resetStudyTimes('yearly');
      }
  
      // Note: This will not account for leap seconds, time zone changes, etc.
  
      // Set an interval to check at a regular interval
      const intervalId = setInterval(() => {
        // Repeat the same checks inside this interval callback
      }, 60000); // Check every minute - for production, you might want to check less frequently
  
      // Cleanup the interval on component unmount
      return () => clearInterval(intervalId);
    }, [totalStudyTime]);
    // End of reseting times for calendar
 

    //timer
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


    //start timer
    const handleStart = () => {
      if (isPaused || !isCounting) {
        setCatShrinkDuration(selectedTime); //ensure duration is set when timer starts
        setIsPaused(false);
        setIsCounting(true);
      }
    };
    

    //pause timer
    const handlePause = () => {
      setIsPaused(!isPaused);
    };
    
    

    //reset timer
    const resetHandler = () => {
      setIsCounting(false);
      setIsPaused(true);
      setTime(selectedTime);
    };





    // handles cat sizing
    //const startCatShrinking = (duration) => {

    //}



















    //handles the gui portion that counts up 20 mins 

    const howMuchTime = (minutes) => {
      const newTime = minutes * 60 * 1000; // Convert minutes to milliseconds
      if (newTime !== selectedTime || isPaused) { // Check if a new time is selected or if the timer is paused
        setSelectedTime(newTime);
        setTime(newTime);
        setIsPaused(false); // Ensure timer is not paused
        if (!isCounting) {
          setIsCounting(true); // Start counting only if it wasn't already started
          setCatShrinkDuration(newTime); //set cat for shrinking
        }
      }
    };

    const timeGUI = (ms) => {
      const minutes = Math.floor(ms/60000); 
      const seconds = Math.floor((ms % 60000) / 1000); 
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; 
    }; 

    const handleEndStudySession = async (duration) => {
      const startTime = new Date().getTime() - selectedTime; // Assuming selectedTime is the duration in ms when the timer started
      const endTime = new Date().getTime(); 

      try {
          await logStudySession(userId, startTime, endTime, duration);
      } catch (error) {
          console.error('Failed to log study session:', error);
      }
  };

    // Handler to check when time is over and update user details using email
    const handleTimerIsDone = async (duration) => { // duration * 60 = time in seconds
      if (time === 0 && selectedTime === duration * 60 * 1000) {
        sound.play();
        try {
          const updateResponse = await updateUserStudyTimeByEmail(email, duration * 10);
          await handleEndStudySession(duration * 10);

          // Calculate new total study time
          const newTotalTime = updateResponse.totalFocusTime;
          console.log("Current study duration: " + duration)
          console.log("Current total study time: " + updateResponse.totalFocusTime)
          const oldTotalTime = updateResponse.totalFocusTime - duration;
          setTotalStudyTime(updateResponse.totalFocusTime);
          const newLevel = Math.floor(newTotalTime); // Level changes every 60 minutes of focus time
          const oldLevel = Math.floor(oldTotalTime);
          console.log("New level: " + newLevel)
          setUserLevel(updateResponse.newLevel);
          setCurrUserLevel(newLevel);
          updateUserLevel(time); 
          updateStudyTime(time,duration); 
          setCurrStudyTime(newTotalTime);
          // Check if level has changed and update if necessary
          if (newLevel > oldLevel) {
            alert(`Congratulations. You are now level ${newLevel}!`);
          }
        } catch (error) {
          console.log(error);
          alert('There was a problem updating your level. Please try again.');
        }
      }
    };

    const handleLogout = () => {
      setToken(0); 
      return <Login/>
    }; 

    const handleOpenChallenges = () => {
      setShowChallenges(true); // Open the dialog
    }; 

    const handleCloseChallenges = () => {
      setShowChallenges(false); // Close the dialog
    };




    // An example user array, to be replaced
    const exampleUsernameArray = ["Noah", "Asya", "Maisoon", "Hart", "Caio", "Profsegovia", "100hoursguy", "-100hoursguy"];
    const exampleTotalStudyTime = [0, 0, 0, 0, 0, 0, 6000, -6000];


    // Search up a user by username. Return their index if they exist, return -1 if not.
    function lookupUser(inputUsername) {
      return exampleUsernameArray.indexOf(inputUsername);
    }


    // Add a challenge to the list, local storage
    function storeChallenge(newChallenge) {
      setPastChallenges([...pastChallenges, newChallenge]);
    }


    // Clear pastChallenges in local storage
    const clearPastChallenges = () => {
      setPastChallenges([]);
    };

    
    // Challenge a user to see who has more total study time
    function doChallenge(opponentName) {
      let myTotalStudyTime = currStudyTime;    // my total study time
      let oppTotalStudyTime = exampleTotalStudyTime[lookupUser(opponentName)];   // opponent total study time
      let challengeResult = '';
      let today = new Date();
      if (myTotalStudyTime > oppTotalStudyTime)
        challengeResult = "Win";
      else if (myTotalStudyTime < oppTotalStudyTime)
        challengeResult = "Loss";
      else
        challengeResult = "Tie";   
      
      // Return challenge object with three things stored in table
      let challenge = {
        opponent: opponentName,
        result: `(${myTotalStudyTime} - ${oppTotalStudyTime}): ${challengeResult}`,
        datetime: today.toLocaleString(),
      };

    return challenge;
    }



    // Submit a challenge
    const handleSubmitChallenge = async e => {
      e.preventDefault();
      
      let resultText = document.getElementById("challenge-result");
      resultText.innerHTML = "";
      
      if (lookupUser(playerToChallenge) === -1) {
        alert("This player does not exist");
      }
      else if (lookupUser(playerToChallenge) === lookupUser(username)) {
        alert("You can't compete against yourself...");
      }
      else {
        // This stores the opponent, result, and date of the challenge
        let challenge = doChallenge(playerToChallenge);
        storeChallenge(challenge);
        setPlayerToChallenge('');

        // Display challenge result
        resultText.innerHTML = `Challenge Results:
        You have studied for ${currStudyTime} minutes.
        ${challenge.opponent} has studied for ${exampleTotalStudyTime[lookupUser(challenge.opponent)]} minutes.`;
        if (currStudyTime > exampleTotalStudyTime[lookupUser(challenge.opponent)])
          resultText.innerHTML += " You win!";
        else if (currStudyTime < exampleTotalStudyTime[lookupUser(challenge.opponent)])
          resultText.innerHTML += " You lose!";
        else
          resultText.innerHTML += " It's a tie!";
      }

      return;
    };



    // UseEffect for HandleTimer
    useEffect(() => {
      handleTimerIsDone(0.1); // 6 seconds
      handleTimerIsDone(1); // 60 seconds
      handleTimerIsDone(5);
      handleTimerIsDone(20);
      handleTimerIsDone(60);
    }, [time]);
    
    if(!token) {
      // Pass handleLoginSuccess and setUsername as props to Login component
      return <Login setToken={setToken} handleLoginSuccess={handleLoginSuccess} setUsername={setUsername} setEmail={setEmail} />;
  }
  
    return (
      <BrowserRouter>
      {showChallenges && <Challenges />}
        <div className="App">
          <div className="top-bar">
            <div></div>
            <div style={{ marginRight: 'left' }} auto className = "logout-container">
            <Box className="logout-button">
              <Button onClick={handleLogout}>Logout</Button>
            </Box>
            </div>

            <div style = {{marginRight: 'left', marginLeft: '0.1in'}} auto className = "challenge-container">
              <Box>
                <Button onClick={handleOpenChallenges}>Challenges</Button>

                {/* START OF CHALLENGES TAB/DIALOG */}
                <Dialog open={showChallenges} onClose={handleCloseChallenges}>
                  <DialogTitle sx={{ color: 'blue' }}>Challenges For {username}: </DialogTitle>
                  <DialogContent sx={{ color: 'purple' }}>
                    <p>Challenge a user to see who has more focus time! Below you can view past challenges.</p>
                    <div>
                      


      <Accordion>
        <AccordionSummary
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Start a Challenge 
        </AccordionSummary>
        <AccordionDetails>
          
          <div>
            <div class="leftDiv" style={{width: '50%', float: 'left'}}>
              <form onSubmit={handleSubmitChallenge} id="challengeForm">
                <label>
                  <p>Choose a player to challenge.</p>
                  <TextField id="challenge-search" type="search" value={playerToChallenge} onChange={e => setPlayerToChallenge(e.target.value)}/>
                </label>
                
                <div className = "challenge-submit">
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </div>

            <div class="rightDiv" id="challenge-result" style={{width: '50%', float: 'right'}}>
              {/* Put challenge results info here */}
            </div>
          </div>

        </AccordionDetails>
      </Accordion>


      <Accordion>
        <AccordionSummary
          aria-controls="panel1-content"
          id="panel1-header"
        >
            See Past Challenges 
        </AccordionSummary>
        <AccordionDetails>
          <div>
              <Button onClick={clearPastChallenges} class="clear-challenges" style={{backgroundColor: 'red', float: 'right'}}>Clear All</Button>
            <table id="pastChallenges" class="challengesTable">
              <thead>
                <tr>
                  <th class="tableCell">Date/Time</th>
                  <th class="tableCell">Opponent</th>
                  <th class="tableCell">Outcome</th>
                </tr>
              </thead>
              <tbody>
                {
                  pastChallenges.map((row, i) => (
                      <tr>
                        <td class="tableCell">{row.datetime}</td>
                        <td class="tableCell">{row.opponent}</td>
                        <td class="tableCell">{row.result}</td>
                      </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </AccordionDetails>
      </Accordion>


                    </div>
                  </DialogContent>
                  <DialogActions>
                    <Button sx={{ color: 'blue' }} onClick={handleCloseChallenges}>OK</Button>
                  </DialogActions>
                </Dialog>
                {/* END OF CHALLENGES TAB/DIALOG */}
              </Box>
            </div>

            {/*START OF CALENDAR*/}
            <div style={{marginLeft: 'auto', marginRight: 'left'}} className="calendar-container">
              <Button onClick={handleOpenCalendar}>Calendar</Button>
            </div>

{/* TO DELETE */ }
{/* When you search for a user, it should display their data. */}

<CalendarView
    open={showCalendar}
    onClose={handleCloseCalendar}
    username={username}
    totalStudyTime={totalStudyTime}
    usernameArray={usernameArray}
/>

            <div style = {{marginLeft: 'auto', marginRight: '0.1in'}} auto className = "profile-container">
              <Box>
                <Button onClick={handleOpenDialog}>Profile</Button>
              </Box>
              </div>
            <div className="title-container">
              <h1>Tomato Paws Timer</h1>
            </div>
            
          {/* Buttons */}
          <div className="control-buttons">
          <Button 
            variant="contained" 
            onClick={handlePause} 
            sx={{ backgroundColor: '#3399FF', '&:hover': { backgroundColor: '#2a7fcb' } }}
          >
          {isPaused ? "Resume" : "Pause"}
          </Button>
          <Button variant="contained" color="secondary" onClick={resetHandler}>Reset</Button>
        </div>
      </div>
          
          <div className="time-info">
            <div>Selected Time: {timeGUI(selectedTime)}</div>
            <div data-testid="timer">Time Remaining: {timeGUI(time)}</div>
          </div>
    
          <Switch>
            <Route path="/Dashboard">
              <Dashboard />
            </Route>
            <Route path="/Preferences">
              <Preferences />
            </Route>
            <Route path="/Challenges">
              <Dashboard />
            </Route>
          </Switch>
    
          <div className="wrapper">
            <div className="cat-container">
            <CatIcon className="cat-svg" style={{ '--timer-duration': `${catShrinkDuration}ms` }} />
            </div>
            {/* Your time options and other content here */}
            <div className="time-options">
              <Box className="time-option-box"><Button onClick={() => howMuchTime(60)}>60 Minutes</Button></Box>
              <Box className="time-option-box"><Button onClick={() => howMuchTime(20)}>20 Minutes</Button></Box>
              <Box className="time-option-box"><Button onClick={() => howMuchTime(5)}>5 Minutes</Button></Box>
              <Box className="time-option-box"><Button onClick={() => howMuchTime(1)}>1 Minute</Button></Box>
              <Box className="time-option-box"><Button onClick={() => howMuchTime(0.1)}>6 seconds</Button></Box>
            </div>
          </div>

          {/* START OF PROFILE TAB/DIALOG */}
          <Dialog open={userDialog} onClose={handleCloseDialog}>
            <DialogTitle sx={{ color: 'blue' }}>Profile Information</DialogTitle>
            <DialogContent sx={{ color: 'purple' }}>
            <p>Username: {username}</p>
            <p>Level: {currUserLevel}</p>
            <p>Total Study Minutes: {currStudyTime} minutes</p>
            </DialogContent>
            <DialogActions>
              <Button sx={{ color: 'blue' }} onClick={handleCloseDialog}>OK</Button>
            </DialogActions>
          </Dialog>
        {/* END OF PROFILE TAB/DIALOG */}

        {/* Start of Lists Components */}
        <div className="lists-container" style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div className='study-list' style={{ width: '27.5%' }}>
            <h2>Study Tasks</h2>
            {/* Input field for adding new study items */}
            <input
             type="text"
              value={newStudyItem}
              onChange={(e) => setNewStudyItem(e.target.value)}
            />
            {/* Button to add new study item */}
            <button onClick={handleAddStudyItem}>Add Item</button>

          {/* Display the list of study items */}
          <ul>
            {studyItems.map((item, index) => (
              <li key={index} style={{ width: '98%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ textAlign: 'left' }}>{item}</span>
                <button 
                  onClick={() => handleRemoveStudyItem(index)}
                  style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px 10px' }}
                >
                Remove
                </button>
              </li>
            ))}
          </ul>
          </div>

          {/* BREAK TASKS */}
          <div className='break-list' style={{ width: '27.5%' }}>
            <h2>Break Tasks</h2>
            {/* Input field for adding new break items */}
            <input
              type="text"
              value={newBreakItem}
              onChange={(e) => setNewBreakItem(e.target.value)}
            />
          {/* Button to add new break item */}
          <button onClick={handleAddBreakItem}>Add Item</button>
          {/* Display the list of break items */}
          <ul>
            {breakItems.map((item, index) => (
              <li key={index} style={{ width: '98%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ textAlign: 'left' }}>{item}</span>
                <button 
                  onClick={() => handleRemoveBreakItem(index)}
                  style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px 10px' }}
                >
                Remove
                </button>
              </li>
            ))}
          </ul>
      </div>

      {/* BREAK TASKS */}
      <div className='suggested-study-list' style={{ width: '27.5%' }}>
        <h2>Suggested Study Tasks</h2>
        <ul style={{ paddingLeft: 0 }}>
          {suggestedStudyItems.map((item, index) => (
            <li key={index} style={{ width: '98%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', listStyleType: 'none' }}>
              <span style={{ textAlign: 'left' }}>{item}</span>
              <button 
                onClick={() => handleAddSuggestedItem(index)}
                style={{ backgroundColor: '#3399FF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px 10px' }}
              >
              Add Item
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
    {/*End of Lists Components */}
  </div>
</BrowserRouter>
);

}

export default App;

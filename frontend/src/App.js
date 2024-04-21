import './App.css';
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
import CalendarView from './components/CalendarView';

//API imports
import { updateUserLevel } from './components/api'; 

function App() {
    const { token, setToken } = useToken();
    const [isCounting, setIsCounting] = useState(false); 
    const [selectedTime, setSelectedTime] = useState(0)
    const [isPaused, setIsPaused] = useState(true);
    const [time, setTime] = useState(0);
    const [userDialog, setUserDialog] = useState("false"); 
    const sound = new Audio(soundFile);
    // Challenges info
    const [showChallenges, setShowChallenges] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem('username') || '');

    //array that we use to match the levels and other user stats up with each individual user 
    const [usernameArray, setUsernameArray] = useState(["Noah", "Asya", "Maisoon", "Hart", "Caio", "Profsegovia"]); 
    
    /*userLevel and totalStudyTime are both arrays of length 6, with each index corresponding to the level of the users in the system. 
    index 0 corresponds to Noah's level, index 1 corresponds to Asya's level, etc. Same with study time. */
    const [userLevel, setUserLevel] = useState([1, 1, 1, 1, 1, 1]);
    const [totalStudyTime, setTotalStudyTime] = useState([0, 0, 0, 0, 0, 0]);
    const [dailyStudyTime, setDailyStudyTime] = useState([0, 0, 0, 0, 0, 0]); 

    // variables for study and break tasks
    const [studyItems, setStudyItems] = useState(JSON.parse(localStorage.getItem('studyItems')) || []);
    const [breakItems, setBreakItems] =  useState(JSON.parse(localStorage.getItem('breakItems')) || []);
    const [newStudyItem, setNewStudyItem] = useState('');
    const [newBreakItem, setNewBreakItem] = useState('');



    // Variables for starting a new challenge
    const [playerToChallenge, setPlayerToChallenge] = useState('');
    // List for pending challenges
    // List for ongoing challenges
    // List for past challenges



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
    "Drink water",
    "Do yoga",
    "Work out",
    "Respond to emails",
    "Mew"
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
      newBreakItem]);

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

  // Example of setting the username on successful login
  const handleLoginSuccess = (username, token) => {
  setUsername(username);  // Store the username
  setToken(token);        // Set the authentication token
  };

    const handleOpenDialog = () => {
      setUserDialog(true); // Open the dialog
    }; 

    const handleCloseDialog = () => {
      setUserDialog(false); // Close the dialog
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

    const handlePause = () => {
      setIsPaused(!isPaused);
    };
    
    const resetHandler = () => {
      setIsCounting(false);
      setIsPaused(true);
      setTime(selectedTime);
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
        sound.play(); 
        updateUserLevel(time); 
        updateStudyTime(time,duration); 
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




    // An example user array, to be replaced / connected to backend
    let userArray = [
      {userId: "111", username: "userOne", totalFocusTime: 60},
      {userId: "222", username: "userTwo", totalFocusTime: 120},
      {userId: "333", username: "userThree", totalFocusTime: 180},
    ];

    
    // Search up a user by userId. If found, return that user. Else, returns null.
    function lookupUser(inputUserId) {
      const inputUser = userArray.find((user) => user.userId === inputUserId);
      if (inputUser !== null ) {
        return inputUser;
      }
      else {
        return null;
      }
    }


    const handleSubmitChallenge = () => {
      
      // console.log("Submitted a challenge!");
      alert("Submitted a challenge");
    };

    

    // UseEffect for HandleTimer
    useEffect(() => {
      handleTimerIsDone(1);
      handleTimerIsDone(5);
      handleTimerIsDone(20);
      handleTimerIsDone(60);
    }, [time]);

    if(!token) {
      // Pass handleLoginSuccess and setUsername as props to Login component
      return <Login setToken={setToken} handleLoginSuccess={handleLoginSuccess} setUsername={setUsername} />;
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

            <div style = {{marginRight: 'auto'}} auto className = "challenge-container">
              <Box>
                <Button onClick={handleOpenChallenges}>Challenges</Button>

                {/* START OF CHALLENGES TAB/DIALOG */}
                <Dialog open={showChallenges} onClose={handleCloseChallenges}>
                  <DialogTitle sx={{ color: 'blue' }}>Challenges For {username}: </DialogTitle>
                  <DialogContent sx={{ color: 'purple' }}>
                    <p>Here you can challenge another user! Below you can view pending, ongoing and past challenges.</p>
                    <div>
                      


      <Accordion>
        <AccordionSummary
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Start a Challenge 
        </AccordionSummary>
        <AccordionDetails>
          

          <form onSubmit={handleSubmitChallenge} id="challengeForm">
            <label>
              <p>Choose a player to challenge.</p>
              <TextField id="challenge-search" type="search" value={playerToChallenge} onChange={e => setPlayerToChallenge(e.target.value)}/>
            </label>
            <div className = "challenge-submit">
              <Button type="submit">Submit</Button>
            </div>
          </form>


        </AccordionDetails>
      </Accordion>


      <Accordion>
        <AccordionSummary
          aria-controls="panel1-content"
          id="panel1-header"
        >
          See Pending Challenges 
        </AccordionSummary>
        <AccordionDetails>
          <div>
        
          </div>
        </AccordionDetails>
      </Accordion>


      <Accordion>
        <AccordionSummary
          aria-controls="panel1-content"
          id="panel1-header"
        >
          See Ongoing Challenges 
        </AccordionSummary>
        <AccordionDetails>
          <div>
        
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

            <div style={{ marginRight: 'auto' }} className="calendar-container">
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
            <div>Time Remaining: {timeGUI(time)}</div>
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
            {/* Your time options and other content here */}
            <div className="time-options">
              <Box className="time-option-box"><Button onClick={() => howMuchTime(60)}>60 Minutes</Button></Box>
              <Box className="time-option-box"><Button onClick={() => howMuchTime(20)}>20 Minutes</Button></Box>
              <Box className="time-option-box"><Button onClick={() => howMuchTime(5)}>5 Minutes</Button></Box>
              <Box className="time-option-box"><Button onClick={() => howMuchTime(1)}>1 Minute</Button></Box>
            </div>
          </div>

          {/* START OF PROFILE TAB/DIALOG */}
          <Dialog open={userDialog} onClose={handleCloseDialog}>
            <DialogTitle sx={{ color: 'blue' }}>Profile Information</DialogTitle>
            <DialogContent sx={{ color: 'purple' }}>
            <p>Username: {username}</p>
            <p>Level: {userLevel[usernameArray.indexOf(username)]}</p>
            <p>Total Study Minutes: {totalStudyTime[usernameArray.indexOf(username)]} minutes</p>
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

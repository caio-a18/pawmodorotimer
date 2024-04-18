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
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import soundFile from './components/Domestic-cat-purring-and-meowing-sound-effect.mp3';
import Challenges from './components/Login/Challenges'; 
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions'; 

//API imports
import { updateUserLevel } from './components/api'; 

function App() {
    const { token, setToken } = useToken();
    const [isCounting, setIsCounting] = useState(false); 
    const [selectedTime, setSelectedTime] = useState(0)
    const [isPaused, setIsPaused] = useState(true);
    const [time, setTime] = useState(0);
    const [numClicks, setNumClicks] = useState(1);
    const [levelTracker, setLevelTracker] = useState(1);
    const [customTime, setCustomTime] = useState(0); 

    const [userDialog, setUserDialog] = useState("false"); 
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');

    const sound = new Audio(soundFile);

    // Challenges info
    const [showChallenges, setShowChallenges] = useState(false);


    // Additional state for user info and study management
  const [username, setUsername] = useState("");
  const [userLevel, setUserLevel] = useState(1);  // Default to level 1
  const [totalStudyTime, setTotalStudyTime] = useState(0);  // Total study time in milliseconds

  // variables for study and break tasks
  const [studyItems, setStudyItems] = useState([]);
  const [breakItems, setBreakItems] = useState([]);
  const [newStudyItem, setNewStudyItem] = useState('');
  const [newBreakItem, setNewBreakItem] = useState('');

  // At the beginning of your component, add the suggestedStudyItems state
const [suggestedStudyItems, setSuggestedStudyItems] = useState([
  "Review notes",
  "Study for exam",
  "Do homework",
  "Respond to emails",
  "Read assigned chapters"
]);

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

  // Function to update study time and calculate level
  const updateStudyTime = (sessionTime) => {
    setTotalStudyTime(prevTime => {
      const newTotalTime = prevTime + sessionTime;
      const newLevel = Math.floor(newTotalTime / (60 * 60 * 1000)); // 1 hour = 60*60*1000 milliseconds
      setUserLevel(newLevel + 1);  // Levels start at 1
      return newTotalTime;
    });
  };

  // Example of setting the username on successful login
  const handleLoginSuccess = (username, token) => {
  setUsername(username);  // Store the username
  setToken(token);        // Set the authentication token
  };


    const handleChange = e => {
      setCustomTime(e.target.value);
    };

    const handleOpenDialog = () => {
      setUserDialog(true); // Open the dialog
    }; 

    const handleCloseDialog = () => {
      setUserDialog(false); // Close the dialog
    };
    //add item to to do list 
    const addItem = () => {
      if (newItem.trim() !== '') {
        setItems([...items, newItem]);
        setNewItem(''); 
      }
    };
    
    //add item to to do list 
    const removeItem = (index) => {
      const updatedItems = [...items];
      updatedItems.splice(index, 1);
      setItems(updatedItems);
    };

    //add item to to do list 
    const addBreakItem = () => {
      if (newItem.trim() !== '') {
        setItems([...items, newItem]);
        setNewItem(''); 
      }
    };
    
    //add item to to do list 
    const removeBreakItem = (index) => {
      const updatedItems = [...items];
      updatedItems.splice(index, 1);
      setItems(updatedItems);
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
        sound.play(); 
        try {
          const userId = 'theUserId'; 
          const newLevel = await updateUserLevel(userId, duration);
          setLevelTracker(newLevel); // Update levelTracker with the new level
          alert(`Congratulations. You are now level ${newLevel}!`);
        } catch (error) {
          alert('There was a problem updating your level. Please try again.');
        }
        setLevelTracker(prevLevel => prevLevel + 1);
        
        //alert("Congratulations. You are now level " + (levelTracker + 1) + "!");
        
      }
    };

    const handleLogout = () => {
      setToken(0); 
      return <Login/>
    }; 


    // Open or close the dialog box displaying challenges
    /*
    const handleChallenges = () => {
      setShowChallenges(true);
    };
    */

    const handleOpenChallenges = () => {
      setShowChallenges(true); // Open the dialog
    }; 

    const handleCloseChallenges = () => {
      setShowChallenges(false); // Close the dialog
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
                  <DialogTitle sx={{ color: 'blue' }}>Challenges Information</DialogTitle>
                  <DialogContent sx={{ color: 'purple' }}>
                    <p>This is where you will see past challenges and be able to start challenges.</p>
                    <div>
                      {/* <p>Select a date to view your challenge history.</p>
                          <input type="date" id="dateSelected"></input> */}
                      <table className="challengesTable">
                          <tr>
                            <th className="tableCell">Date Received</th>
                            <th className="tableCell">Challenge</th>
                            <th className="tableCell">Sender</th>
                            <th className="tableCell">Recipient</th>
                            <th className="tableCell">Status</th>
                          </tr>
                          <tr>
                            <td className="tableCell">01/01/24</td>
                            <td className="tableCell">Study the most hours this week</td>
                            <td className="tableCell">Person A</td>
                            <td className="tableCell">Person B</td>
                            <td className="tableCell">Person A Won!</td>
                          </tr>
                      </table>
                    </div>
                  </DialogContent>
                  <DialogActions>
                    <Button sx={{ color: 'blue' }} onClick={handleCloseChallenges}>OK</Button>
                  </DialogActions>
                </Dialog>
                {/* END OF CHALLENGES TAB/DIALOG */}
              </Box>
            </div>

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
            <p>Level: {userLevel}</p>
            <p>Total Study Hours: {Math.floor(totalStudyTime / 3600000)} hours</p>
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

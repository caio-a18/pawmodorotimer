import React, { useState } from 'react';
import './Login.css';
import PropTypes from 'prop-types';
import { loginUser } from '../api.js'; 
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions'; 

export default function Login({ setToken, setUsername }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [errorDialog, setErrorDialog] = useState(false); 
  const approvedUsers = ["noah", "asya", "maisoon", "hart", "caio", "profsegovia"]; 
  const approvedPWDs = ["noahisawesome", 
                        "asyaisawesome", 
                        "maisoonisawesome", 
                        "hartisawesome", 
                        "caioisawesome",
                        "profsegoviaisawesome"]

  const handleCloseDialog = () => {
    setErrorDialog(false); 
  }; 
  const handleSubmit = async e => {
    e.preventDefault();
    const userIndex = approvedUsers.indexOf(username);
    if (userIndex !== -1 && approvedPWDs[userIndex] === password) {
      const token = await loginUser({
        username,
        password
      });
      setToken(token);
      setUsername(username);  // Update username in App's state
    } else {
      setErrorDialog(true);
    }
  }

  return(
    
    <div className="login-wrapper">
      <div className="top-bar">
      <div className="login-header">
      <h1>Please Log In!</h1>
      </div>
      </div>
     
    <form onSubmit={handleSubmit}>
      <label>
        <p>Username</p>
        <TextField type="text" onChange={e => setUserName(e.target.value)}/>
      </label>
      <label>
        <p>Password</p>
        <TextField type="password" onChange={e => setPassword(e.target.value)}/>
      </label>
      <div className = "submit-button">
        <Button type="submit">Submit</Button>
      </div>
    </form>
    <Dialog open={errorDialog} onclose={handleCloseDialog}>
    <DialogTitle sx={{ color: 'red' }}>Error</DialogTitle>
        <DialogContent sx={{color: 'blue'}}>
          <p>You are not an approved tomato paws user.</p>
        </DialogContent>
        <DialogActions>
          <Button sx={{color: 'red'}} onClick={handleCloseDialog}>OK</Button>
        </DialogActions>
    </Dialog>
    </div>
  )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
  }; 
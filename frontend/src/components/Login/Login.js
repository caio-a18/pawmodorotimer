import React, { useState } from 'react';
import './Login.css';
import PropTypes from 'prop-types';
import { loginUser, createUser, checkUser } from '../api.js';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

export default function Login({ setToken, handleLoginSuccess }) {
    const [name, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorDialog, setErrorDialog] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleCloseDialog = () => {
        setErrorDialog(false);
    };

    const handleLoginOrRegister = async (e) => {
        e.preventDefault();
        
        // First, check if the user is registered
        try {
            const user = await checkUser(email);
            if (user.exists) {
                console.log("The user exists");
                console.log(user);
                console.log(user.exists);
                // User exists, proceed with login
                try {
                    const token = await loginUser({ name, email, password });
                    setToken(token);
                    handleLoginSuccess(name, token); // Call handleLoginSuccess with username and token
                } catch (loginError) {
                    setErrorDialog(true);
                }
            } else if (isRegistering) {
                console.log("The user does not exists");
                // User does not exist, and is trying to register
                try {
                    await createUser({ name, email, password });
                    alert('User created successfully! Please log in.');
                    setIsRegistering(false); // Switch back to login after registration
                } catch (createError) {
                    alert('Failed to create user: ' + createError.message);
                    console.error('Registration error:', createError);
                }
            } else {
                // User does not exist, and is not in registration mode
                alert('No user found with this email. Please register.');
                setIsRegistering(true); // Prompt user to switch to registration mode
            }
        } catch (checkUserError) {
            console.error('Error checking user:', checkUserError);
            setErrorDialog(true);
        }
    };
    

    return (
        <div className="login-wrapper">
            <form onSubmit={handleLoginOrRegister}>
                <TextField label="Username" type="text" value={name} onChange={e => setUsername(e.target.value)} fullWidth margin="normal"/>
                <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth margin="normal"/>
                <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth margin="normal"/>
                <Button type="submit" variant="contained" color="primary">{isRegistering ? 'Register' : 'Login'}</Button>
                <Button onClick={() => setIsRegistering(!isRegistering)} color="secondary">
                    {isRegistering ? 'Back to Login' : 'Need to Register?'}
                </Button>
            </form>
            <Dialog open={errorDialog} onClose={handleCloseDialog}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <p>{isRegistering ? "A user with this email already exists." : "No account found with this email."}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>OK</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired,
    handleLoginSuccess: PropTypes.func.isRequired
};
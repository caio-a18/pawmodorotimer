// src/components/CalendarView.js
import React from 'react';
import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function CalendarView({ open, onClose, username, totalStudyTime, usernameArray }) {
    const [studyHours, setStudyHours] = useState({ today: 0, week: 0, month: 0, year: 0 });

    const calculateStudyHours = () => {

        const userIndex = usernameArray.indexOf(username);
        if (userIndex !== -1) {
            setStudyHours({
                today: totalStudyTime[userIndex],
                week: totalStudyTime[userIndex] * 7, 
                month: totalStudyTime[userIndex] * 30,
                year: totalStudyTime[userIndex] * 365 
            });
        }
    };

    useEffect(() => {
        calculateStudyHours();
    }, [open, username, totalStudyTime, usernameArray]);

    const today = new Date().toLocaleDateString();

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Study Calendar for {username}</DialogTitle>
            <DialogContent>
                <Box>
                    <p>Today's Date: {today}</p>
                    <p>Study Hours Today: {studyHours.today}</p>
                    <p>Study Hours This Week: {studyHours.week}</p>
                    <p>Study Hours This Month: {studyHours.month}</p>
                    <p>Study Hours This Year: {studyHours.year}</p>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default CalendarView;
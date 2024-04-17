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
        // Assuming totalStudyTime[userIndex] is in minutes
        const userIndex = usernameArray.indexOf(username);
        if (userIndex !== -1) {
            const minutes = totalStudyTime[userIndex];
            const hours = Math.floor(minutes / 60); // Convert minutes to hours and round down to the nearest hour

            // Logic to calculate study time for week, month, year will be similar
            // Need to adjust based on reset logic for each period
            setStudyHours({
                today: hours, // For now, it just sets the hours for today
                week: hours,  // You will need to implement the logic for the week, month, and year
                month: hours,
                year: hours
            });
        }
    };

    useEffect(() => {
        // Logic to reset the study hours based on the date
        const resetDailyStudyHours = () => {
            const currentDate = new Date();
            if (currentDate.getHours() === 0 && currentDate.getMinutes() === 0) {
                // Assuming the reset logic has been implemented elsewhere to reset the totalStudyTime array
                setStudyHours(prevState => ({ ...prevState, today: 0 }));
            }
        };

        const intervalId = setInterval(resetDailyStudyHours, 60000); // Check every minute

        calculateStudyHours();

        return () => clearInterval(intervalId);
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
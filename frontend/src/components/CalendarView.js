import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';  // This imports the default styling

function CalendarView({ open, onClose, username, totalStudyTime, usernameArray }) {
    const [studyHours, setStudyHours] = useState({ today: 0, week: 0, month: 0, year: 0 });
    const [date, setDate] = useState(new Date());  // State to keep track of selected date

    // Function to calculate study times
    const calculateStudyHours = () => {
        // Example calculation logic
        const userIndex = usernameArray.indexOf(username);
        if (userIndex !== -1) {
            setStudyHours({
                today: totalStudyTime[userIndex],
                week: totalStudyTime[userIndex] * 7,  // Dummy calculation
                month: totalStudyTime[userIndex] * 30,  // Dummy calculation
                year: totalStudyTime[userIndex] * 365  // Dummy calculation
            });
        }
    };

    useEffect(() => {
        calculateStudyHours();
    }, [open, username, totalStudyTime, usernameArray]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Study Calendar for {username}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Calendar
                        onChange={setDate}
                        value={date}
                        showNeighboringMonth={false}
                        locale="en-US"
                    />
                    <div>
                        <p>Study Hours Today: {studyHours.today}</p>
                        <p>Study Hours This Week: {studyHours.week}</p>
                        <p>Study Hours This Month: {studyHours.month}</p>
                        <p>Study Hours This Year: {studyHours.year}</p>
                    </div>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default CalendarView;
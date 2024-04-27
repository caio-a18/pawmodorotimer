import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function CalendarView({ open, onClose, userId }) {
    const [studyHours, setStudyHours] = useState({ today: 0, week: 0, month: 0, year: 0 });

    const fetchStudyHours = async (interval) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/user/focus-times`, { 
                params: { userId, interval }
            });
            return response.data.totalMinutes; // Convert minutes to hours
        } catch (error) {
            console.error('Error fetching study hours:', error);
            return 0;
        }
    };

    const updateStudyHours = async () => {
        const todayHours = 1
        const weekHours = await fetchStudyHours('week');
        const monthHours = await fetchStudyHours('month');
        const yearHours = await fetchStudyHours('year');
        setStudyHours({
            today: todayHours,
            week: weekHours,
            month: monthHours,
            year: yearHours
        });
    };

    useEffect(() => {
        if (open) {
            updateStudyHours();
        }
    }, [open, userId]);

    const today = new Date().toLocaleDateString();

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Study Calendar for User ID: {userId}</DialogTitle>
            <DialogContent>
                <Box>
                    <p>Today's Date: {today}</p>
                    <p>Study Hours Today: {studyHours.week.toFixed(2)}</p>
                    <p>Study Hours This Week: {studyHours.week.toFixed(2)}</p>
                    <p>Study Hours This Month: {studyHours.month.toFixed(2)}</p>
                    <p>Study Hours This Year: {studyHours.year.toFixed(2)}</p>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default CalendarView;
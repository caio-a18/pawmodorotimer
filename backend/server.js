const cors = require('cors');
const sequelize = require('./config/db');
const initUserModel = require('./models/users');
const initFocusTimesModel = require('./models/focustimes');
const DataTypes = require('sequelize').DataTypes;
const express = require('express');
const asyncHandler = require('express-async-handler'); // Import express-async-handler

const User = initUserModel(sequelize, DataTypes);
const FocusTimes = initFocusTimesModel(sequelize, DataTypes);

const app = express();

app.use(cors());
app.use(express.json()); // Ensure you can parse JSON request bodies

app.listen(8080, () => console.log('API is running on http://localhost:8080'));

// Initialize database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Sync the database models (create tables)
sequelize.sync()
  .then(() => {
    console.log('Database models synced successfully.');
  })
  .catch((err) => {
    console.error('Unable to sync database models:', err);
  });

app.post('/login', asyncHandler(async (req, res) => {
  res.send({
    token: 'test123'
  });
}));

app.post('/create-user', asyncHandler(async (req, res) => {
  const {email, password, name } = req.body;
  
  const newUser = await User.create({ email, password, name });
  res.status(201).send({ message: 'User created', user: { id: newUser.id, email: newUser.email, name: newUser.name } });
}));

app.post('/api/log-study-session', asyncHandler(async (req, res) => {
  const { user_id, start_time, end_time, duration } = req.body;
  
  try {
      const session = await FocusTimes.create({ user_id, start_time, end_time, duration });
      res.status(201).json(session);
  } catch (error) {
      console.error('Failed to log study session:', error);
      res.status(500).json({ message: 'Failed to log study session' });
  }
}));

app.get('/check-user', asyncHandler(async (req, res) => {
  const { email } = req.query;
  const user = await User.findOne({ where: { email } });
  if (user) {
    res.status(200).send({ exists: true, user: { id: user.id, email: user.email, name: user.name } });
  } else {
    res.status(200).send({ exists: false });
  }
}));

// Update POST route to handle user level and focus time via email
app.post('/api/user/level/update', asyncHandler(async (req, res) => {
  const { email, focusDuration } = req.body;
  
  // Find the user by email
  const user = await User.findOne({ where: { email } });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  console.log("previous focus time: " + user.total_focus_time)
  // Add the focus duration to the existing total focus time
  user.total_focus_time += parseInt(focusDuration);
  console.log("focus duration: " + focusDuration)
  console.log("new focus time: " + user.total_focus_time)
  // Save the updates to the database
  await user.save();

  // Respond with the updated information
  res.json({
    email: user.email,
    totalFocusTime: user.total_focus_time
  });
}));


// Route to get user details by email
app.get('/api/user/details', asyncHandler(async (req, res) => {
  const { email } = req.query;
  const user = await User.findOne({ where: { email } });
  if (user) {
    res.json({
      totalFocusTime: user.total_focus_time, 
      currentLevel: user.currentLevel
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
}));

app.get('/api/get-user-id', asyncHandler(async (req, res) => {
  const { email } = req.query;
  const user = await User.findOne({ where: { email: email }});

  if (user) {
      res.json({ userId: user.id });
  } else {
      res.status(404).json({ message: "User not found" });
  }
}));

app.get('/api/study-time/:user_id', asyncHandler(async (req, res) => {
  const { user_id } = req.params;
  const { period } = req.query;  // 'daily', 'weekly', 'monthly', 'yearly'
  const now = new Date();
  let timePeriod;

  switch(period) {
      case 'daily':
          timePeriod = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
      case 'weekly':
          timePeriod = new Date(now.setDate(now.getDate() - now.getDay()));
          break;
      case 'monthly':
          timePeriod = new Date(now.getFullYear(), now.getMonth());
          break;
      case 'yearly':
          timePeriod = new Date(now.getFullYear(), 0);
          break;
      default:
          return res.status(400).json({ message: 'Invalid period specified' });
  }

  try {
      const sessions = await FocusTimes.findAll({
          where: {
              user_id: user_id,
              start_time: {
                  [sequelize.Op.gte]: timePeriod
              }
          }
      });
      const totalDuration = sessions.reduce((acc, session) => acc + session.duration, 0);
      res.json({ totalDuration });
  } catch (error) {
      console.error('Error fetching study time:', error);
      res.status(500).json({ message: 'Error fetching study time' });
  }
}));

// Route to get aggregated study hours
app.get('/api/user/focus-times', asyncHandler(async (req, res) => {
  const { userId, interval } = req.query; // Interval can be 'day', 'week', 'month', 'year'
  const user = await User.findByPk(userId);
  if (!user) {
      return res.status(404).json({ message: "User not found" });
  }

  const startDate = new Date(); // Starting point for calculation
  switch (interval) {
      case 'day':
          startDate.setHours(0, 0, 0, 0);
          break;
      case 'week':
          startDate.setDate(startDate.getDate() - startDate.getDay());
          startDate.setHours(0, 0, 0, 0);
          break;
      case 'month':
          startDate.setDate(1);
          startDate.setHours(0, 0, 0, 0);
          break;
      case 'year':
          startDate.setMonth(0, 1);
          startDate.setHours(0, 0, 0, 0);
          break;
  }

  const focusTimes = await FocusTimes.findAll({
      where: {
          user_id: userId,
          start_time: { [Op.gte]: startDate }
      }
  });

  const totalMinutes = focusTimes.reduce((acc, cur) => acc + cur.duration, 0);
  res.json({ totalMinutes });
}));


// General error handler for catching async errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'An unexpected error occurred' });
});


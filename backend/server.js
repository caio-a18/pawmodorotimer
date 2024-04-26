const cors = require('cors');
const sequelize = require('./config/db');
const initUserModel = require('./models/users');
const DataTypes = require('sequelize').DataTypes;
const express = require('express');
const asyncHandler = require('express-async-handler'); // Import express-async-handler

const User = initUserModel(sequelize, DataTypes);

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
      totalFocusTime: user.total_focus_time, // Assuming focus time is stored in minutes
      currentLevel: user.currentLevel
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
}));


// General error handler for catching async errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'An unexpected error occurred' });
});


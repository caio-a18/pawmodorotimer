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

app.post('/api/user/level/update/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { focusDuration } = req.body;

  const user = await User.findByPk(userId);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  user.total_focus_time += parseInt(focusDuration);
  const newLevel = Math.floor(user.total_focus_time / 60);

  if (newLevel > user.currentLevel) {
    user.currentLevel = newLevel;
    await user.save();
  }

  res.json({
    userId: user.id,
    newLevel: user.currentLevel,
    totalFocusTime: user.total_focus_time
  });
}));

// General error handler for catching async errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'An unexpected error occurred' });
});


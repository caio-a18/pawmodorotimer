const cors = require('cors');
const sequelize = require('./config/db');
const initUserModel = require('./models/users');
const DataTypes = require('sequelize').DataTypes;
const express = require('express');

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
    console.error('Unable to sync database models:');
  });

app.post('/login', (req, res) => {
  res.send({
    token: 'test123'
  });
});


app.post('/create-user', async (req, res) => {
  const {email, password, name } = req.body;
  
  console.log('Received data:', {email, password, name });  // Add this to log and check what data is received

  try {
      const newUser = await User.create({ email, password, name });
      res.status(201).send({ message: 'User created', user: { id: newUser.id, email: newUser.email, name: newUser.name } });
  } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).send({ message: 'Failed to create user', error: error.message });
  }
});

app.get('/check-user', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      res.status(200).send({ exists: true, user: { id: user.id, email: user.email, name: user.name } });
    } else {
      res.status(200).send({ exists: false });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).send({ message: 'Error checking if user exists', error: error.message });
  }
});

app.post('/api/user/level/update/:userId', async (req, res) => {
  const { userId } = req.params;
  const { focusDuration } = req.body; // focusDuration should be validated to be a number

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the total focus time
    user.total_focus_time += parseInt(focusDuration);

    // Calculate new level based on focus time (assuming 1 level per hour of focus)
    const newLevel = Math.floor(user.total_focus_time / 60);

    // Check if the level has changed to update and possibly add rewards
    if (newLevel > user.currentLevel) {
      user.currentLevel = newLevel;
      // Ideally, this should also update the user record in the database
      await user.save();
    }

    res.json({
      userId: user.id,
      newLevel: user.currentLevel,
      totalFocusTime: user.total_focus_time
    });
  } catch (error) {
    console.error('Error updating user level:', error);
    res.status(500).json({ message: "Failed to update user level", error: error.message });
  }
});


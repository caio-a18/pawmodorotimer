const cors = require('cors');
const sequelize = require('./config/db');
const User = require('./models/users');
const express = require('express');

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

// Existing login endpoint
app.post('/login', (req, res) => {
  res.send({
    token: 'test123'
  });
});

// Mock database for the proof of concept
let users = [
  {
    userId: "12345",
    username: "userOne",
    totalFocusTime: 120, // in minutes
    currentLevel: 2,
    rewards: [],
  },
  // Add more mock users as needed
];

app.post('/create-user', (req, res) => {
  const { username, password } = req.body;
  
  const newUser = {
    id: users.length + 1,
    username,
    password, 
  };

  users.push(newUser);

  res.status(201).send({ message: 'User created', user: newUser });
});

app.post('/api/user/level/update/:userId', (req, res) => {
  const { userId } = req.params;
  const { focusDuration } = req.body; 

  const user = users.find(u => u.userId === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update the total focus time
  user.totalFocusTime += focusDuration;

  // Calculate new level based on focus time
  const newLevel = Math.floor(user.totalFocusTime / 60); // 1 level per hour of focus
  
  // Check if the level has changed to update and possibly add rewards
  if (newLevel > user.currentLevel) {
    user.currentLevel = newLevel;
    
    // For demonstration, add a mock reward for every level gained
    user.rewards.push({
      rewardType: "cat sticker",
      rewardName: `Level ${newLevel} Sticker`,
      description: `A special sticker for reaching level ${newLevel}.`
    });
  }

});
/*

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.use('/login', (req, res) => {
  res.send({
    token: 'test123'
  });
});

app.listen(8080, () => console.log('API is running on http://localhost:8080/login'));*/

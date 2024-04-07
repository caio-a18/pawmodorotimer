const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // Ensure you can parse JSON request bodies

// Existing login endpoint
app.post('/login', (req, res) => {
  res.send({
    token: 'test123'
  });
});

// Add the new user creation endpoint
let users = []; // Mock database for demonstration

app.post('/create-user', (req, res) => {
  const { username, password } = req.body;
  
  // In a real application, you'd validate and hash the password
  const newUser = {
    id: users.length + 1,
    username,
    password, // Remember: store passwords securely in production
  };

  users.push(newUser);

  res.status(201).send({ message: 'User created', user: newUser });
});

app.listen(8080, () => console.log('API is running on http://localhost:8080'));



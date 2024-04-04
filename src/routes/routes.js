const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const app = express();
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {

        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({
            username,
            email,
            password: hashPassword,
        });

        res.status(201).json({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
        });
    } 
    catch(error) {
        console.error('Error creatinguser:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server running on port ${PORT}'));

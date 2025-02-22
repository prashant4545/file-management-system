const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Authenticate user
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, username: user.username }, 'a55efbb9f5e6bfe5c2c69d9cff9f3f9e66ad4d1f0ef2f6dde36acd53676fd245cad97c3e4a01821c25c2b419fbe25592765a1cde0bca5144af550c66d5d93a17', { expiresIn: '12h' });

        return res.status(200).json({ token });  // Send the token to the user
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Function to handle admin login
const loginAdmin = (req, res) => {
    const { username, password } = req.body;

    if (username === process.env.ADMIN_USERNAME) {
        bcrypt.compare(password, process.env.ADMIN_PASSWORD, (err, isMatch) => {
            if (isMatch) {
                // Generate a JWT token
                const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.status(200).json({
                    message: 'Login successful!',
                    token: token
                });
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
};

module.exports = {
    loginAdmin
};

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST api/users
// @desc    Register user
// @access  Public




//return specific user
router.get('/:UserId', async (req, res) => {
    try {
        const user = await User.findOne({ UserId: req.params.UserId });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server error');
    }
});

//return all users


router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


//create user
router.post('/', async (req, res) => {
    const { name, email, password, employeeId, username } = req.body;

    try {
        let user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password, 
            employeeId,
            username,
        });

        await user.save();

        res.send('User registered');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



//update user
router.put('/:UserId', async (req, res) => {
    const { name, email, password, employeeId, username } = req.body;

    // Build user object
    const userFields = {};
    if (name) userFields.name = name;
    if (email) userFields.email = email;
    if (password) userFields.password = password;
    if (employeeId) userFields.employeeId = employeeId;
    if (username) userFields.username = username;

    try {
        let user = await User.findOne({ UserId: req.params.UserId });

        if (!user) return res.status(404).json({ msg: 'User not found' });

        user = await User.findOneAndUpdate(
            { UserId: req.params.UserId },
            { $set: userFields },
            { new: true }
        );

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//delete users
router.delete('/:UserId', async (req, res) => {
try {
    const user = await User.findOneAndDelete({ UserId: req.params.UserId });

    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ msg: 'User removed' });
} catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
}
});





module.exports = router;

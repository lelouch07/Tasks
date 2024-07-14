const express = require('express');
const router = express.Router();
const MacUserMap = require('../models/MacUserMap');
const ReportOfTimeSpent = require('../models/ReportOfTimeSpent');

// Get time logged by userId
// @route   GET api/machineUserMappings/logs/user/:userId
// @desc    Get time logged by user
// @access  Public
router.get('/user/:userId', async (req, res) => {
    try {
        const logs = await ReportOfTimeSpent.find({ UserId: req.params.userId });
        if (!logs) {
            return res.status(404).json({ msg: 'Logs not found for this user' });
        }
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get time logged by machineId
// @route   GET api/machineUserMappings/logs/machine/:machineId
// @desc    Get time logged by machine
// @access  Public
router.get('machine/:machineId', async (req, res) => {
    try {
        const logs = await ReportOfTimeSpent.find({ MachineId: req.params.machineId });
        if (!logs) {
            return res.status(404).json({ msg: 'Logs not found for this machine' });
        }
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get time logged by activityId
// @route   GET api/machineUserMappings/logs/activity/:activityId
// @desc    Get time logged by activity
// @access  Public
router.get('activity/:activityId', async (req, res) => {
    try {
        const logs = await ReportOfTimeSpent.find({ activityId: req.params.activityId });
        if (!logs) {
            return res.status(404).json({ msg: 'Logs not found for this activity' });
        }
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get time logged by date
// @route   GET api/machineUserMappings/logs/date/:date
// @desc    Get time logged by date
// @access  Public
router.get('/date/:date', async (req, res) => {
    try {
        const date = new Date(req.params.date);
        const logs = await ReportOfTimeSpent.find({ date: { $eq: date } });
        if (!logs) {
            return res.status(404).json({ msg: 'Logs not found for this date' });
        }
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

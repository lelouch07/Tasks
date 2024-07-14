const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

// @route   POST api/activities
// @desc    Create a new activity
// @access  Public
router.post('/', async (req, res) => {
    const { activityId, activityName, requiredTime } = req.body;

    try {
        let activity = await Activity.findOne({ activityId });

        if (activity) {
            return res.status(400).json({ msg: 'Activity already exists' });
        }

        activity = new Activity({
            activityId,
            activityName,
            requiredTime,
        });

        await activity.save();

        res.send('Activity created');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/activities
// @desc    Get all activities
// @access  Public
router.get('/', async (req, res) => {
    try {
        const activities = await Activity.find();
        res.json(activities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/activities/:activityId
// @desc    Get activity by activityId
// @access  Public
router.get('/:activityId', async (req, res) => {
    try {
        const activity = await Activity.findOne({ activityId: req.params.activityId });

        if (!activity) {
            return res.status(404).json({ msg: 'Activity not found' });
        }

        res.json(activity);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Activity not found' });
        }
        res.status(500).send('Server error');
    }
});

// @route   PUT api/activities/:activityId
// @desc    Update activity by activityId
// @access  Public
router.put('/:activityId', async (req, res) => {
    const { activityName, requiredTime } = req.body;

    // Build activity object
    const activityFields = {};
    if (activityName) activityFields.activityName = activityName;
    if (requiredTime) activityFields.requiredTime = requiredTime;

    try {
        let activity = await Activity.findOne({ activityId: req.params.activityId });

        if (!activity) return res.status(404).json({ msg: 'Activity not found' });

        activity = await Activity.findOneAndUpdate(
            { activityId: req.params.activityId },
            { $set: activityFields },
            { new: true }
        );

        res.json(activity);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/activities/:activityId
// @desc    Delete activity by activityId
// @access  Public
router.delete('/:activityId', async (req, res) => {
    try {
        const activity = await Activity.findOneAndDelete({ activityId: req.params.activityId });

        if (!activity) {
            return res.status(404).json({ msg: 'Activity not found' });
        }

        res.json({ msg: 'Activity removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Activity not found' });
        }
        res.status(500).send('Server error');
    }
});

module.exports = router;

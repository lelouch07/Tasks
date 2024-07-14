const express = require('express');
const router = express.Router();
const MacUserMap = require('../models/MacUserMap');
const ReportOfTimeSpent = require('../models/ReportOfTimeSpent');
const Machine = require('../models/Machine');
const Activity = require('../models/Activity');

// @route   POST api/machines
// @desc    Create a new machine mapping
// @access  Public
router.post('/', async (req, res) => {
    const { UserId, MachineId } = req.body;

    try {
        let mapping = await MacUserMap.findOne({ UserId });

        if (mapping) {
            return res.status(400).json({ msg: 'User is already mapped to a machine' });
        }

        mapping = new MacUserMap({
            UserId,
            MachineId
        });

        await mapping.save();

        // Fetch the activityId from the machine
        const machine = await Machine.findOne({MachineId});
        if (!machine) {
            return res.status(404).json({ msg: 'Machine not found' });
        }
        const activityId = machine.activityId;
        const activity = await Activity.findOne({activityId});
        if (!activity) {
            return res.status(404).json({ msg: 'Activity not found' });
        }
        
        // Create a log entry with default values and required time from the activity
        const logEntry = new ReportOfTimeSpent({
            UserId,
            MachineId,
            activityId: activityId,
            timeSpent: activity.requiredTime,  // Default time spent
            date: new Date()  // Current date
        });
        
        await logEntry.save();
        
        res.send('Machine-User mapping created and activity logged');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
// @route   PUT api/machines/:UserId
// @desc    Update machine mapping by UserId
// @access  Public

router.put('/:userId', async (req, res) => {
    const { MachineId } = req.body;

    try {
        let mapping = await MacUserMap.findOne({ UserId: req.params.userId });
        
        if (!mapping) {
            return res.status(404).json({ msg: 'Mapping not found' });
        }
        // Check if the new MachineId is already in use
        let existingMapping = await MacUserMap.findOne({ MachineId });
        if (existingMapping) {
            return res.status(400).json({ msg: 'Machine is already assigned to another user' });
        }
        
        mapping.MachineId = MachineId;
        
        await mapping.save();
        
        // Fetch the activityId from the machine
        const machine = await Machine.findOne({MachineId});
        if (!machine) {
            return res.status(404).json({ msg: 'Machine not found' });
        }
        
        const activityId = machine.activityId;
        const activity = await Activity.findOne({activityId});
        if (!activity) {
            return res.status(404).json({ msg: 'Activity not found' });
        }

        // Update the log entry with the new machineId and required time from the activity
        // const logEntry = await ReportOfTimeSpent.findOne({ UserId: req.params.userId });
        // if (logEntry) {
        //     logEntry.MachineId = MachineId;
        //     logEntry.activityId = machine.activityId;
        //     logEntry.timeSpent += activity.requiredTime;  // Reset time spent
        //     logEntry.date = new Date();  // Update to current date

        //     await logEntry.save();
        // } else {
            // If no log entry exists, create a new one
            const newLogEntry = new ReportOfTimeSpent({
                UserId: req.params.userId,
                MachineId,
                activityId: activityId,
                timeSpent: activity.requiredTime,  // Default time spent
                date: new Date()  // Current date
            });

            await newLogEntry.save();
    // }

        res.json(mapping);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

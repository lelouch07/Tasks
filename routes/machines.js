const express = require('express');
const router = express.Router();
const Machine = require('../models/Machine');

// @route   POST api/machines
// @desc    Create a new machine
// @access  Public
router.post('/', async (req, res) => {
    const { Machinecode, orderNumber, activityId } = req.body;

    try {
        let machine = await Machine.findOne({ Machinecode });

        if (machine) {
            return res.status(400).json({ msg: 'Machine already exists' });
        }

        machine = new Machine({
            Machinecode,
            orderNumber,
            activityId
        });

        await machine.save();

        res.send('Machine created');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/machines
// @desc    Get all machines
// @access  Public
router.get('/', async (req, res) => {
    try {
        const machines = await Machine.find();
        res.json(machines);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/machines/:MachineId
// @desc    Get machine by MachineId
// @access  Public
router.get('/:MachineId', async (req, res) => {
    try {
        const machine = await Machine.findOne({ MachineId: req.params.MachineId });

        if (!machine) {
            return res.status(404).json({ msg: 'Machine not found' });
        }

        res.json(machine);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Machine not found' });
        }
        res.status(500).send('Server error');
    }
});

// @route   PUT api/machines/:MachineId
// @desc    Update machine by MachineId
// @access  Public
router.put('/:MachineId', async (req, res) => {
    const { Machinecode, orderNumber, activityId } = req.body;

    // Build machine object
    const machineFields = {};
    if (Machinecode) machineFields.Machinecode = Machinecode;
    if (orderNumber) machineFields.orderNumber = orderNumber;
    if (activityId) machineFields.activityId = activityId;

    try {
        let machine = await Machine.findOne({ MachineId: req.params.MachineId });

        if (!machine) return res.status(404).json({ msg: 'Machine not found' });

        machine = await Machine.findOneAndUpdate(
            { MachineId: req.params.MachineId },
            { $set: machineFields },
            { new: true }
        );

        res.json(machine);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/machines/:MachineId
// @desc    Delete machine by MachineId
// @access  Public
router.delete('/:MachineId', async (req, res) => {
    try {
        const machine = await Machine.findOneAndDelete({ MachineId: req.params.MachineId });

        if (!machine) {
            return res.status(404).json({ msg: 'Machine not found' });
        }

        res.json({ msg: 'Machine removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Machine not found' });
        }
        res.status(500).send('Server error');
    }
});

module.exports = router;

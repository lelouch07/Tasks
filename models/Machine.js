const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// MachineName



// To create an auto - incrementing MachineId in your Machine model, you can use a separate collection to store the current counter value and increment it each time a new Machine is created.We'll use the mongoose-sequence plugin to handle the auto-incrementing functionality. However, mongoose-sequence increments from 1 by default. For starting from 1001, we need a custom solution.
const MachineSchema = new mongoose.Schema({
   
    Machinecode: {
        type: String,
        required: true,
        unique:true,
    },
    orderNumber: {
        type: Number,
        required: true,
    },
    activityId: {
        type: String,
        required: true,
    },
    

});

MachineSchema.plugin(AutoIncrement, { inc_field: 'MachineId' });


module.exports = mongoose.model('Machine', MachineSchema);

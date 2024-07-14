const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-sequence')(mongoose);




const ActivitySchema = new mongoose.Schema({
    activityId:{
        type: String,
        required: true,
    },
    activityName: {
        type: String,
        required: true,
    },
    requiredTime: {
        type: Number,
        required: true,
        min: [0, 'Duration must be a positive number']
    }

});


module.exports = mongoose.model('Activity', ActivitySchema);

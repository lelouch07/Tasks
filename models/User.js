const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcryptjs');

// userName



// To create an auto - incrementing userId in your User model, you can use a separate collection to store the current counter value and increment it each time a new user is created.We'll use the mongoose-sequence plugin to handle the auto-incrementing functionality. However, mongoose-sequence increments from 1 by default. For starting from 1001, we need a custom solution.
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    //hashing in password
    password: {
        type: String,
        required:true,
    },
    employeeId:{
        type: Number,
        required: true,
        unique:true
    }

});

UserSchema.plugin(AutoIncrement, { inc_field: 'UserId' });
// Hash password before saving to database
UserSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model('User', UserSchema);

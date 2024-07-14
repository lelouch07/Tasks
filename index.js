const express = require('express');
const connectDB=require('./config/db')
const UserRoute=require('./routes/users')
const ActivityRoute=require('./routes/activities')
const MachineRoute=require('./routes/machines')
const MacUserRoute=require('./routes/macUserMap')
const LogRoute=require('./routes/logs')

const app = express();
const port = 3000;

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true })); // Add this line to handle x-www-form-urlencoded

// Connect to MongoDB
connectDB();
app.use('/api/users',UserRoute);
app.use('/api/activities',ActivityRoute);
app.use('/api/machines',MachineRoute);
app.use('/api/macUserMap',MacUserRoute);
app.use('/api/logs',LogRoute);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

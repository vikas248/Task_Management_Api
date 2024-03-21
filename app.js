require('dotenv').config();

// app.js
const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

const session = require('express-session');
const redis = require('redis');

// Create Redis client
const client = redis.createClient({
  host: 'redis-15327.c212.ap-south-1-1.ec2.cloud.redislabs.com', // Redis server host
  port: 15327,        // Redis server port
  password: '1IXuicswA2chwPn0GUOIturRfYfeDqnO',       
});

// Handle Redis connection errors
client.on('error', err => {
  console.error('Redis Error:', err);
});

// Test Redis connection
client.on('connect', () => {
  console.log('Connected to Redis');
});

const app = express();

const PORT = process.env.PORT;

app.use(session({
  secret: process.env.SESSION_SECRET, // Replace 'your_secret_key' with your session secret
  resave: false,
  saveUninitialized: false,
  store: new (require('express-session').MemoryStore)({ client: client }),
}));

// Middleware
app.use(express.json());

const MONGOURL = process.env.MONGOURL;
// Connect to MongoDB
mongoose.connect(MONGOURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/user', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

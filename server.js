// server.js
import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

// Controllers
import rootHandler from './controllers/root.js';
import signinHandler from './controllers/signin.js';
import registerHandler from './controllers/register.js';
import profileHandler from './controllers/profile.js';
import updateHandler from './controllers/update.js';
import deleteUserHandler from './controllers/delete.js';
import { handleApiCall, handleImage } from './controllers/image.js';

// Database setup
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    // Use SSL only if DATABASE_URL is on Render
    ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes("render.com") 
         ? { rejectUnauthorized: false } 
         : false
  }
});

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',                     // React dev server
  'https://facerecognitionbrain-9n95.onrender.com' // Deployed frontend
];

app.use(cors({
  origin: function(origin, callback){
    // Allow requests with no origin (like Postman or curl)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// ROUTES

// Root
app.get('/', (req, res) => rootHandler(req, res, db));

// Signin
app.post('/signin', (req, res) => signinHandler(req, res, db, bcrypt));

// Register
app.post('/register', (req, res) => registerHandler(req, res, db, bcrypt));

// Profile
app.get('/profile/:id', (req, res) => profileHandler(req, res, db));

// Update Profile
app.put('/profile/:id', (req, res) => updateHandler(req, res, db));

// Delete User
app.delete('/profile/:id', (req, res) => deleteUserHandler(req, res, db));

// Increment entries
app.put('/image', (req, res) => handleImage(req, res, db));

// Clarifai API call
app.post('/imageurl', (req, res) => handleApiCall(req, res));

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

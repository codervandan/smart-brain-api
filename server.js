// server.js
import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';


// Controllers (all default exports)
import rootHandler from './controllers/root.js';
import signinHandler from './controllers/signin.js';
import registerHandler from './controllers/register.js';
import profileHandler from './controllers/profile.js';
import updateHandler from './controllers/update.js';
import deleteUserHandler from './controllers/delete.js';
import { handleApiCall, handleImage } from './controllers/image.js';

const db = knex({
  client: 'pg',
  connection: {
    host: 'dpg-d3a38kvdiees73b7io30-a', // Update to your database host
    user: 'smart_brain_db_kgb4_user', // Update with your DB user
    password: 'IxiB1uZZV5nD2HlGwUaaibTOM0fYPuoq', // Update with your DB password
    database: 'smart_brain_db_kgb4' // Update with your DB name
  }
});

const app = express();

app.use(cors());
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

// Update Profile (e.g., change name)
app.put('/profile/:id', (req, res) => updateHandler(req, res, db));

// Delete User
app.delete('/profile/:id', (req, res) => deleteUserHandler(req, res, db));

// Increment entries
app.put('/image', (req, res) => handleImage(req, res, db));

// Clarifai API call
app.post('/imageurl', (req, res) => handleApiCall(req, res));

// Set server to listen on environment port or 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

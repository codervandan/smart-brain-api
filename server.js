// server.js
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

// Controllers 
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const update = require('./controllers/update');
const deleteUser = require('./controllers/delete');
const image = require('./controllers/image');
const root = require('./controllers/root');



// Connect to Postgres
const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'devop',
    password: '5356',
    database: 'smart-brain-db',
  },
});

const app = express();
app.use(express.json());
app.use(cors());

// Endpoints 

// Root route: return all users
app.get('/', (req, res) => { root.handleRoot(req, res, db) });
// SIGNIN
app.post('/signin', signin.handleSignin(db, bcrypt) );
// REGISTER
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) }); 
// PROFILE
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });
// UPDATE PROFILE (e.g., change name)
app.put('/profile/:id', (req, res) => { update.handleUpdateProfile(req, res, db) });
// DELETE USER
app.delete('/profile/:id', (req, res) => { deleteUser.handleDeleteUser(req, res, db) });
// IMAGE (increment entries)
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
// IMAGE (Clarifai API call)
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

//Listener
app.listen(3001, () => {
  console.log('app is running on port 3001');
});

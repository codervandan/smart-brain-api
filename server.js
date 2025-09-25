// server.js
import 'dotenv/config';       // loads .env first
import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import db from './db.js';     // import db AFTER dotenv

// Controllers
import rootHandler from './controllers/root.js';
import signinHandler from './controllers/signin.js';
import registerHandler from './controllers/register.js';
import profileHandler from './controllers/profile.js';
import updateHandler from './controllers/update.js';
import deleteUserHandler from './controllers/delete.js';
import { handleApiCall, handleImage } from './controllers/image.js';

// Debug environment variables
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('DATABASE_SSL:', process.env.DATABASE_SSL);

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',                     // React dev server
  'https://facerecognitionbrain-9n95.onrender.com' // Deployed frontend
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'CORS policy does not allow this Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// ROUTES
app.get('/', (req, res) => rootHandler(req, res, db));
app.post('/signin', (req, res) => signinHandler(req, res, db, bcrypt));
app.post('/register', (req, res) => registerHandler(req, res, db, bcrypt));
app.get('/profile/:id', (req, res) => profileHandler(req, res, db));
app.put('/profile/:id', (req, res) => updateHandler(req, res, db));
app.delete('/profile/:id', (req, res) => deleteUserHandler(req, res, db));
app.put('/image', (req, res) => handleImage(req, res, db));
app.post('/imageurl', (req, res) => handleApiCall(req, res));

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

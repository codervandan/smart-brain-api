// signin.js
const signinHandler = async (req, res, db, bcrypt) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'incorrect form submission' });
  }

  try {
    // Get the hash from login table
    const loginRows = await db('login')
      .where('email', email)
      .select('hash');

    if (loginRows.length === 0) {
      return res.status(400).json({ error: 'Wrong credentials' });
    }

    const isValid = bcrypt.compareSync(password, loginRows[0].hash);
    if (!isValid) {
      return res.status(400).json({ error: 'Wrong credentials' });
    }

    // Get the user info from users table
    const userRows = await db('users')
      .where('email', email)
      .select('*');

    if (userRows.length === 0) {
      return res.status(400).json({ error: 'Unable to get user' });
    }

    // Return a single user object
    res.json(userRows[0]);
  } catch (err) {
    console.error('Signin error:', err);
    res.status(400).json({ error: 'Unable to signin', details: err.message });
  }
};

export default signinHandler;

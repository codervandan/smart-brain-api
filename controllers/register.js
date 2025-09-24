// register.js

const registerHandler = async (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;

  console.log('Received register request:', req.body);

  // Validate input
  if (!email || !name || !password) {
    console.warn('Incorrect form submission:', req.body);
    return res.status(400).json({ error: 'Incorrect form submission' });
  }

  const hash = bcrypt.hashSync(password);

  try {
    await db.transaction(async trx => {
      // Insert into login table
      const loginEmailArr = await trx('login')
        .insert({ hash, email })
        .returning('email');

      console.log('Inserted into login:', loginEmailArr);

      if (!loginEmailArr || loginEmailArr.length === 0) {
        throw new Error('Login insert returned empty');
      }

      const plainEmail =
        typeof loginEmailArr[0] === 'object' ? loginEmailArr[0].email : loginEmailArr[0];

      // Insert into users table
      const userRows = await trx('users')
        .insert({
          name,
          email: plainEmail,
          joined: new Date() // entries column defaults to 0
        })
        .returning('*');

      console.log('Inserted into users:', userRows[0]);

      if (!userRows || userRows.length === 0) {
        throw new Error('Users insert returned empty');
      }

      // Respond with the created user
      res.json(userRows[0]);
    });
  } catch (err) {
    console.error('Register error:', err);

    // Handle duplicate email gracefully
    if (err.code === '23505') { // PostgreSQL unique violation
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Return the error message for debugging
    res.status(400).json({ error: 'Unable to register', details: err.message });
  }
};

export default registerHandler;

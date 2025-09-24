// register.js

const registerHandler = async (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;

  // Validate input
  if (!email || !name || !password) {
    return res.status(400).json({ error: 'Incorrect form submission' });
  }

  const hash = bcrypt.hashSync(password);

  try {
    await db.transaction(async trx => {
      // Insert into login table
      const loginEmailArr = await trx('login')
        .insert({ hash, email })
        .returning('email');

      if (!loginEmailArr || loginEmailArr.length === 0) {
        throw new Error('Failed to insert into login');
      }

      const plainEmail =
        typeof loginEmailArr[0] === 'object' ? loginEmailArr[0].email : loginEmailArr[0];

      // Insert into users table
      const userRows = await trx('users')
        .insert({
          name,
          email: plainEmail,
          joined: new Date() // entries column will default to 0 automatically
        })
        .returning('*');

      if (!userRows || userRows.length === 0) {
        throw new Error('Failed to insert into users');
      }

      // Respond with the created user
      res.json(userRows[0]);
    });
  } catch (err) {
    console.error('Register error:', err);

    // Handle duplicate email more gracefully
    if (err.code === '23505') { // PostgreSQL unique violation
      return res.status(400).json({ error: 'Email already exists' });
    }

    res.status(400).json({ error: 'Unable to register' });
  }
};

export default registerHandler;

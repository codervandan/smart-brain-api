// register.js

const registerHandler = async (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ error: 'incorrect form submission' });
  }

  const hash = bcrypt.hashSync(password);

  try {
    await db.transaction(async trx => {
      // Insert into login table
      const loginEmailArr = await trx('login')
        .insert({ hash, email })
        .returning('email');

      console.log('Inserted into login:', loginEmailArr);

      const plainEmail = typeof loginEmailArr[0] === 'object' ? loginEmailArr[0].email : loginEmailArr[0];

      // Insert into users table
      const userRows = await trx('users')
        .insert({
          name,
          email: plainEmail,
          joined: new Date()
        })
        .returning('*');

      console.log('Inserted into users:', userRows[0]);

      // Respond with the created user
      res.json(userRows[0]);
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(400).json({ error: 'unable to register' });
  }
};

export default registerHandler;

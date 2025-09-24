//Signin 
const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'incorrect form submission' });
  }

  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      if (!data.length) {
        return res.status(400).json({ error: 'wrong credentials' });
      }

      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (!isValid) {
        return res.status(400).json({ error: 'wrong credentials' });
      }

      // fetch user profile safely
      db.select('*').from('users')
        .where('email', '=', email)
        .then(user => {
          if (!user.length) {
            return res.status(400).json({ error: 'user not found' });
          }
          res.json(user[0]); // always send a valid JSON object
        })
        .catch(() => res.status(400).json({ error: 'unable to get user' }));
    })
    .catch(() => res.status(400).json({ error: 'wrong credentials' }));
}

module.exports = {
  handleSignin: handleSignin
};
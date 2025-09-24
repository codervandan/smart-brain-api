//Register 
const handleRegister = (req, res, db, bcrypt) => {

const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json({ error: 'incorrect form submission' });
  }

  const hash = bcrypt.hashSync(password);

  db.transaction(trx => {
    trx.insert({ hash, email }) // store email as plain string
      .into('login')
      .returning('email')
      .then(loginEmail => {
        const plainEmail = typeof loginEmail[0] === 'object' ? loginEmail[0].email : loginEmail[0];
        return trx('users')
          .insert({
            name: name,
            email: plainEmail, // now loginEmail[0] is plain string
            joined: new Date()
          })
          .returning('*')
          .then(userRows => res.json(userRows[0]))
          .catch(err => res.status(400).json({ error: 'unable to register user' }));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(400).json({ error: 'unable to register' }));
}

module.exports = {
  handleRegister: handleRegister
};
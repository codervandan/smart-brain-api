const handleRoot = (req, res, db) => {
  db.select('*')
    .from('users')
    .then(users => res.json(users))
    .catch(err => res.status(400).json({ error: 'unable to fetch users' }));
}

module.exports = {
  handleRoot
}
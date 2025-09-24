const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db('users')
    .where({ id })
    .select('*')
    .then(data => {
      if (!data.length) {
        return res.status(404).json({ error: 'user not found' });
      }
      res.json(data[0]);
    })
    .catch(() => res.status(400).json({ error: 'error fetching user' }));
}

module.exports = {
  handleProfileGet
}
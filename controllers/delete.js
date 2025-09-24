const handleDeleteUser = (req, res, db) => {
  const { id } = req.params;
  db('users')
    .where({ id })
    .del()
    .then(resp => {
      if (resp) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'user not found' });
      }
    })
    .catch(() => res.status(400).json({ error: 'unable to delete user' }));
}

module.exports = {
  handleDeleteUser
}
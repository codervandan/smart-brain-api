// update.js
const updateHandler = (req, res, db) => {
  const { id } = req.params;
  const { name } = req.body;

  db('users')
    .where({ id })
    .update({ name })
    .returning('*')
    .then(user => res.json(user[0]))
    .catch(() => res.status(400).json({ error: 'unable to update profile' }));
};

export default updateHandler;

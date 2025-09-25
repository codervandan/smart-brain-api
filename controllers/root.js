// controllers/root.js

const rootHandler = (req, res, db) => {
  console.log("Root route hit");

  db.select('*')
    .from('users')
    .then(users => {
      console.log("Fetched users:", users);
      res.json(users);
    })
    .catch(err => {
      console.error("Error fetching users:", err);
      res.status(400).json({
        error: 'unable to fetch users',
        details: err.message
      });
    });
};

export default rootHandler;

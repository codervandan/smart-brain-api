const fetch = require('node-fetch');

// Clarifai credentials (keep these only in backend!)
const PAT = "c2c98aedfb534f4abfc1e7e531a481cd";
const USER_ID = "danieldeveloper";
const APP_ID = "facerecognitionbrain";
const MODEL_ID = "face-detection";
const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";

const handleApiCall = (req, res) => {
  const { input } = req.body;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: { url: input },
        },
      },
    ],
  });

  fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  })
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(err => res.status(400).json({ error: "unable to work with API" }));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where({ id })
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      if (!entries.length) {
        return res.status(400).json({ error: "unable to get entries" });
      }
      res.json({ entries: entries[0].entries });
    })
    .catch(() => res.status(400).json({ error: "unable to get entries" }));
};

module.exports = {
  handleApiCall,
  handleImage,
};








// const Clarifai = require('clarifai')

// // Clarifai credentials
//   const PAT = "c2c98aedfb534f4abfc1e7e531a481cd";
//   const USER_ID = "danieldeveloper";
//   const APP_ID = "facerecognitionbrain";
//   const MODEL_ID = "face-detection";
//   const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";
//   const PROXY_URL = "https://cors-anywhere.herokuapp.com/";

// const handleImage = (req, res, db) => {
//   const { id } = req.body;
//   db('users')
//     .where({ id })
//     .increment('entries', 1)
//     .returning('entries')
//     .then(entries => {
//       if (!entries.length) {
//         return res.status(400).json({ error: 'unable to get entries' });
//       }
//       res.json({ entries: entries[0].entries });
//     })
//     .catch(() => res.status(400).json({ error: 'unable to get entries' }));
// }

// module.exports = {
//   handleImage
// }
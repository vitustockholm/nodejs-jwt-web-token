require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

const posts = [
  {
    username: 'Test',
    title: 'Test',
  },
  {
    username: 'Test2',
    title: 'Title2',
  },
];

app.get('/posts', authentificateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

app.post('/login', (req, res) => {
  //create token jwt
  //Authentification
  const username = req.body.username;
  const user = { name: username };
  //> require('crypto').randomBytes(64).toString('hex') + node in cp

  const accessToken = jwt.sign(user, process.env.ACESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });
});
//token get verification -
function authentificateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  //
  if (token == null) return res.sendStatus(401);
  // Bearer TOKEN
  jwt.verify(token, process.env.ACESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(5000);

require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

let refreshToken = [];

app.post('/token', (req, res) => {
  const refreshToken = req.body.token;

  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshToken.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify((refreshToken, process.env.REFRESH_TOKEN_SECRET), (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccesToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});
//delete refresh token
app.delete('logout', (req, res) => {
  refreshToken = refreshToken.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.post('/login', (req, res) => {
  //Authentification
  const username = req.body.username;
  const user = { name: username };

  const accessToken = generateAccesToken(user);
  const refreshToken = jwt.sign(user, process.env.ACESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});
//token get verification -
function generateAccesToken(user) {
  return jwt.sign(user, process.env.ACESS_TOKEN_SECRET, { expiresIn: '15s' });
}

app.listen(6000);

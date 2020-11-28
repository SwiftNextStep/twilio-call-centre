const jwt = require('jsonwebtoken');

const SECRETE_KEY = 'SOME_SECRETE_STRING';

function createJwt(username) {
  const token = jwt.sign({ username }, SECRETE_KEY);
  return token;
}

function verifyToken(token) {
  const data = jwt.verify(token, SECRETE_KEY);
  return data;
}

module.exports = {
  createJwt,
  verifyToken,
};

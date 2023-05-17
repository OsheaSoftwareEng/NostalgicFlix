const jwtSecret = 'your_jwt_secret'; //has to be same key used in the jwtStratehy in the passport.js file
const jwt = require('jsonwebtoken');
const passport = require('passport');

require('./passport'); //you local passport file

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, //This is the username you're encoding in JWT
    expiresIn: '7d', //This specifies when the token will expire
    algorithm: 'HS256' //This is the algorithm used to "sign" or encode the values of the JWT
  });
};

//POST Login
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};

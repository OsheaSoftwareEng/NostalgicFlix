const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Models = require('./models.js');
const passportJWT = require('passport-jwt');

let Users = Models.User;
let jwtStrategy = passportJWT.Strategy;
let extractJWT = passportJWT.ExtractJwt;

passport.use(
  new localStrategy(
    {
      usernameField: 'Username',
      passwordField: 'Password'
    },
    (username, password, callback) => {
      console.log(username + ' ' + password);
      Users.findOne({ Username: username }, (error, user) => {
        if (error) {
          console.log(error);
          return callback(error);
        }

        if (!user) {
          console.log('incorrect username');
          return callback(null, false, {
            message: 'Incorrect username or password.'
          });
        }

        console.log('finished');
        return callback(null, user);
      });
    }
  )
);

passport.use(
  new jwtStrategy(
    {
      jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_jwt_secret'
    },
    (jwtPayload, callback) => {
      return Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);
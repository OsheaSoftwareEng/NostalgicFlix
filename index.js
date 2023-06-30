const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const { check, validationResult } = require('express-validator');
const app = express();
app.use(express.json());
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

const JWT_SECRET =
  'hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

//local host
// mongoose.connect('mongodb://localhost:27017/nfDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

//external port
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const cors = require('cors');

const allowedOrigins = [
  'http://localhost:8080',
  'https://nostalgic-flix.herokuapp.com',
  'http://localhost:1234',
  'https://nostalgicflix-api.onrender.com/'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        let message =
          "The CORS policy for this application doesn't allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    }
  })
);

let auth = require('./auth.js')(app);
const passport = require('passport');
const { measureMemory } = require('vm');
const { has } = require('lodash');
const { hash } = require('bcrypt');
require('./passport.js');

//combining morgan with the accessLogScream to log users who visit the website.
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a'
});
app.use(morgan('combined', { stream: accessLogStream }));

//automatically sends all files that are requested from within the public folder.
app.use(express.static('public'));

//this setups a message once the user goes to the home page of the website.
app.get('/', (request, response) => {
  response.send('Welcome to Nostalgicflix!');
});

//returns a JSON object of all current users
app.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//get a user by username
app.get(
  '/users/:userName',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.userName })
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//gets a JSON object of all the current movies on the server
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//searches for movies by their title and returns a  single JSON object
app.get(
  '/movies/:title',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.title })
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//searches for movies by their genre and returns a JSON object
app.get(
  '/movies/genres/:genreName',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.find({ 'Genre.Name': req.params.genreName })
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        res.status(500).send('Error: ' + err);
      });
  }
);

//searches for movies by the directors name and returns the movies with that directors name
app.get(
  '/movies/directors/:directorsName',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.find({ 'Director.Name': req.params.directorsName })
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        res.status(500).send('Error: ' + err);
      });
  }
);

//creates a new user and adds them to the list of users.
app.post(
  '/users',

  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ],

  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const hashPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

//allows users to save movies to their favorites!
app.post(
  '/users/:userName/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.userName },
      {
        $addToSet: { FavoriteMovies: req.params.MovieID }
      },
      { new: true } //This line makes sure the updated document is returned
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("Error: User doesn't exist");
        } else {
          res.json(updatedUser);
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

//deletes a user by username
app.delete(
  '/users/:userName',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.userName })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.userName + ' was not found');
        } else {
          res.status(200).send(req.params.userName + ' was deleted');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//allows users to delete movies from their favorites
app.delete(
  '/users/:userName/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.userName },
      {
        $pull: { FavoriteMovies: req.params.MovieID }
      },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("Error: User doesn't exist");
        } else {
          res.json(updatedUser);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//updates a account holders information
app.put(
  '/users/:userName',
  passport.authenticate('jwt', { session: false }),
  [
    // Username should be required and should be minimum 5 characters long
    check(
      'Username',
      'Username is required and has to be minimum five characters long'
    ).isLength({ min: 5 }),
    // Username should be only alphanumeric characters
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    // Password is required
    check('Password', 'Password is required').not().isEmpty(),
    // Email is required and should be valid
    check('Email', 'Email does not appear to be valid').isEmail()
  ],
  (req, res) => {
    let hashPassword = Users.hashPassword(req.body.Password);

    Users.findOneAndUpdate(
      { Username: req.params.userName },
      {
        $set: {
          Username: req.body.Username,
          Password: hashPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("Error: User doesn't exist");
        } else {
          res.json(updatedUser);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//this is a error code to detect errors in the code above.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//if everything functions correctly this message is logged from port 8080 thats listening.
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port.');
});

app.post('/forgot-password', async (req, res) => {
  const { Email } = req.body;
  try {
    //variable to find user by email that forgot password
    const oldUser = await Users.findOne({ Email });
    if (!oldUser) {
      return res.status(400).json({ status: 'User does not exist' });
    }
    //created secret token that users get by email that expires in 5m
    const secret = JWT_SECRET + oldUser.Password;
    const token = jwt.sign({ Email: oldUser.Email, id: oldUser._id }, secret, {
      expiresIn: '5m'
    });

    //link sends from server to users to reset password
    const link = `https://nostalgic-flix.herokuapp.com/reset-password/${oldUser._id}/${token}`;

    //email sending to reset password nodemailer
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nostalgiaflixnoreply@gmail.com',
        pass: 'movrbebnrqeqnsax'
      }
    });

    var mailOptions = {
      from: 'nostalgiaflixnoreply@gmail.com',
      to: req.body.Email,
      subject: 'Password Reset NostalgicFlix',
      text: link
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    //reset password link sent to console
    console.log(link);
    res.send('done');
  } catch (error) {}
});

//once users clicks link, the link will contain id and token.
app.get('/reset-password/:id/:token', async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);

  //searches through users to verify its the right user id in the token generated if not everything ends
  const oldUser = await Users.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: 'This user does not exist' });
  }

  //verifies if the secret is correct if it is then it renders the reset password page.
  const secret = JWT_SECRET + oldUser.Password;
  try {
    //logic to check if user is the same user from the mondoDB collection if not they won't be verified
    const verify = jwt.verify(token, secret);
    res.render('index', { Email: verify.Email, Status: 'Not Verified' });
  } catch (error) {
    res.send('Not verified');
  }

  // updates a users name and password
  app.post('/reset-password/:id/:token', async (req, res) => {
    const { id, token } = req.params;
    // const { password } = req.body;
    let hashPassword = Users.hashPassword(req.body.Password);
    console.log(req.params);

    //searches through users to verify its the right user id in the token generated
    const oldUser = await Users.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: 'This user does not exist' });
    }
    const secret = JWT_SECRET + oldUser.Password;
    try {
      //logic to check if user is the same user from the mondoDB collection if not they won't be verified
      const verify = jwt.verify(token, secret);

      //updates users password and hashes it.
      await Users.updateOne(
        {
          _id: id
        },
        {
          $set: {
            Password: hashPassword
          }
        }
      );
      // res.json({ status: 'Password Updated' });
      res.render('index', { Email: verify.Email, Status: 'Verified' });
    } catch (error) {
      res.json('Something went wrong');
    }
  });
});

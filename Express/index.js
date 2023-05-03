const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const app = express();

let topMovies = [
  {
    title: 'The Girl Next Door',
    year: '2004',
    genre: 'Romance/Comedy',
  },
  {
    title: 'Senseless',
    year: '1998',
    genre: 'Comedy',
  },
  {
    title: 'Superbad',
    year: '2007',
    genre: 'Comedy/Teen',
  },
  {
    title: 'Friday',
    year: '1995',
    genre: 'Comedy/Drama',
  },
  {
    title: 'Kung Fu Hustle',
    year: '2004',
    genre: 'Action/Comedy',
  },
  {
    title: "Love Don't Cost A Thing",
    year: '2003',
    genre: 'Romance/Comedy',
  },
  {
    title: 'Good Burger',
    year: '1997',
    genre: 'Comedy/Family',
  },
  {
    title: 'Without A Paddle',
    year: '2004',
    genre: 'Comedy/Adventure',
  },
  {
    title: 'Fight Club',
    year: '1999',
    genre: 'Thriller/Drama',
  },
  {
    title: 'Spider-Man',
    year: '2002',
    genre: 'Action/Adventure',
  },
];

//combining morgan with the accessLogScream to log users who visit the website.
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a',
});
app.use(morgan('combined', { stream: accessLogStream }));

//automatically sends all files that are requested from within the public folder.
app.use(express.static('public'));

//this setups a message once the user goes to the home page of the website.
app.get('/', (request, response) => {
  response.send('Welcome to my app!');
});

//this setups a message to be on the screen once a user goes to the secreturl directory.
app.get('/secreturl', (request, response) => {
  response.send('This is a secret url with super top-secret content.');
});

//this is a error code to dectect erros in the code above.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//if everything functions correctly this message is logged from port 8080 thats listening.
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

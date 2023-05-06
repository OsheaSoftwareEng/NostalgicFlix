const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');

app.use(bodyParser.json());

let users = [
  {
    id: 1,
    name: 'Bobby Miles',
    savedMovies: [],
  },
  {
    id: 2,
    name: 'Robert Kelly',
    savedMovies: [],
  },
  {
    id: 3,
    name: 'Charles Perry',
    savedMovies: [],
  },
];

let movies = [
  {
    title: 'The Girl Next Door',
    year: 2004,
    genres: {
      name: 'Romance/Comedy',
      description:
        'Eighteen-year-old Matthew Kidman (Emile Hirsch) is a straight-arrow overachiever who has never really lived life... until he falls for his new neighbor, the beautiful and seemingly innocent Danielle (Elisha Cuthbert). When Matthew discovers this perfect girl next door is a one-time porn star, his sheltered existence begins to spin out of control. Ultimately, Danielle helps Matthew emerge from his shell and discover that sometimes you have to risk everything for the person you love.',
    },
    director: {
      name: 'Luke Greenfield',
      born: 'February 5, 1972',
      bio: 'Luke was born in Manhassett, New York and grew up in Westport, Connecticut.He\'s best known for creating films that are unpredictable and surprising to audiences such as his film, "The Girl Next Door."',
    },
  },
  {
    title: 'Senseless',
    year: 1998,
    genres: {
      name: 'Comedy',
      description:
        'Darryl Witherspoon is a young black college student who wants to win annual junior analyst competition, which can land him a job in a big brokerage company. He becomes a guinea pig for the drug developed at the college which is promised to heighten all senses by ten times.',
    },
    director: {
      name: 'Penelope Spheeris',
      born: 'December 2, 1945',
      bio: 'Penelope Spheeris is an American film director, producer, and screenwriter. She has directed both documentary and scripted films.',
    },
  },
  {
    title: 'Superbad',
    year: 2007,
    genres: {
      name: 'Comedy/Teen',
      description:
        'Two inseparable best friends navigate the last weeks of high school and are invited to a gigantic house party. Together with their nerdy friend, they spend a long day trying to score enough alcohol to supply the party and inebriate two girls in order to kick-start their sex lives before they go off to college. Their quest is complicated after one of them falls in with two inept cops who are determined to show him a good time.',
    },
    director: {
      name: 'Greg Mottola',
      born: 'July 11, 1964',
      bio: 'Gregory J. Mottola is an American film director, screenwriter, and television director.',
    },
  },
  {
    title: 'Napoleon Dynamite',
    year: 2004,
    genres: {
      name: 'Comedy/Teen',
      description:
        'In small-town Preston, Idaho, awkward teen Napoleon Dynamite (Jon Heder) has trouble fitting in. After his grandmother is injured in an accident, his life is made even worse when his strangely nostalgic uncle, Rico (Jon Gries), shows up to keep an eye on him. With no safe haven at home or at school, Napoleon befriends the new kid, Pedro (Efren Ramirez), a morose Hispanic boy who speaks little English. Together the two launch a campaign to run for class president.',
    },
    director: {
      name: 'Jared Hess',
      born: 'July 18, 1979',
      bio: 'Jared Lawrence Hess is an American filmmaker known for his work Napoleon Dynamite (2004) and Nacho Libre (2006)',
    },
  },
  {
    title: 'Kung Fu Hustle',
    year: 2004,
    genres: {
      name: 'Action/Comedy',
      description:
        "When the hapless Sing and his dim-witted pal Bone try to scam the residents of Pig Sty Alley into thinking they're members of the dreaded Axe Gang, the real gangsters descend on this Shanghai slum to restore their fearsome reputation. What gang leader Brother Sum doesn't know is that three legendary retired kung fu masters live anonymously in this decrepit neighborhood and don't take kindly to interlopers.",
    },
    director: {
      name: 'Stephen Chow',
      born: 'June 22, 1962',
      bio: 'Stephen Chow Sing-chi is a Hong Kong filmmaker, former actor and comedian, known for Shaolin Soccer and Kung Fu Hustle.',
    },
  },
  {
    title: "Love Don't Cost A Thing",
    year: 2003,
    genres: {
      name: 'Romance/Comedy',
      description:
        "Science nerd Alvin Johnson (Nick Cannon) is proficient at engineering but incompetent when it comes to dating. One day, popular girl Paris Morgan (Christina Milian) appears at the auto shop where he works after school. She has damaged her mother's car and urgently requests repairs. Alvin offers a bribe: He will fix the car immediately in exchange for two weeks of dating. Paris agrees, and Alvin is able to enter the sacred realm of the popular kids. But at what cost to himself?",
    },
    director: {
      name: 'Troy Byer',
      born: 'November 7, 1964',
      bio: 'Troy Byer is an American psychologist, author, director, screenwriter, and actress.',
    },
  },
  {
    title: 'Good Burger',
    year: 1997,
    genres: {
      name: 'Comedy/Family',
      description:
        'When Mondo Burger sets up across the street, sneaky Dexter and burger-obsessed Ed realise they need to fight to keep their fast food joint going. Their new secret sauce might be the answer, but not if Mondo can grab it.',
    },
    director: {
      name: 'Brian Robbins',
      born: 'November 22, 1963',
      bio: 'Brian Levine, known professionally as Brian Robbins, is an American film executive, actor, and filmmaker who is the current president and chief executive officer of Paramount Pictures and Nickelodeon.',
    },
  },
  {
    title: 'Without A Paddle',
    year: 2004,
    genres: {
      name: 'Comedy/Adventure',
      description:
        'After their friend Billy (Anthony Starr) dies, Tom (Dax Shepard), Jerry (Matthew Lillard) and Dan (Seth Green) go on a camping trip to honor his memory. The campsite, however, has special significance. Billy believed famous airplane hijacker D.B. Cooper hid money in the area, and his friends aim to find it. Unfortunately, they are not prepared for the adventure. After falling over a waterfall, they are left to the mercy of wild animals and a harsh wilderness terrain.',
    },
    director: {
      name: 'Steven Brill',
      born: 'May 27, 1962',
      bio: 'Steven Brill is an American actor, film producer, director, and screenwriter. ',
    },
  },
  {
    title: 'Fight Club',
    year: 1999,
    genres: {
      name: 'Thriller/Drama',
      description:
        "A depressed man (Edward Norton) suffering from insomnia meets a strange soap salesman named Tyler Durden (Brad Pitt) and soon finds himself living in his squalid house after his perfect apartment is destroyed. The two bored men form an underground club with strict rules and fight other men who are fed up with their mundane lives. Their perfect partnership frays when Marla (Helena Bonham Carter), a fellow support group crasher, attracts Tyler's attention.",
    },
    director: {
      name: 'David Fincher',
      born: 'August 28, 1962',
      bio: 'David Andrew Leo Fincher is an American film director. His films, mostly psychological thrillers, have received 40 nominations at the Academy Awards, including three for him as Best Director.',
    },
  },
  {
    title: 'Spider-Man',
    year: 2002,
    genres: {
      name: 'Action/Adventure',
      description:
        '"Spider-Man" centers on student Peter Parker (Tobey Maguire) who, after being bitten by a genetically-altered spider, gains superhuman strength and the spider-like ability to cling to any surface. He vows to use his abilities to fight crime, coming to understand the words of his beloved Uncle Ben: "With great power comes great responsibility."',
    },
    director: {
      name: 'Sam Raimi',
      born: 'October 23, 1959',
      bio: 'Samuel M. Raimi is an American filmmaker. He is best known for directing the Spider-Man trilogy (2002–2007) and the Evil Dead franchise (1981–present).',
    },
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
  response.send('Welcome to Nostalgicflix!');
});

//creating a directory to get all data for users
app.get('/users', (request, response) => {
  response.json(users);
});
//getting information about a single user
app.get('/users/:name', (request, response) => {
  response.json(
    users.find((user) => {
      return user.name === request.params.name;
    })
  );
});

//adds data for a new user to our list of users.
app.post('/users', (request, response) => {
  let newUser = request.body;

  if (!newUser.name) {
    const message = 'Name is required';
    response.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    response.status(201).json(newUser);
  }
});
//deletes a user from our list by id
app.delete('/users/:id', (request, response) => {
  let user = users.find((user) => {
    return user.id === request.params.id;
  });

  if (user) {
    users = users.filter((obj) => {
      return obj.id !== request.params.id;
    });
    response.status(201).send('User ' + request.params.id + ' was deleted.');
  } else {
    response.status(404).send("User doesn't exist");
  }
});

//updates a users account
app.post('/user', (request, response) => {
  const usernameUpdate = request.body;

  let user = users.find((user) => {
    return user.id === request.params.id;
  });

  if (user) {
    user.name = usernameUpdate.name;
    response.status(200).json(user);
  } else {
    response.status(400).send('Failed to change username');
  }
});

//creating a directory to grab the movies from the end route /movies
app.get('/movies', (request, response) => {
  response.status(200).json(movies);
});

//grabs the movies by the title
app.get('/movies/:title', (request, response) => {
  const movie = movies.find((movie) => {
    return movie.title === request.params.title;
  });
  if (movie) {
    response.status(200).json(movie);
  } else {
    response.status(404).send('This movie could not be found :(');
  }
});

//get movies by genre
app.get('/movies/genre/:genreName', (request, response) => {
  const genre = movies.find((movie) => {
    return movie.genres.name === request.params.genreName;
  });

  if (genre) {
    response.status(200).json(genre);
  } else {
    response.status(404).send("sorry the genre selected isn't available");
  }
});

//get movies by directors name
app.get('/movies/directors/:directorsName', (request, response) => {
  const director = movies.find((movie) => {
    return movie.director.name === request.params.directorsName;
  });

  if (director) {
    response.status(200).json(director);
  } else {
    response
      .status(404)
      .send('sorry there are no directors with that name in our catalog');
  }
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

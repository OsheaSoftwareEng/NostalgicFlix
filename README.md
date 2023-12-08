# NostalgicFlix API

> This web application implements a RESTful API to perform CRUD operations on many different movies on the application. Users will be able to sign up, update their personal information, and add and remove movies from their favorites. Users will also be able to reset their passwords if forgotten.

Frontend Live Demo: https://nostalgicflix.com

## Key Features

- Return a list of all movies
- Return (description, genre, director, writer, movie cover, movie preview, and movie watch link) about a single movie by title to the user
- Return data about a genre (description and movies) by name (e.g., “Thriller”)
- Allow new users to register
- Allow users to update their user info (username, password, email, date of birth)
- Allow users to add a movie to their list of favorites
- Allow users to remove a movie from their list of favorites
- Allow existing users to delete their account
  -Allows users to reset their passwords

## Built with

- Node.js
- Express
- Mongoose
- MongoDB

## Dependencies

```shell
"dependencies": {
    "bcrypt": "^5.1.0",
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "ejs": "^3.1.9",
    "express": "^4.18.2",
    "express-validator": "^7.0.1",
    "jsonwebtoken": "^9.0.0",
    "lodash": "^4.17.21",
    "mongoose": "^7.1.1",
    "morgan": "^1.10.0",
    "nodemailer": "^6.9.3",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.1",
    "passport-local": "^1.0.0",
    "uuid": "^9.0.0"
  }
```

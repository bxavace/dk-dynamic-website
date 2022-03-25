const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');
const bodyParser = require('body-parser');

const app = express();

// Importing the classes
const FeedbackService = require('./services/FeedbackService');
const SpeakersService = require('./services/SpeakerService');

// Instance
const feedbackService = new FeedbackService('./data/feedback.json');
const speakersService = new SpeakersService('./data/speakers.json');

// Calling the now exported arrow function in index.js
// By requiring the exported function and storing it in a
// Variable to be called as function
// E.g. app.use('/', routes())
const routes = require('./routes');

const PORT = 3000;

// Trust proxy
app.set('trust proxy', 1);

// Cookie-session middleware
app.use(
  cookieSession({
    name: 'session',
    keys: ['Ghdur6875993v', 'hhjaa3441DFVx'],
  })
);

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Template engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.locals.siteName = 'ROUX Meetups';

// Loads static files/images/CSS to be accessed publicly
app.use(express.static(path.join(__dirname, './static')));

// Get the speakernames using the class
app.use(async (req, res, next) => {
  try {
    const names = await speakersService.getNames();
    res.locals.speakerNames = names;
    return next();
  } catch (err) {
    return next(err);
  }
});

// Calling the routes functions
app.use(
  '/',
  routes({
    feedbackService,
    speakersService,
  })
);

// No Route Signal, Throw Error
app.use((req, res, next) => next(createError(404, 'File not found.')));

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  console.error(err);
  const status = err.status || 500;
  res.locals.status = status;
  res.status(status);
  res.render('error');
});

// Start the server at port 3000
app.listen(PORT, () => {
  console.log(`Express server is listening on port ${PORT}...`);
});

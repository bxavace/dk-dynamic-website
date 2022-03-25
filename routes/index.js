const express = require('express');

const speakersRoute = require('./speakers');
const feedbackRoute = require('./feedback');

const router = express.Router();

// Good practice (not commonly found in tutorials)
// Directly exporting the function
module.exports = (params) => {
  const { speakersService } = params;
  router.get('/', async (req, res, next) => {
    // Cookie-session (sample)
    // if (!req.session.visitcount) {
    //   req.session.visitcount = 0;
    // }
    // req.session.visitcount += 1;
    // process.stdout.write(`Number of visits: ${req.session.visitcount}\r`);
    try {
      const topSpeakers = await speakersService.getList();
      const artwork = await speakersService.getAllArtwork(req.params.shortname);
      return res.render('layout', {
        pageTitle: 'Welcome',
        template: 'index',
        topSpeakers,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.use('/speakers', speakersRoute(params));
  router.use('/feedback', feedbackRoute(params));

  return router;
};

// Instead of doing this...
// GET request at root, responds with the index HTML
// router.get('/', (req, res) => {
//   res.render('pages/index', { pageTitle: 'Welcome' });
// });
// module.exports = router;

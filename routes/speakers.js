const express = require('express');

const router = express.Router();

// Good practice (not commonly found in tutorials)
// Directly exporting the function
module.exports = (params) => {
  // Getting the destructured speakersService object in params
  // from index.js and server.js
  const { speakersService } = params;

  router.get('/', async (req, res, next) => {
    try {
      const speakers = await speakersService.getList();
      return res.render('layout', { pageTitle: 'Speakers', template: 'speakers', speakers });
    } catch (err) {
      return next(err);
    }
  });

  router.get('/:shortname', async (req, res, next) => {
    try {
      const speaker = await speakersService.getSpeaker(req.params.shortname);
      const artwork = await speakersService.getArtworkForSpeaker(req.params.shortname);
      return res.render('layout', {
        pageTitle: 'Speakers',
        template: 'speakers-detail',
        speaker,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};

// Instead of doing this...
// GET request at /speakers, responds with the speakers HTML
// app.get('/speakers', (req, res) => {
//     res.sendFile(path.join(__dirname, './static/speakers.html'));
//   });
// module.exports = speakersRoute;

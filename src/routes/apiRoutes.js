const express = require('express');
const apiRouter = express.Router();
const fantayaRouter = require('./fantayaRouter');

const eventsController = require('../controllers/eventsController');
const playersController = require('../controllers/playersController');


apiRouter.get('/players', playersController.getPlayers );
apiRouter.post('/players', playersController.addPlayers );

apiRouter.get('/events/:fixture', eventsController.eventsByFixture );
apiRouter.post('/events', eventsController.saveEvents );


apiRouter.use('/fantaya', fantayaRouter );



// apiRouter.post('/login', adminValidation, usersController.login );

module.exports = apiRouter;

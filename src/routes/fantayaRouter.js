const express = require('express');
const fantayaRouter = express.Router();

const fantayaController = require('../controllers/fantayaController');


fantayaRouter.get('/teams/:active', fantayaController.teams)
fantayaRouter.get('/seasons', fantayaController.getSeasonsWithDetails)
fantayaRouter.get('/fixture/:season', fantayaController.fixtureBySeason)
fantayaRouter.get('/matches/:fixture', fantayaController.matchesByFixture)
fantayaRouter.get('/tarjetas/:team/:fixture', fantayaController.tarjetasByTeam)
fantayaRouter.get('/tarjetas/:fixture', fantayaController.tarjetasByFixture)
fantayaRouter.get('/standings/:season', fantayaController.getStandingsBySeason)


fantayaRouter.post('/teams', fantayaController.updateTeams)
fantayaRouter.post('/duplaTeams', fantayaController.updateDuplas)
fantayaRouter.post('/cardPoints', fantayaController.cardpoints)
fantayaRouter.post('/matchResult', fantayaController.matchResult)
fantayaRouter.post('/matchResultmultiple', fantayaController.matchResultmultiple)
fantayaRouter.post('/seasons', fantayaController.updateSeasons)
fantayaRouter.post('/fixtures', fantayaController.updateFixtures)
fantayaRouter.post('/matches', fantayaController.updateMatches)
fantayaRouter.post('/matchesmultiple', fantayaController.updateMatchesmultiple)
fantayaRouter.post('/squads/:division', fantayaController.saveSquads)
fantayaRouter.post('/standings', fantayaController.saveRankings)

// fantayaRouter.get('/test', fantayaController.test)

module.exports = fantayaRouter;

const db = require('../database/models');
const { assignLineups } = require('../helpers/dataManipulation');
const { Op } = require('sequelize');
const { isAfter, sortByDateAscending } = require('../helpers/dateHelper');
const moment = require('moment');

const fantayaController = {

    //// api/fantaya/tarjetas/:team/:fixture
    tarjetasByTeam: async (req, res) =>{
        try {        
        
            const teamFilter = {idTeam: req.params.team}
            const fixtureFilter = {idFixture: req.params.fixture}

            const teamInfo = await db.Cardpoint.findAll({
                where: {...teamFilter,...fixtureFilter},
                include: [
                    {model: db.Playerevent, as: 'details', 
                    where:fixtureFilter,
                    required: false  // This makes it a LEFT OUTER JOIN, so null if no associated records
                    },
                    {model: db.Player, as: 'player'},
                ]
            })
            
            

            res.status(200).json({
                meta:{
    
                    status:'success',
                },
                data: teamInfo,
                // userInfo
                })




        } catch (error) {
            
            console.log(error);
            res.status(500).json({
            meta:{
                status:'error',
            },
            errorMsg: error.message,
            error
            })

        }



    },
    
    //// api/fantaya/fixture/:season
    fixtureBySeason: async (req, res) =>{
        try {
        
            const seasonFilter = {idSeason: req.params.season}

            const fixtureInfo = await db.Fixture.findAll({
                where: seasonFilter
            })

            res.status(200).json({
                meta:{
    
                    status:'success',
                },
                data: fixtureInfo,
                // userInfo
                })




        } catch (error) {
            
            console.log(error);
            res.status(500).json({
            meta:{
                status:'error',
            },
            errorMsg: error.message,
            error
            })

        }



    },

    //// api/fantaya/matches/:fixture
    matchesByFixture: async (req, res) =>{
        try {
        
            const fixtureFilter = req.params.fixture? {} : {idFixture: req.params.fixture}

            const matchesInfo = await db.Match.findAll({
                where: fixtureFilter,
                include: [
                    {model: db.Fixture, as: 'fixture'},
                    {model: db.Team, as: 'teamHome'},
                    {model: db.Team, as: 'teamAway'},
                ]
            })
            const matchesmultipleInfo = await db.Matchmultiple.findAll({
                where: fixtureFilter,
                include: [
                    {model: db.Fixture, as: 'fixture'},
                    {model: db.Team, as: 'team'},
                    {model: db.Team, as: 'teamWinner'},
                ]
            })

            res.status(200).json({
                meta:{
    
                    status:'success',
                },
                data: {
                    single: matchesInfo,
                    multiple:matchesmultipleInfo
                },
                // userInfo
                })




        } catch (error) {
            
            console.log(error);
            res.status(500).json({
            meta:{
                status:'error',
            },
            errorMsg: error.message,
            error
            })

        }

    },

    //// api/fantaya/fixture/teams/:active (get)
    teams: async (req, res) =>{
        try {
        
            const activeFilter = req.params.active==1 ? {active: true} : {}

            const teamsInfo = await db.Team.findAll({
                where: activeFilter,
            })

            const duplasInfo = await db.Dupla.findAll()

            const modTeams = teamsInfo.map(i=>{
                let team = i.dataValues

                const isDupla = duplasInfo.find(dupla=> dupla.idTeam === team.id)
                
                if(isDupla){
                    
                    team['dupla'] = {
                        idTeamA: isDupla.idTeamA,
                        teamA: teamsInfo.find(t=> t.id == isDupla.idTeamA).dataValues.name,
                        idTeamB: isDupla.idTeamB,
                        teamB: teamsInfo.find(t=> t.id == isDupla.idTeamB).dataValues.name,
                    }

                }
                return team
            })


            res.status(200).json({
                meta:{
    
                    status:'success',
                },
                data: modTeams,
                // userInfo
                })




        } catch (error) {
            
            console.log(error);
            res.status(500).json({
            meta:{
                status:'error',
            },
            errorMsg: error.message,
            error
            })

        }

    },

    //// api/fantaya/fixture/teams (post)
    updateTeams: async (req, res) =>{
        try{

            const fields_teams = [
                'name', 'active','division','grupo',
                'createdAt', 'updatedAt'
            ]
            const newTeams = req.body.teams

            const updatedTeams = await db.Team.bulkCreate(
                newTeams, 
                { updateOnDuplicate: fields_teams }
            )

            res.status(200).json({
                meta:{

                    status:'success',
                },
                data: updatedTeams,
                })




        } catch (error) {
            
            console.log(error);
            res.status(500).json({
            meta:{
                status:'error',
            },
            errorMsg: error.message,
            error
            })

        }

    },

    //// api/fantaya/fixture/duplaTeams (post)
    updateDuplas: async (req, res) =>{
        try{

            const fields_tduplas = [
                'idTeam', 'idTeamA','idTeamB'
            ]
            const newDuplas = req.body.duplas

            const updatedDuplas = await db.Dupla.bulkCreate(
                newDuplas, 
                { updateOnDuplicate: fields_tduplas }
            )

            res.status(200).json({
                meta:{

                    status:'success',
                },
                data: updatedDuplas,
                })




        } catch (error) {
            
            console.log(error);
            res.status(500).json({
            meta:{
                status:'error',
            },
            errorMsg: error.message,
            error
            })

        }

    },

    //// api/fantaya/cardpoints
    cardpoints : async (req,res)=>{
        try {
            const fields_cPoints = [
                'eventsFantapoints',
                'defensorDesignado', 'ddPoints',
                'captain', 'captainPoints',
                'lineup',
                'totalFantapoints',
                'updatedAt'
            ]

            const data = req.body.cPoints

            const cardDataToSave = data.map(p=> {
                delete p.details
                delete p.player
                return p
            })
            
            const playerfPoints = await db.Cardpoint.bulkCreate(
                cardDataToSave, 
                  { updateOnDuplicate: fields_cPoints }
              )


            res.status(200).json({
                meta:{
    
                    status:'success',
                },
                data: playerfPoints,
                })




        } catch (error) {
            
            console.log(error);
            res.status(500).json({
            meta:{
                status:'error',
            },
            errorMsg: error.message,
            error
            })

        }
    },

    //// api/fantaya/matchResult
    matchResult : async (req,res)=>{
        try {
            const fields_match = [
                'winner',
                'homeScore',
                'awayScore',
                'updatedAt'
            ]
            const fields_standings = [
                'result',
                'scored',
                'received',
                'bonus',
                'bonusPoints',
                'points',
                'totalPoints',
                'updatedAt'
            ]

            const data = req.body.matchResult

            const matches = await db.Match.findAll()

            const modData = data.map(m=>{

                const matchID = matches.find(mDB => mDB.idFixture== m.idFixture && mDB.idTeamHome === m.idTeamHome && mDB.idTeamAway === m.idTeamAway)

                if(!matchID){
                    res.status(500).json({
                        meta:{
                            status:'error',
                        },
                        errorMsg: 'Match ID not found',
                        error: `Combination of fixture:${m.idFixture}, home team: ${m.idTeamHome} and away team: ${m.idTeamAway} is not found in DB`
                        })
                }
                m.id = matchID.id

                return m

            })       


            const matchResult = await db.Match.bulkCreate(
                modData, 
                { updateOnDuplicate: fields_match }
            )



            const teamsInMatches = [...modData.map(m => m.idTeamHome), ...modData.map(m => m.idTeamAway)]
            const fixture = modData[0].idFixture 

            const fixtureInfo = await db.Fixture.findOne({
                where: {id:fixture},required:true,
                include:[
                    {model:db.Season, as:'season', attributes:['type']}
                ]
            })

            const duplasInfo = await db.Dupla.findAll({
                where: { idTeam:teamsInMatches}
            })


            const newStandings = data.map(m => {
                let standingH
                let standingA
                if(fixtureInfo.season.type === 'Playoff'){

                    standingH = {
                        idFixture: m.idFixture,
                        idTeam: m.idTeamHome,                
                        result: m.winner==='home' ? 'W' : m.winner==='tie' ? 'D' : 'L',
                        scored: m.homeScore,
                        received: m.awayScore,
                        bonus: m.homeScore>=45 || m.homeScore<0 ? true : false,
                        bonusPoints: m.homeScore>=45 ? 1 : m.homeScore<0 ? -1 : 0,
                        points: m.homeScore > m.awayScore ? 2 : m.homeScore === m.awayScore ? 1 : 0,
                    }
    
                    standingH.totalPoints = Number(standingH.points) + Number(standingH.bonusPoints)
                    
                    standingA = {
                        idFixture: m.idFixture,
                        idTeam: m.idTeamAway,                
                        result: m.winner==='away' ? 'W' : m.winner==='tie' ? 'D' : 'L',
                        scored: m.awayScore,
                        received: m.homeScore,
                        bonus: m.awayScore>=45 || m.awayScore<0 ? true : false,
                        bonusPoints: m.awayScore>=45 ? 1 : m.awayScore<0 ? -1 : 0,
                        points: m.awayScore > m.homeScore ? 2 : m.awayScore === m.homeScore ? 1 : 0,
                    }
    
                    standingA.totalPoints = Number(standingA.points) + Number(standingA.bonusPoints)
                    
                    return [standingH, standingA]
                }else{
                        
                        const isDuplaH = duplasInfo.find(dupla => dupla.dataValues.idTeam === m.idTeamHome)
                        const isDuplaA = duplasInfo.find(dupla => dupla.dataValues.idTeam === m.idTeamAway)
                        
                        if(isDuplaH && isDuplaA){
                            
                            const stH1 = {
                                idFixture: m.idFixture,
                                idTeam: isDuplaH.dataValues.idTeamA,                
                                result: m.winner==='home' ? 'W' : m.winner==='tie' ? 'D' : 'L',
                                scored: m.homeScore,
                                received: m.awayScore,
                                bonus: m.homeScore>=45 || m.homeScore<0 ? true : false,
                                bonusPoints: m.homeScore>=45 ? 1 : m.homeScore<0 ? -1 : 0,
                                points: m.homeScore > m.awayScore ? 2 : m.homeScore === m.awayScore ? 1 : 0,
                            }
                            console.log(stH1);
                            
                            stH1.totalPoints = Number(stH1.points) + Number(stH1.bonusPoints)

                            const stH2 = {
                                idFixture: m.idFixture,
                                idTeam: isDuplaH.dataValues.idTeamB,                
                                result: m.winner==='home' ? 'W' : m.winner==='tie' ? 'D' : 'L',
                                scored: m.homeScore,
                                received: m.awayScore,
                                bonus: m.homeScore>=45 || m.homeScore<0 ? true : false,
                                bonusPoints: m.homeScore>=45 ? 1 : m.homeScore<0 ? -1 : 0,
                                points: m.homeScore > m.awayScore ? 2 : m.homeScore === m.awayScore ? 1 : 0,
                            }
                            stH2.totalPoints = Number(stH2.points) + Number(stH2.bonusPoints)

                            const stA1 = {
                                idFixture: m.idFixture,
                                idTeam: isDuplaA.dataValues.idTeamA,                
                                result: m.winner==='away' ? 'W' : m.winner==='tie' ? 'D' : 'L',
                                scored: m.awayScore,
                                received: m.homeScore,
                                bonus: m.awayScore>=45 || m.awayScore<0 ? true : false,
                                bonusPoints: m.awayScore>=45 ? 1 : m.awayScore<0 ? -1 : 0,
                                points: m.awayScore > m.homeScore ? 2 : m.homeScore === m.awayScore ? 1 : 0,
                            }
                            stA1.totalPoints = Number(stA1.points) + Number(stA1.bonusPoints)

                            const stA2 = {
                                idFixture: m.idFixture,
                                idTeam: isDuplaA.dataValues.idTeamB,                
                                result: m.winner==='away' ? 'W' : m.winner==='tie' ? 'D' : 'L',
                                scored: m.awayScore,
                                received: m.homeScore,
                                bonus: m.awayScore>=45 || m.awayScore<0 ? true : false,
                                bonusPoints: m.awayScore>=45 ? 1 : m.awayScore<0 ? -1 : 0,
                                points: m.awayScore > m.homeScore ? 2 : m.homeScore === m.awayScore ? 1 : 0,
                            }
                            stA2.totalPoints = Number(stA2.points) + Number(stA2.bonusPoints)


                            return [stH1, stH2, stA1, stA2]
                        
                        }else{
                            
                            standingH = {
                                idFixture: m.idFixture,
                                idTeam: m.idTeamHome,                
                                result: m.winner==='home' ? 'W' : m.winner==='tie' ? 'D' : 'L',
                                scored: m.homeScore,
                                received: m.awayScore,
                                bonus: m.homeScore>=45 || m.homeScore<0 ? true : false,
                                bonusPoints: m.homeScore>=45 ? 1 : m.homeScore<0 ? -1 : 0,
                                points: m.homeScore > m.awayScore ? 2 : m.homeScore === m.awayScore ? 1 : 0,
                            }
            
                            standingH.totalPoints = Number(standingH.points) + Number(standingH.bonusPoints)
                            
                            standingA = {
                                idFixture: m.idFixture,
                                idTeam: m.idTeamAway,                
                                result: m.winner==='away' ? 'W' : m.winner==='tie' ? 'D' : 'L',
                                scored: m.awayScore,
                                received: m.homeScore,
                                bonus: m.awayScore>=45 || m.awayScore<0 ? true : false,
                                bonusPoints: m.awayScore>=45 ? 1 : m.awayScore<0 ? -1 : 0,
                                points: m.awayScore > m.homeScore ? 2 : m.awayScore === m.homeScore ? 1 : 0,
                            }
            
                            standingA.totalPoints = Number(standingA.points) + Number(standingA.bonusPoints)
                         
                            return [standingH, standingA]
                        }

                    
                }                

                
            }).flat()

            const updatedStandings = await db.Standing.bulkCreate(
                newStandings,
                {updateOnDuplicate: fields_standings }
            )





            res.status(200).json({
                meta:{
    
                    status:'success',
                },
                data: matchResult,
                })




        } catch (error) {
            console.log(error);
            
            res.status(500).json({
            meta:{
                status:'error',
            },
            errorMsg: error.message,
            error
            })

        }
    },

    //// api/fantaya/matchResultmultiple
    matchResultmultiple : async (req,res)=>{
        try {
            const fields_match = [
                'winner',
                'score',
                'updatedAt'
            ]
            const fields_standings = [
                'result',
                'scored',
                'updatedAt'
            ]

            const data = req.body.matchResult
            const fixture = data[0].idFixture

            const matches = await db.Matchmultiple.findAll({
                where: { idFixture: fixture},
                order: [['score', 'DESC']]
            })

            let modData = data.map(m=>{

                const matchID = matches.find(mDB => mDB.idFixture== m.idFixture && mDB.idTeam === m.idTeam)

                if(!matchID){
                    res.status(500).json({
                        meta:{
                            status:'error',
                        },
                        errorMsg: 'Match ID not found',
                        error: `Combination of fixture:${m.idFixture}, home team: ${m.idTeam} is not found in DB`
                        })
                }
                m.match = matchID.match

                return m

            })

            const matchInFixture = modData[0].match
       


            const highestSaved = matches.filter(team => team.dataValues.match === matchInFixture)[0]

            console.log(highestSaved);
            
            
            highestSaved.winner = highestSaved.score >= modData[0].score && highestSaved.score >= (modData.length===2? modData[1].score:-1000 ) ? true : false
            modData[0].winner = modData[0].score >= highestSaved.score && modData[0].score >= (modData.length===2? modData[1].score : -1000 ) ? true : false
            
            if(modData.length===2){
                
                modData[1].winner = modData[1].score >= highestSaved.score && modData[1].score >= modData[0].score ? true : false
        
            }
            
            if(highestSaved.idTeam !== modData[0].idTeam && highestSaved.idTeam !== (modData.length===2? modData[1].idTeam : false) ){

                modData = [...modData,{idFixture: highestSaved.idFixture, idTeam:highestSaved.idTeam, score:highestSaved.score, match:highestSaved.match, winner:highestSaved.winner}]
            }
            

            const matchResult = await db.Matchmultiple.bulkCreate(
                modData, 
                { updateOnDuplicate: fields_match }
            )

            const newStandings = modData.map(m => {

                standing = {
                    idFixture: m.idFixture,
                    idTeam: m.idTeam,                
                    result: m.winner ? 'W' : 'L',
                    scored: m.score,
                }
    
                return standing

                
            })

            const updatedStandings = await db.Standing.bulkCreate(
                newStandings,
                {updateOnDuplicate: fields_standings }
            )





            res.status(200).json({
                meta:{
    
                    status:'success',
                },
                data: matchResult,
                })




        } catch (error) {
            console.log(error);
            
            res.status(500).json({
            meta:{
                status:'error',
            },
            errorMsg: error.message,
            error
            })

        }
    },

    //// api/fantaya/seasons (get)
    getSeasonsWithDetails : async (req,res) => {

        try {

            const seasonsInfo = await db.Season.findAll({
                include:{
                    model: db.Fixture, as: 'fixture',
                    include: [
                        {model: db.Match, as: 'matches', required:false,
                        include: [
                            {model: db.Team, as: 'teamHome'},
                            {model: db.Team, as: 'teamAway'}
                        ]
                        },
                        {model: db.Matchmultiple, as: 'matchesmultiple', required:false,
                            include: [
                                {model: db.Team, as: 'team'}
                            ]
                        },
                    ]
                }
            })
           

            
            res.status(200).json({
                meta:{
    
                    status:'success',
                },
                data: seasonsInfo,
                })




        } catch (error) {
            
            console.log(error);
            res.status(500).json({
            meta:{
                status:'error',
            },
            errorMsg: error.message,
            error
            })

        }







    },

    //// api/fantaya/seasons (post)
    updateSeasons : async (req, res) =>{
        try{

            const fields_seasons = [
                'name', 'type', 'active',
                'startDate', 'endDate'
            ]
            const newSeasons = req.body.seasons

            delete newSeasons.fixture

            const updatedSeasons = await db.Season.bulkCreate(
                newSeasons, 
                { updateOnDuplicate: fields_seasons }
            )

            const seasonsInfo = await db.Season.findAll({
                include:{
                    model: db.Fixture, as: 'fixture',
                    include: [
                        {model: db.Match, as: 'matches', required:false,
                        include: [
                            {model: db.Team, as: 'teamHome'},
                            {model: db.Team, as: 'teamAway'}
                        ]
                        },
                        {model: db.Matchmultiple, as: 'matchesmultiple', required:false,
                            include: [
                                {model: db.Team, as: 'team'},
                                {model: db.Team, as: 'winnerTeam'}
                            ]
                        },
                    ]
                }
            })



            res.status(200).json({
                meta:{

                    status:'success',
                },
                data: seasonsInfo,
                })




        } catch (error) {
            
            console.log(error);
            res.status(500).json({
            meta:{
                status:'error',
            },
            errorMsg: error.message,
            error
            })

        }
    },

    //// api/fantaya/fixtures (post)
    updateFixtures : async (req, res) =>{
        try{

            const fields_fixture = [
                'name', 'type', 'active',
                'startDate', 'endDate'
            ]
            const newFixtures = req.body.fixtures

            delete newFixtures.matches

            const updatedFixtures = await db.Fixture.bulkCreate(
                newFixtures, 
                { updateOnDuplicate: fields_fixture }
            )


            const seasonsInfo = await db.Season.findAll({
                include:{
                    model: db.Fixture, as: 'fixture',
                    include: [
                        {model: db.Match, as: 'matches', required:false,
                        include: [
                            {model: db.Team, as: 'teamHome'},
                            {model: db.Team, as: 'teamAway'}
                        ]
                        },
                        {model: db.Matchmultiple, as: 'matchesmultiple', required:false,
                            include: [
                                {model: db.Team, as: 'team'},
                                {model: db.Team, as: 'winnerTeam'}
                            ]
                        },
                    ]
                }
            })



            res.status(200).json({
                meta:{

                    status:'success',
                },
                data: seasonsInfo,
                })




        } catch (error) {
            
            console.log(error);
            res.status(500).json({
            meta:{
                status:'error',
            },
            errorMsg: error.message,
            error
            })

        }
    },

    //// api/fantaya/matches (post)
    updateMatches : async (req, res) =>{
        // creates matches for that fixture (matches)
        // creates default lineups (cardpoints)
        // creates default standing (standings)
        try{
            // console.log(req.body.matches);
            
            const fields_match = [
                'winner'
            ]

            const newMatches = req.body.matches


            const teamsInMatches = [...newMatches.map(m => m.idTeamHome), ...newMatches.map(m => m.idTeamAway)]
            

            const updatedMatches = await db.Match.bulkCreate(
                newMatches, 
                { updateOnDuplicate: fields_match }
            )

            const fixture = newMatches[0].idFixture     

            
            const fixtureInfo = await db.Fixture.findOne({
                where: {id:fixture},required:true,
                include:[
                    {model:db.Season, as:'season', attributes:['type']}
                ]
            })
            

            const duplasInfo = await db.Dupla.findAll({
                where: { idTeam:teamsInMatches}
            })


            
            
            ///// creates cardpoints info (tarjetas)
            const latestFixtures = await db.Cardpoint.findAll({
                where: { id_team: teamsInMatches },
                order: [["created_at", "DESC"]],
              })

              
        
        
            let teamsToDefault = []
            let lineupsToReplicate = []
            teamsInMatches.forEach(team=>{
                const lastFixtureLineup = latestFixtures.filter(f=>f.idTeam === team)
                if (!lastFixtureLineup.length) {
                    // No records found for team in newMatches
                    // Creates default lineup: 4-3-3, with no DD or captain based on team's squad
                    teamsToDefault.push(team)
                }else{

                    const lineup = lastFixtureLineup.map(player=>{

                        return{
                            idFixture: fixture,
                            idPlayer: player.idPlayer,
                            idTeam: player.idTeam,
                            eventsFantapoints: '',
                            defensorDesignado: player.defensorDesignado,
                            ddPoints: '',
                            captain: player.captain,
                            captainPoints: '',
                            lineup: player.lineup,
                            totalFantapoints:''
                        }

                    })

                    lineupsToReplicate.push(lineup)
                }

              })

              let defaultLineups = []
              if(teamsToDefault.length){
                  const squads = await db.Squad.findAll({
                    where: { id_team: teamsToDefault },
                    include: [{model:db.Player,as:'player',attributes:['position']}]
                  })
                  
                  defaultLineups = assignLineups(teamsToDefault,squads, fixture)
              }


              const newLineups = [...defaultLineups, ...lineupsToReplicate].flat()
              
              
              const cardInfo = await db.Cardpoint.bulkCreate(
                newLineups,
                {updateOnDuplicate:['updatedAt']})
            
            

            let newStandings = []

            
            if(fixtureInfo.season.type === 'Playoff'){

                teamsInMatches.forEach(team=> {
                    newStandings.push({idFixture:fixture,idTeam:team})
                })
            }else{
                

                teamsInMatches.forEach(team=> {
                    
                    const isDupla = duplasInfo.find(dupla => dupla.dataValues.idTeam === team)
                    // console.log(duplasInfo[0].dataValues.id, isDupla, team);
                

                    if(isDupla){
                        
                        newStandings.push({idFixture:fixture,idTeam:isDupla.dataValues.idTeamA},{idFixture:fixture,idTeam:isDupla.dataValues.idTeamB})
                    }else{
                        newStandings.push({idFixture:fixture,idTeam:team})
                    }
                })
            }


            
            const standings = await db.Standing.bulkCreate(
                newStandings,
                {updateOnDuplicate: ['result', 'scored', 'received', 'bonus', 'bonusPoints', 'points', 'totalPoints', 'ranking', 'createdAt', 'updatedAt']}
            )


            res.status(200).json({
                meta:{

                    status:'success',
                },
                data: standings,
                })




        } catch (error) {
            
            console.log(error);
            res.status(500).json({
            meta:{
                status:'error',
            },
            errorMsg: error.message,
            error
            })

        }
    },

    //// api/fantaya/matchesmultiple (post)
    updateMatchesmultiple : async (req, res) =>{
        // creates matches for that fixture (matches)
        // creates default lineups (cardpoints)
        // creates default standing (standings)
        try{
            // console.log(req.body.matches);
            
            const fields_match = [
                'id_winner'
            ]

            const newMatches = req.body.matches


            const teamsInMatches = newMatches.map(m => m.idTeam)
            

            const updatedMatches = await db.Matchmultiple.bulkCreate(
                newMatches, 
                { updateOnDuplicate: fields_match }
            )

            const fixture = newMatches[0].idFixture     

            
            const fixtureInfo = await db.Fixture.findOne({
                where: {id:fixture},required:true,
                include:[
                    {model:db.Season, as:'season', attributes:['type']}
                ]
            })
            

            const duplasInfo = await db.Dupla.findAll({
                where: { idTeam:teamsInMatches}
            })


            
            
            ///// creates cardpoints info (tarjetas)
            const latestFixtures = await db.Cardpoint.findAll({
                where: { id_team: teamsInMatches },
                order: [["created_at", "DESC"]],
              })

              
        
        
            let teamsToDefault = []
            let lineupsToReplicate = []
            teamsInMatches.forEach(team=>{
                const lastFixtureLineup = latestFixtures.filter(f=>f.idTeam === team)
                if (!lastFixtureLineup.length) {
                    // No records found for team in newMatches
                    // Creates default lineup: 4-3-3, with no DD or captain based on team's squad
                    teamsToDefault.push(team)
                }else{

                    const lineup = lastFixtureLineup.map(player=>{

                        return{
                            idFixture: fixture,
                            idPlayer: player.idPlayer,
                            idTeam: player.idTeam,
                            eventsFantapoints: '',
                            defensorDesignado: player.defensorDesignado,
                            ddPoints: '',
                            captain: player.captain,
                            captainPoints: '',
                            lineup: player.lineup,
                            totalFantapoints:''
                        }

                    })

                    lineupsToReplicate.push(lineup)
                }

              })

              let defaultLineups = []
              if(teamsToDefault.length){
                  const squads = await db.Squad.findAll({
                    where: { id_team: teamsToDefault },
                    include: [{model:db.Player,as:'player',attributes:['position']}]
                  })
                  
                  defaultLineups = assignLineups(teamsToDefault,squads, fixture)
              }


              const newLineups = [...defaultLineups, ...lineupsToReplicate].flat()
              
              
              const cardInfo = await db.Cardpoint.bulkCreate(
                newLineups,
                {updateOnDuplicate:['updatedAt']})
            
            

            let newStandings = []
            
            if(fixtureInfo.season.type === 'Playoff'){

                teamsInMatches.forEach(team=> {
                    newStandings.push({idFixture:fixture,idTeam:team})
                })
            }else{
                

                teamsInMatches.forEach(team=> {
                    
                    const isDupla = duplasInfo.find(dupla => dupla.dataValues.idTeam === team)
                    // console.log(duplasInfo[0].dataValues.id, isDupla, team);
                

                    if(isDupla){
                        
                        newStandings.push({idFixture:fixture,idTeam:isDupla.dataValues.idTeamA},{idFixture:fixture,idTeam:isDupla.dataValues.idTeamB})
                    }else{
                        newStandings.push({idFixture:fixture,idTeam:team})
                    }
                })
            }


            
            const standings = await db.Standing.bulkCreate(
                newStandings,
                {updateOnDuplicate: ['result', 'scored', 'received', 'bonus', 'bonusPoints', 'points', 'totalPoints', 'ranking', 'createdAt', 'updatedAt']}
            )


            res.status(200).json({
                meta:{

                    status:'success',
                },
                data: standings,
                })




        } catch (error) {
            
            console.log(error);
            res.status(500).json({
            meta:{
                status:'error',
            },
            errorMsg: error.message,
            error
            })

        }
    },



    //// api/fantaya/tarjetas/:fixture
    tarjetasByFixture: async (req, res) =>{
        try {
            
            const fixtureFilter = {idFixture: req.params.fixture}

            const data = await db.Match.findAll({
                where: fixtureFilter,
                include:[
                    {model: db.Team, as:'teamHome',
                        include:[
                            {model: db.Cardpoint, as:'cardpoint', where:fixtureFilter,
                                include:[
                                    {model: db.Playerevent, as:'details', where:fixtureFilter, required:false},
                                    {model:db.Player, as:'player'}
                                ]}
                        ]
                    },
                    {model: db.Team, as:'teamAway',
                        include:[
                            {model: db.Cardpoint, as:'cardpoint', where:fixtureFilter,
                                include:[
                                    {model: db.Playerevent, as:'details', where:fixtureFilter, required:false},
                                    {model:db.Player, as:'player'}
                                ]}
                        ]
                    }
                ]
            })

            const datamultiple = await db.Matchmultiple.findAll({
                where: fixtureFilter,
                include:[
                    {model: db.Team, as:'team',
                        include:[
                            {model: db.Cardpoint, as:'cardpoint', where:fixtureFilter,
                                include:[
                                    {model: db.Playerevent, as:'details', where:fixtureFilter, required:false},
                                    {model:db.Player, as:'player'}
                                ]}
                        ]
                    }
                ]
            })
            
            

            res.status(200).json({
                meta:{
    
                    status:'success',
                },
                data: {
                    single:data.length ? data : null,
                    multiple:datamultiple.length ? datamultiple : null
                },
                // userInfo
                })




        } catch (error) {
            
            console.log(error);
            res.status(500).json({
            meta:{
                status:'error',
            },
            errorMsg: error.message,
            error
            })

        }



    },

    //// api/fantaya/squads/:division (post)
    saveSquads: async (req, res) =>{
        try {
            const divisionFilter = {division: req.params.division}
            
            const squadsInDivision = await db.Squad.findAll({
                attributes: ['idPlayer','idTeam'],
                include:[
                    {model:db.Team, as:'team', 
                        where: divisionFilter, required:true,
                        attributes:[]
                    }
                ]
            })     
            
            
            
            const squadsToUpdate = req.body.squads
            
            const existingIds = squadsInDivision.map(squad => squad.idPlayer);


            const toInsert = [];
            const toUpdate = [];
            const toDelete = [];
            
            squadsToUpdate.forEach(record => {
                if(!existingIds.includes(record.idPlayer) && record.idTeam === ''){                    
                    // if idPlayer is not in the database AND idTeam is '', we should not do anything with them
                    return
                }else if (!existingIds.includes(record.idPlayer) && record.idTeam !== '') {
                    // If idPlayer is not in the database, it’s an insert
                    toInsert.push(record);
                } else if (existingIds.includes(record.idPlayer) && record.idTeam === '') {
                    // If idPlayer exists but idTeam is '', it’s a delete
                    toDelete.push(record.idPlayer);
                } else {
                    // If idPlayer exists and idTeam has a value, it’s an update
                    toUpdate.push(record);
                }
            });
            


            
            // Step 2: Perform Deletions
            if (toDelete.length > 0) {
                await db.Squad.destroy({
                    where: { idPlayer: toDelete }
                });
            }
    
        
            // Step 4: Perform Inserts
            
            if (toInsert.length > 0) {
                await db.Squad.bulkCreate(
                    [...toInsert,...toUpdate],
                    { updateOnDuplicate: ['idPlayer', 'idTeam', 'status'] }
                    )
            }
        
            const allNewPlayers = await db.Player.findAll({
                include: [
                  {
                    model: db.Squad, as: 'squads', 
                    required: false, // This makes it a LEFT OUTER JOIN, so null if no associated records
                    include: [ {model:db.Team, as: 'team', attributes: ['id','name', 'division'] } ] 
                  }
                ]
              })
        

            res.status(200).json({
                meta:{
    
                    status:'success',
                },
                data: allNewPlayers,
                // userInfo
                })




        } catch (error) {
            
            console.log(error);
            res.status(500).json({
            meta:{
                status:'error',
            },
            errorMsg: error.message,
            error
            })

        }



    },

    //// api/fantaya/standings/:season (get)
    getStandingsBySeason: async (req, res) =>{
        try {
            const season = req.params.season
            
            const seasonsInfo = await db.Season.findAll({
                where:{id:season}
            })

            const standingsByTeamInfo = await db.Team.findAll({
                include:[
                    {   model: db.Standing, as: 'standings',
                        required:true,
                        include: {
                            model: db.Fixture, as: 'fixture',
                            where: {idSeason: season}, required: true,
                            include: [
                                {
                                    model: db.Match, as: 'matches',
                                    include:[
                                        {model: db.Team, as:'teamHome', attributes:['name','id'], include:[
                                            {model:db.Dupla,as:'dupla'}
                                        ]},
                                        {model: db.Team, as:'teamAway', attributes:['name','id'], include:[
                                            {model:db.Dupla,as:'dupla'}
                                        ]}
                                    ]                              
                                }
                            ]
                        }
                    }
                ]
            })
           
            
            
            const standingsByTeam = standingsByTeamInfo.map(t => {
                
                const teamStanding ={
                    id: t.id,
                    name: t.name,
                    division:t.division,
                    grupo:t.grupo,
                    standings: t.standings.map(s=>{
                        const matchInFixture_Single = s.fixture.matches.find(m=> m.idTeamHome===t.id||m.idTeamAway===t.id)
                        const matchInFixture_DuplasHomeA = s.fixture.matches.find(m=> m.teamHome.dupla?.find(d=> d.idTeamA===t.id) || '')                            
                        const matchInFixture_DuplasHomeB = s.fixture.matches.find(m=> m.teamHome.dupla?.find(d=> d.idTeamB===t.id) || '')                            
                        const matchInFixture_DuplasAwayA = s.fixture.matches.find(m=> m.teamAway.dupla?.find(d=> d.idTeamA===t.id) || '')                            
                        const matchInFixture_DuplasAwayB = s.fixture.matches.find(m=> m.teamAway.dupla?.find(d=> d.idTeamB===t.id) || '')                            

                        let matchInfo
                        if(matchInFixture_Single){
                            matchInfo = {
                                teamHome: matchInFixture_Single.teamHome.name,
                                teamHomeID: matchInFixture_Single.teamHome.id,
                                teamAway: matchInFixture_Single.teamAway.name,
                                teamAwayID: matchInFixture_Single.teamAway.id,
                                
                            }
                        }else if(matchInFixture_DuplasHomeA || matchInFixture_DuplasHomeB){
 
                            matchInfo = {
                                teamHome: matchInFixture_DuplasHomeA?.dataValues.teamHome.name || matchInFixture_DuplasHomeB.dataValues.teamHome.name,
                                teamHomeID: matchInFixture_DuplasHomeA?.dataValues.teamHome.id || matchInFixture_DuplasHomeB.dataValues.teamHome.id,
                                teamAway: matchInFixture_DuplasHomeA?.dataValues.teamAway.name || matchInFixture_DuplasHomeB.dataValues.teamAway.name,
                                teamAwayID: matchInFixture_DuplasHomeA?.dataValues.teamAway.id || matchInFixture_DuplasHomeB.dataValues.teamAway.id,
                            }    
                        }else if(matchInFixture_DuplasAwayA || matchInFixture_DuplasAwayB){
                            
                            
                            matchInfo = {
                                teamHome: matchInFixture_DuplasAwayA?.dataValues.teamHome.name || matchInFixture_DuplasAwayB.dataValues.teamHome.name ,
                                teamHomeID: matchInFixture_DuplasAwayA?.dataValues.teamHome.id || matchInFixture_DuplasAwayB.dataValues.teamHome.id,
                                teamAway: matchInFixture_DuplasAwayA?.dataValues.teamAway.name || matchInFixture_DuplasAwayB.dataValues.teamAway.name,
                                teamAwayID: matchInFixture_DuplasAwayA?.dataValues.teamAway.id || matchInFixture_DuplasAwayB.dataValues.teamAway.id,
                            }    



                        }
 


                        return{
                            idTeam: s.idTeam,
                            idFixture: s.idFixture,
                            fixtureFantaya: s.fixture.fantayaFecha,
                            result: s.result,
                            scored: s.scored,
                            received: s.received,
                            bonus: s.bonus,
                            bonusPoints: s.bonusPoints,
                            points: s.points,
                            totalPoints: s.totalPoints,
                            homeTeam: matchInfo.teamHome,
                            homeTeamID: matchInfo.teamHomeID,
                            awayTeam: matchInfo.teamAway,
                            awayTeamID: matchInfo.teamAwayID,
                            startDate:s.fixture.startDate,
                            endDate:s.fixture.endDate,
                            createdAt:s.createdAt,
                            updatedAt:s.updatedAt
                        }

                    }),

                }

                return teamStanding

            })
            

            const matchesInSeason = await db.Fixture.findAll({
                where: {idSeason: season}, required: true,
                include: {
                    model: db.Match, as: 'matches',
                    include:[
                        { model:db.Team, as:'teamHome'},
                        { model:db.Team, as:'teamAway'},
                    ]
                }
            })

            standingsByTeam.forEach(t =>{
                // console.log(t);
                // moment
                t.standings.sort((a,b)=> sortByDateAscending(a.startDate,b.startDate))
            })
            
            res.status(200).json({
                meta:{
    
                    status:'success',
                },
                standings: standingsByTeam,
                fixtures: matchesInSeason.sort((a,b) => sortByDateAscending(a.startDate,b.startDate))
                })




        } catch (error) {
            
            console.log(error);
            res.status(500).json({
            meta:{
                status:'error',
            },
            errorMsg: error.message,
            error
            })

        }

    },

    //// api/fantaya/standings (post)
    saveRankings: async (req, res)=>{
        try {
            const fields_standings = [
                'ranking',
                'updatedAt'
            ]

            const newRankings = req.body.rankings

            

            const updatedStandings = await db.Standing.bulkCreate(
                newRankings, 
                { updateOnDuplicate: fields_standings }
            )


            res.status(200).json({
                meta:{

                    status:'success',
                },
                data: updatedStandings,
                })

        } catch (error) {
            console.log(error);
            res.status(500).json({
            meta:{
                status:'error',
            },
            errorMsg: error.message,
            error
            })
        }

    }


  }

  module.exports = fantayaController
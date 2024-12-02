const {RES_URL, clientFilter} = require('../helpers/config')
const { Op } = require('sequelize');
const db = require('../database/models');


const eventsController = {

    saveEvents: async (req, res) =>{

        try {
            // console.log(req.body);
            const fields_Player = [
              'home',
              'amarillas',
              'rojas',
              'golesRecibidos',
              'penalAtajado',
              'penalGol',
              'penalErrado',
              'atajadas',
              'goles',
              'golEnContra',
              'asistencias',
              'pases',
              'minutoInicial',
              'minutoFinal',
              'minutosJugadosApi',
              'minutosJugadosFantaya',
              'golesPost85',
              'golesPost85Cambiaresultado',
              'golesFueraarea',
              'asistPost85',
              'liderPases',
              'figura',
              'fpJugado',
              'fpResultado',
              'fpTarjetas',
              'fpPases',
              'fpGoles',
              'fpAsistencias',
              'fpArquero',
              'fpPenales',
              'fpInvicta',
              'fpFigura',
              'fantapuntos',
              'fpDescripcion',
              'fpDescripcion',
              'vallaInvicta',
              'updatedAt'
            ]
            const dummy_Player = {
              home: false,
              amarillas: 0,
              rojas: 0,
              golesRecibidos: 0,
              penalAtajado: 0,
              penalGol: 0,
              penalErrado: 0,
              atajadas: 0,
              goles: 0,
              golEnContra: 0,
              asistencias: 0,
              pases: 0,
              minutoInicial: 0,
              minutoFinal: 0,
              minutosJugadosApi: 0,
              minutosJugadosFantaya: 0,
              golesPost85: 0,
              golesPost85Cambiaresultado: 0,
              golesFueraarea: 0,
              asistPost85: 0,
              liderPases: 0,
              figura: 0,
              vallaInvicta:false,
              fpJugado: -1,
              fpResultado: 0,
              fpTarjetas: 0,
              fpPases: 0,
              fpGoles: 0,
              fpAsistencias: 0,
              fpArquero: 0,
              fpPenales: 0,
              fpInvicta: 0,
              fpFigura: 0,
              fantapuntos: -1,
              fpDescripcion: "No Fue Convocado"
            }

            const allPlayersDB = await db.Player.findAll()



            const mayusUnderscore_Player = {
              FPJugado: 'fpJugado',
              FPResultado: 'fpResultado',
              FPTarjetas: 'fpTarjetas',
              FPPases: 'fpPases',
              FPGoles: 'fpGoles',
              FPAsistencias: 'fpAsistencias',
              FPArquero: 'fpArquero',
              FPPenales: 'fpPenales',
              FPInvicta: 'fpInvicta',
              FPFigura: 'fpFigura',
              FantaPuntos: 'fantapuntos',
              FPDescripcion: 'fpDescripcion'
            }

            
            const playereventsToAdd = req.body.playerevents

            // Extract unique realTeamNames from playereventsToAdd
            const uniqueRealTeamNames = [
              ...new Set(playereventsToAdd.map(event => event.realTeamName))
            ];

            // Map realTeamNames to corresponding fantayaNames
            const fantayaNames = uniqueRealTeamNames
              .map(realTeamName => {
                  const team = allPlayersDB.find(player => player.name === realTeamName);
                  return team ? team.name : null;
              })
              .filter(name => name !== null);

            
            // Filter allPlayers by the fantayaNames to get player IDs
            const matchingPlayerIds = allPlayersDB
              .filter(player => fantayaNames.includes(player.realTeam))
              .map(player => player.id);

              const playereventsToAddIds = new Set(playereventsToAdd.map(player => player.id))
            
            // Filter matchingPlayerIds to keep only those not in playereventIds
            const filteredIds = matchingPlayerIds.filter(id => !playereventsToAddIds.has(id));
            
            let NCPlayers = []
            filteredIds.forEach(player => {
              const ncPlayer = {...dummy_Player}
              
              ncPlayer.idFixture = playereventsToAdd[0].idFixture
              ncPlayer.id = player
              ncPlayer.idPlayer = player
              
              NCPlayers.push(ncPlayer)
            })
            
            const consolidatedPlayersToAdd =  [...playereventsToAdd, ...NCPlayers]

            const modData = consolidatedPlayersToAdd.map(obj => {
              obj.realTeamName && delete obj.realTeamName

              return Object.fromEntries(
                Object.entries(obj).map(([key, value]) => [
                  mayusUnderscore_Player[key] || key,
                  value
                ])
              )

            })



            

            const playerevents = await db.Playerevent.bulkCreate(
              modData, 
                { updateOnDuplicate: fields_Player }
            )
            
            res.status(200).json({
                meta:{
    
                    status:'success',
                },
                data: playerevents,
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

    //// /events/:fixture (get)
    eventsByFixture : async (req, res) =>{
      try {        
        
        const fixtureFilter = {idFixture: req.params.fixture}

        
        const playerInfo = await db.Player.findAll({
          include: [
              { 
                model: db.Playerevent, as: 'playerevent',
                where: {...fixtureFilter}, required: false
              } 
            ]
        })
                
        
        res.status(200).json({
            meta:{

                status:'success',
            },
            data: playerInfo,
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


      
    }


  }

  module.exports = eventsController
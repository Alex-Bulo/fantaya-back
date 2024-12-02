const {RES_URL, clientFilter} = require('../helpers/config')
const { Op } = require('sequelize');
const db = require('../database/models');

const playersController = {

    getPlayers: async (req, res) =>{

        try {
            const allPlayers = await db.Player.findAll({
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
                data: allPlayers,
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

      addPlayers: async (req, res) =>{

        try {
          const newPlyaers = req.body.playersToAdd  
          
          const addedPlayers = await db.Player.bulkCreate(
            newPlyaers 
          )            
            res.status(200).json({
                meta:{
    
                    status:'success',
                },
                data: addedPlayers,
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

  module.exports = playersController
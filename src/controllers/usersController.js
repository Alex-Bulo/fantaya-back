const { Op } = require('sequelize');
const db = require('../database/models');

const usersController = {

    login : async (req, res) => {
        // console.log(req.body);
        try {
            if(req.errors.email.status || req.errors.phoneNumber.status){                
                
                res.status(400).json({
                    meta:{
                      status:'error',
                    },
                    errorMsg: 'Revisar datos cargados',
                    errors: req.errors
                })   
                return
            }

            const needForUser = {access: true, email: { [Op.eq]: req.body.email }, phoneNumber:req.body.phoneNumber}
  
            const userInfo = await db.User.findAll({
                where: {...needForUser},
                include:[{model: db.Team, as: 'teams', through:{attributes:[]}}]
            })

            const isMailCorrect = userInfo.length === 0 ? false : true
            
            if(!isMailCorrect){
                res.status(400).json({
                    meta:{
                    status:'error',
                    // userInfo
                    },
                    errorMsg: 'Revisar datos cargados',
                    errors: {...req.errors, email:{status:true, msg:'Mail incorrecto'}}
                })   
                return
            }    

            let info
            if(isMailCorrect){
                info = userInfo.map(user=>{
                    return {
                        id: user.id, 
                        name:user.name,
                        email: user.email,
                        team: user.teams.filter(team => team.active),
                        access: user.access
                    }
                })
            }
            
            res.status(200).json({
            meta:{

                status:'success',
            },
            data: info,
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
  

  }

  module.exports = usersController
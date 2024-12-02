const db = require("./index")

module.exports = (sequelize, DataTypes) => {
    let alias = 'Player'

    let cols = {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        fantayaName: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        
        realTeam: {
            type: DataTypes.STRING(35),
            allowNull: false
        },

        position: {
            type: DataTypes.STRING(10),
            allowNull: false
        },

        country: {
            type: DataTypes.STRING(25)
        },

    }

    let config = {
        tableName: 'players',
        underscored: true,
        timestamps: false
    }


    const Player = sequelize.define(alias, cols, config)

    //Relaciones

    Player.associate = (models) => {
        
        Player.hasMany(models.Playerevent, {
            as: "playerevent",
            foreignKey: "id_player"
        }),
        
        
        Player.hasMany(models.Cardpoint, {
            as: "cardpoint",
            foreignKey: "id_player"
        }),
        
        Player.hasMany(models.Squad, {
            as: "squads",
            foreignKey: "id_player"
        })

        
    }
    

    return Player

}
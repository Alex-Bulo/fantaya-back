const db = require("./index")

module.exports = (sequelize, DataTypes) => {
    let alias = 'Team'

    let cols = {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: DataTypes.STRING(35),
            allowNull: false
        },

        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        division:{
            type: DataTypes.STRING(6),
            allowNull: false
        },

        grupo:{
            type: DataTypes.STRING(35)
        },

        createdAt : DataTypes.DATE,
        updatedAt : DataTypes.DATE
    }

    let config = {
        tableName: 'teams',
        underscored: true,
        timestamps: true
    }


    const Team = sequelize.define(alias, cols, config)

    //Relaciones

    Team.associate = (models) => {
        
        Team.hasMany(models.Cardpoint, {
            as: "cardpoint",
            foreignKey: "id_team"
        }),

        Team.belongsToMany(models.User, {
            as: "users",
            through: models.UserTeam,
            foreignKey: "id_team"
        }),
        
        Team.hasMany(models.Squad, {
            as: "squad",
            foreignKey: "id_team"
        }),
        
        Team.hasMany(models.Match, {
            as: "matchesHome",
            foreignKey: "id_team_home"
        }),
        Team.hasMany(models.Match, {
            as: "matchesAway",
            foreignKey: "id_team_away"
        }),

        Team.hasMany(models.Dupla, {
            as:'dupla',
            foreignKey:'id_team'
        }),

        Team.hasMany(models.Dupla, {
            as: "duplaTeamA",
            foreignKey: "id_team_a"
        }),
        Team.hasMany(models.Dupla, {
            as: "duplaTeamB",
            foreignKey: "id_team_b"
        }),

        Team.hasMany(models.Matchmultiple, {
            as: "matchesmultipleTeam",
            foreignKey: "id_team"
        }),

        Team.hasMany(models.Standing, {
            as: "standings",
            foreignKey: "id_team"
        })




    }
    

    return Team

}
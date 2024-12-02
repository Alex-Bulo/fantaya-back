const { toDefaultValue } = require("sequelize/dist/lib/utils")

module.exports = (sequelize, DataTypes) => {
    let alias = 'Match'

    let cols = {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true
        },
        idFixture: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        idTeamHome:{
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },        
        idTeamAway: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        homeScore: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        awayScore: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        winner: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        
        createdAt : DataTypes.DATE,
        updatedAt : DataTypes.DATE
    }

    let config = {
        tableName: 'matches',
        underscored: true,
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['id_fixture', 'id_team_home', 'id_team_away']
            }
        ]
    }


    const Match = sequelize.define(alias, cols, config)

    // Relaciones
    Match.associate = (models) => {

            Match.belongsTo(models.Fixture,{
                as: "fixture",
                foreignKey: "id_fixture"
            }),
            Match.belongsTo(models.Team,{
                as: "teamHome",
                foreignKey: "id_team_home"
            })
            Match.belongsTo(models.Team,{
                as: "teamAway",
                foreignKey: "id_team_away"
            })



    }

    return Match

}
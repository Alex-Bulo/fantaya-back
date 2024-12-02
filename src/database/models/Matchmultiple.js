const { toDefaultValue } = require("sequelize/dist/lib/utils")

module.exports = (sequelize, DataTypes) => {
    let alias = 'Matchmultiple'

    let cols = {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        idFixture: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        idTeam:{
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },  
        match: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull:false
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        winner: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue:false
        },

        createdAt : DataTypes.DATE,
        updatedAt : DataTypes.DATE
    }

    let config = {
        tableName: 'matchesmultiple',
        underscored: true,
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['id_fixture', 'id_team_home', 'id_winner']
            }
        ]
    }


    const Matchmultiple = sequelize.define(alias, cols, config)

    // Relaciones
    Matchmultiple.associate = (models) => {

            Matchmultiple.belongsTo(models.Fixture,{
                as: "fixture",
                foreignKey: "id_fixture"
            }),
            Matchmultiple.belongsTo(models.Team,{
                as: "team",
                foreignKey: "id_team"
            })




    }

    return Matchmultiple

}
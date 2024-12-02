module.exports = (sequelize, DataTypes) => {
    let alias = 'Fixture'

    let cols = {
        id:{
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        
        idSeason: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },

        fantayaFecha: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        
        startDate : DataTypes.DATE,
        endDate : DataTypes.DATE


    }

    let config = {
        tableName: 'fixture',
        underscored: true,
        timestamps: false
    }


    const Fixture = sequelize.define(alias, cols, config)

    // Relaciones
    Fixture.associate = (models) => {

            Fixture.hasMany(models.Cardpoint, {
                as : 'cards',
                foreignKey:'id_fixture'
            }),
            Fixture.hasMany(models.Playerevent, {
                as : 'playerevents',
                foreignKey:'id_fixture'
            }),
            
            Fixture.belongsTo(models.Season,{
                as: "season",
                foreignKey: "id_season"
            }),
            Fixture.hasMany(models.Match, {
                as: "matches",
                foreignKey: "id_fixture"
            }),

            Fixture.hasMany(models.Matchmultiple, {
                as: "matchesmultiple",
                foreignKey: "id_fixture"
            }),

            Fixture.hasMany(models.Standing, {
                as: "standings",
                foreignKey: "id_fixture"
            })

    }

    return Fixture

}
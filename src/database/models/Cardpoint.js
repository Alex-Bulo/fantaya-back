module.exports = (sequelize, DataTypes) => {
    let alias = 'Cardpoint'

    let cols = {
        idPlayer:{
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false
        },
        
        idTeam: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false
        },
        idFixture: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false
        },

        eventsFantapoints: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        
        defensorDesignado: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        
        ddPoints: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        captain: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        captainPoints: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        
        lineup: {
            type: DataTypes.STRING(15),
            allowNull: false,
            defaultValue: 'No Convocado'
        },

        totalFantapoints: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },

        createdAt : DataTypes.DATE,
        updatedAt : DataTypes.DATE

    }

    let config = {
        tableName: 'cardpoints',
        underscored: true,
        timestamps: true
    }


    const Cardpoint = sequelize.define(alias, cols, config)

    // Relaciones
    Cardpoint.associate = (models) => {

            Cardpoint.belongsTo(models.Fixture,{
                as: "fixture",
                foreignKey: "id_fixture"
            }),
            Cardpoint.belongsTo(models.Player,{
                as: "player",
                foreignKey: "idPlayer"
            })
            Cardpoint.belongsTo(models.Team,{
                as: "team",
                foreignKey: "id_team"
            })
            // Cardpoint model
            Cardpoint.belongsTo(models.Playerevent, {
                as: 'details', // Alias for association
                foreignKey: 'id_player', // Foreign key in Cardpoint model
                targetKey: 'idPlayer' // Primary key in Playerevent model
            });




    }

    return Cardpoint

}
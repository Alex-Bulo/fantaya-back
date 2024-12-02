module.exports = (sequelize, DataTypes) => {
    let alias = 'Playerevent'

    let cols = {
        idPlayer:{
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false
        },
        
        idFixture: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false
        },

        home: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        amarillas: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        rojas: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        golesRecibidos: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        penalAtajado: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        penalGol: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        penalErrado: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        atajadas: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        goles: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        golEnContra: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        asistencias: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        pases: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        minutoInicial: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        minutoFinal: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        minutosJugadosApi: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        minutosJugadosFantaya: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        golesPost85: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        golesPost85Cambiaresultado: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        golesFueraarea: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        asistPost85: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        liderPases: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        figura: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        fpJugado: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        fpResultado: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        fpTarjetas: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        fpPases: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        fpGoles: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        fpAsistencias: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        fpArquero: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        fpPenales: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        fpInvicta: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        fpFigura: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        fantapuntos: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },

        fpDescripcion: {
            type: DataTypes.STRING(1500)
        },
        vallaInvicta: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        createdAt : DataTypes.DATE,
        updatedAt : DataTypes.DATE

    }

    let config = {
        tableName: 'playerevents',
        underscored: true,
        timestamps: true
    }


    const Playerevent = sequelize.define(alias, cols, config)

    // Relaciones
    Playerevent.associate = (models) => {

            Playerevent.belongsTo(models.Fixture,{
                as: "fixture",
                foreignKey: "id_fixture"
            }),
            Playerevent.belongsTo(models.Player,{
                as: "player",
                foreignKey: "id_player"
            }),
            // Playerevent model
            Playerevent.hasMany(models.Cardpoint, {
                as: 'cardpoints', // Alias for association
                foreignKey: 'id_player', // Foreign key in Cardpoint model
                sourceKey: 'idPlayer' // Primary key in Playerevent model
            });




    }

    return Playerevent

}
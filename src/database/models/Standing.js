module.exports = (sequelize, DataTypes) => {
    let alias = 'Standing'

    let cols = {
        
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

        result: {
            type: DataTypes.STRING(3),
            allowNull: true,
        },

        scored: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },

        received: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        
        bonus: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        
        bonusPoints: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },

        points: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        
        totalPoints: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },

        ranking: {
            type: DataTypes.INTEGER,
        },

        createdAt : {
            type:DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        
        updatedAt : {
            type:DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            onUpdate: sequelize.literal('CURRENT_TIMESTAMP')
        },
        
    }

    let config = {
        tableName: 'standings',
        underscored: true,
        timestamps: true
    }


    const Standing = sequelize.define(alias, cols, config)

    // Relaciones
    Standing.associate = (models) => {

            Standing.belongsTo(models.Fixture,{
                as: "fixture",
                foreignKey: "id_fixture"
            }),
            
            Standing.belongsTo(models.Team,{
                as: "team",
                foreignKey: "id_team"
            })


    }

    return Standing

}
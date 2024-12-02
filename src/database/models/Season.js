module.exports = (sequelize, DataTypes) => {
    let alias = 'Season'

    let cols = {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        
        type: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue:'torneo'
        },

        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        startDate : DataTypes.DATE,
        endDate : DataTypes.DATE,
    }

    let config = {
        tableName: 'seasons',
        underscored: true,
        timestamps: false
    }


    const Season = sequelize.define(alias, cols, config)

    //Relaciones

    Season.associate = (models) => {
                
        Season.hasMany(models.Fixture, {
            as: "fixture",
            foreignKey: "id_season"
        })

             
    }
    

    return Season

}
module.exports = (sequelize, DataTypes) => {
    let alias = 'Squad'

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
        
        status: {
            type: DataTypes.STRING(15),
            allowNull: false,
            defaultValue: 'Active'
        },


    }

    let config = {
        tableName: 'squads',
        underscored: true,
        timestamps: false
    }


    const Squad = sequelize.define(alias, cols, config)

    // Relaciones
    Squad.associate = (models) => {


            Squad.belongsTo(models.Player,{
                as: "player",
                foreignKey: "id_player"
            })
            Squad.belongsTo(models.Team,{
                as: "team",
                foreignKey: "id_team"
            })



    }

    return Squad

}
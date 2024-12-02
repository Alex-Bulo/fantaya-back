module.exports = (sequelize, DataTypes) => {
    let alias = 'Dupla'

    let cols = {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true
        },
        idTeam: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        idTeamA:{
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },        
        idTeamB: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        }
    }

    let config = {
        tableName: 'duplas',
        underscored: true,
        timestamps: false,
    }


    const Dupla = sequelize.define(alias, cols, config)

    // Relaciones
    Dupla.associate = (models) => {


            Dupla.belongsTo(models.Team,{
                as: "teamDupla",
                foreignKey: "id_team"
            })

            Dupla.belongsTo(models.Team,{
                as: "teamA",
                foreignKey: "id_team_a"
            })

            Dupla.belongsTo(models.Team,{
                as: "teamB",
                foreignKey: "id_team_b"
            })


    }

    return Dupla

}
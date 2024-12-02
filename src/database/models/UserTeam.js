module.exports = (sequelize, DataTypes) => {
    let alias = 'UserTeam'

    let cols = {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        idUser: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        
        idTeam: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },

        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        createdAt : DataTypes.DATE,


    }

    let config = {
        tableName: 'users_teams',
        underscored: true,
        timestamps: false
    }


    const UserTeam = sequelize.define(alias, cols, config)

    //Relaciones

    UserTeam.associate = (models) => {
        
        UserTeam.belongsTo(models.User,{
            as: "users",
            foreignKey: "id_user"
        }),

        UserTeam.belongsTo(models.Team,{
            as: "teams",
            foreignKey: "id_team"
        })
        
    }
    

    return UserTeam

}
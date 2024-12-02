module.exports = (sequelize, DataTypes) => {
    let alias = 'User'

    let cols = {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: DataTypes.STRING(55),
            allowNull: false
        },

        phoneNumber: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique:true
        },

        email: {
            type: DataTypes.STRING(75),
            allowNull: false,
            unique:true
        },
        
        access: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },


        createdAt : DataTypes.DATE,
        updatedAt : DataTypes.DATE
    }

    let config = {
        tableName: 'users',
        underscored: true,
        timestamps: true
    }


    const User = sequelize.define(alias, cols, config)

    //Relaciones

    User.associate = (models) => {
                
        User.belongsToMany(models.Team, {
            as: "teams",
            through: models.UserTeam,
            foreignKey: "id_user"
        })
    }
    

    return User

}
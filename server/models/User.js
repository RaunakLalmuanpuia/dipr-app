import {DataTypes} from 'sequelize';

export default (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        roles: {
            type: DataTypes.JSON,  // storing object like { User: 2001, Editor: 1984 }
            allowNull: false,
            defaultValue: {User: 2001}
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        refreshToken: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'users',
        timestamps: true
    });

    return User;
};

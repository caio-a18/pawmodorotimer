module.exports = (sequelize, DataTypes) => {
    
    const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, 
        },
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    total_focus_time: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    }, {
        tableName: 'users',
        timestamps: false,
    });

    return User;
};
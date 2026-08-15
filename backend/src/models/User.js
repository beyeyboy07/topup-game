import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },

        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        role: {
            type: DataTypes.ENUM('CUSTOMER', 'ADMIN'),
            allowNull: false,
            defaultValue: 'CUSTOMER'
        },

        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1
        }
    },
    {
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

export default User;
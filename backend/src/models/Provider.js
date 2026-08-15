import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Provider = sequelize.define(
    'Provider',
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },

        base_url: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        api_key: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1
        }
    },
    {
        tableName: 'providers',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

export default Provider;
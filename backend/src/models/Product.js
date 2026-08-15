import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define(
    'Product',
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        game_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },

        provider_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },

        name: {
            type: DataTypes.STRING(150),
            allowNull: false
        },

        sku: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },

        provider_code: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        buy_price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0
        },

        sell_price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0
        },

        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1
        }
    },
    {
        tableName: 'products',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

export default Product;
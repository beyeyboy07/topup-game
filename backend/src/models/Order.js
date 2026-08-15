import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define(
    'Order',
    {
        // Primary key
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },

        // Nomor unik order
        order_number: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },

        // User yang membuat order
        user_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true
        },

        // Product yang dibeli
        product_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },

        // ID player game
        player_id: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        // Server ID jika diperlukan
        server_id: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        // Snapshot nama product
        product_name: {
            type: DataTypes.STRING(150),
            allowNull: false
        },

        // Harga beli dari provider
        buy_price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0
        },

        // Harga jual ke customer
        sell_price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0
        },

        // Status order
        status: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: 'PENDING'
        },

        // Waktu order expired
        expired_at: {
            type: DataTypes.DATE,
            allowNull: true
        },

        // Waktu pembayaran
        paid_at: {
            type: DataTypes.DATE,
            allowNull: true
        },

        // Waktu topup selesai
        completed_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: 'orders',

        timestamps: true,

        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

export default Order;
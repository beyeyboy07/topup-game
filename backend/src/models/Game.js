import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Game = sequelize.define(
    'Game',
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        slug: {
            type: DataTypes.STRING(100),
            allowNull: true,
            unique: true
        },

        publisher : {
            type : DataTypes.STRING(100),
            allowNull: true,
        },

        image: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        status: {
            type: DataTypes.TINYINT,
            allowNull: true,
            defaultValue: 1
        }
    },
    {
        tableName: 'games',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)


export default Game;
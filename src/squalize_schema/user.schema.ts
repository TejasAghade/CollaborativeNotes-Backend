import { DataTypes } from "sequelize";
import { sequelize } from "../app";

export const User = sequelize.define(
    'User',
    {
        // Model attributes are defined here
        uId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: true,
    },
);

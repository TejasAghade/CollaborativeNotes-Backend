import { DataTypes } from "sequelize";
import { sequelize } from "../db/dbcon";

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
            unique: true
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

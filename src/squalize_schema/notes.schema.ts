import { DataTypes } from "sequelize";
import { sequelize } from "../app";
import { User } from "./user.schema";
import Collaborators from "./collaborator.schema";


const Note = sequelize.define(
    'Note',
    {
        noteId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        createdBy: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: User,
                key: 'uId',
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: true
        },


    },
    {
        timestamps: true,
    },
);


export default Note;
import { DataTypes } from "sequelize";
import { User } from "./user.schema";
import Note from "./notes.schema";
import { sequelize } from "../db/dbcon";

const Collaborators = sequelize.define(
    'collaborators',
    {
        collabId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },

        noteId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: Note,
                key: 'noteId',

            },
            onDelete: 'cascade'
        },

        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: User,
                key: 'uId'
            },
            onDelete: 'cascade'
        },

        role: {
            type: DataTypes.STRING,
            defaultValue: 'VIEWER',
            allowNull: false
        },

    },
    {
        timestamps: true
    }
);


// Collaborator associations
Collaborators.belongsTo(User, { foreignKey: 'userId' }); // Collaborator belongs to a User
Collaborators.belongsTo(Note, { foreignKey: 'noteId' }); // Collaborator belongs to a Note

// Note associations
Note.hasMany(Collaborators, { onDelete: 'cascade', foreignKey: 'noteId' }); // Note has many Collaborators

// User associations
User.hasMany(Collaborators, { onDelete: 'cascade', foreignKey: 'userId' }); // User has many Collaborators


export default Collaborators;
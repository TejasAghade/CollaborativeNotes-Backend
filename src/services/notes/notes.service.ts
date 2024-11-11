import { Socket } from "socket.io";
import Collaborators from "../../squalize_schema/collaborator.schema";
import Note from "../../squalize_schema/notes.schema";
import { User } from "../../squalize_schema/user.schema";
import ApiResponse, { serverError } from "../../utils/response/api_response";
import { v4 as uuidv4 } from 'uuid';
import { socketIo } from "../../app";
import redisClient from "../../redis/redis";

class NotesService {

    public static createNotes = async (note: any) => {

        const {
            title,
            content,
            createdBy,
            updatedBy,
        } = note;

        try {

            if (!title) {
                return new ApiResponse(
                    "title is required!",
                    [],
                    null,
                    400,
                );
            }

            let noteId = uuidv4();

            const addedNote = await Note.create({ noteId: noteId, title: title, content: content, createdBy: createdBy, updatedBy: updatedBy });

            const collab = await Collaborators.create({ collabId: uuidv4(), noteId, userId: createdBy, role: "Admin" });

            return new ApiResponse(
                "Note added!",
                [],
                addedNote.dataValues,
                201,
            );


        } catch (err) {
            return serverError(err);
        }


    }

    public static deleteNote = async (noteId: string) => {

        try {

            const note = await Note.destroy({
                where: {
                    noteId: noteId
                }
            });


            if (note === 0) {
                return new ApiResponse(
                    "note not found!",
                    [],
                    null,
                    404,
                );
            }


            return new ApiResponse(
                "note deleted!",
                [],
                null,
                200,
            );

        } catch (err) {
            return serverError(err);
        }
    }

    public static getNotes = async (uId: string) => {
        try {

            const notes = await Note.findAll({
                include: [{
                    model: Collaborators,
                    where: { userId: uId },
                    required: true,
                    attributes: ["role"],
                }],
            });

            if (notes.length === 0) {
                return new ApiResponse(
                    "no notes found!",
                    [],
                    null,
                    404,
                );
            }

            const notesJson = notes.map((note: any) => {
                let note2 = JSON.parse(JSON.stringify(note));
                note2['role'] = note['collaborators'][0]['role'];
                delete note2['collaborators'];
                return note2;
            })


            return new ApiResponse(
                "",
                null,
                notesJson,
                200,
            );

        } catch (err) {
            return serverError(err);
        }
    }

    public static getNoteById = async (payload: any) => {
        const { noteId, uId } = payload;
        try {

            const notes = await Note.findOne({
                include: [{
                    model: Collaborators,
                    where: { userId: uId, noteId: noteId },
                    required: true,
                    attributes: ['role']
                }],
            });


            let notes2 = JSON.parse(JSON.stringify(notes));



            notes2['role'] = notes['collaborators'][0]['role'];
            delete notes2['collaborators'];
            console.log(notes2);

            return new ApiResponse(
                "",
                null,
                notes2,
                200,
            );

        } catch (err) {
            return serverError(err);
        }
    }

    public static getCollaborators = async (noteId: String) => {

        try {

            const collabrts = await redisClient.get("notes:Collaborators");

            if ((JSON.parse(collabrts) || []).length != 0) {
                console.log("collaborators in cache");

                return new ApiResponse(
                    "",
                    null,
                    JSON.parse(collabrts),
                    200,
                );
            }

            const users = await User.findAll({
                attributes: ['uId', 'fullName', 'email'],
                include: [{
                    model: Collaborators,
                    where: { noteId: noteId },
                    required: true,
                    attributes: ["role"],
                }],
            });

            await redisClient.set("notes:Collaborators", JSON.stringify(users))
            await redisClient.expire("notes:Collaborators", 60 * 60 * 24);

            if (users.length === 0) {
                return new ApiResponse(
                    "no collaborators found!",
                    [],
                    null,
                    404,
                );
            }

            const usersJson = users.map(
                (user0: any) => {
                    let user = JSON.parse(JSON.stringify(user0));
                    user['role'] = user0['collaborators'][0]['role'];
                    delete user['collaborators'];
                    return user;
                }
            );


            return new ApiResponse(
                "",
                null,
                usersJson,
                200,
            );

        } catch (err) {
            return serverError(err);
        }
    }


    public static addCollaborator = async (params: any) => {
        const { uId, noteId, role } = params;
        try {

            const collab = await Collaborators.create({ collabId: uuidv4(), noteId, userId: uId, role });

            await redisClient.expire("notes:Collaborators", 15)

            return new ApiResponse(
                "Collaborator added!",
                [],
                collab.dataValues,
                201,
            );

        } catch (err) {
            return serverError(err);
        }
    }

    public static updateNote = async (params: any, socket: Socket) => {

        const { noteId, content, title, userId } = params;

        try {

            // Verify if the user has permission
            const collaborator = await Collaborators.findOne({
                where: { noteId, userId },
            });

            let role = collaborator.dataValues.role;

            if (role === 'viewer') {
                socketIo.to(noteId).emit('error', 'Permission denied');
                console.log("permission denied");

                return;
            }

            // Update note content in the database
            const note = await Note.findByPk(noteId);

            if (note) {
                note.dataValues.content = content;
                note.dataValues.title = title;
                await note.save();

                socketIo.to(noteId).emit('noteUpdated', note.dataValues);

            } else {
                socketIo.to(noteId).emit('error', 'Note not found');
            }
        } catch (error) {
            socketIo.to(noteId).emit('error', 'An error occurred while updating the note');
        }
    }

    public static joinNote = async (noteId: string, userId: string, socket: Socket) => {
        socket.join(noteId);
    }

}

export default NotesService;
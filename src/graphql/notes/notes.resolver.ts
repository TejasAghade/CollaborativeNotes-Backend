import NotesService from "../../services/notes/notes.service"
import UserService from "../../services/user/user.service";


const createNote = async (_: any, payload: any, context: any) => {
    if (!!!context.user) {
        return UserService.authorizationError();
    }
    return await NotesService.createNotes(payload.note);
}

const updateNotes = async () => {

}

const deleteNotes = async (_: any, payload: any, context: any) => {
    if (!!!context.user) {
        return UserService.authorizationError();
    }
    return await NotesService.deleteNote(payload.noteId);
}

const addCollaborator = async (_: any, payload: any, context: any) => {
    if (!!!context.user) {
        return UserService.authorizationError();
    }
    return await NotesService.addCollaborator(payload);
}

const getNotes = async (_: any, payload: any, context: any) => {
    if (!!!context.user) {
        return UserService.authorizationError();
    }
    return await NotesService.getNotes(payload.uId);
}

const getNoteById = async (_: any, payload: any, context: any) => {
    if (!!!context.user) {
        return UserService.authorizationError();
    }
    return await NotesService.getNoteById(payload);
}

const getCollaborators = async (_: any, payload: any, context: any) => {
    if (!!!context.user) {
        return UserService.authorizationError();
    }
    return await NotesService.getCollaborators(payload.noteId);

}


export const noteQueriesResolvers = {
    getCollaborators,
    getNoteById,
    getNotes
}


export const noteMutationsResolvers = {
    createNote,
    updateNotes,
    deleteNotes,
    addCollaborator
}
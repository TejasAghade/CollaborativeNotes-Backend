export const notesMutation = `#graphql
    type Mutation {
        createNote(note:NoteInput) : Response
        deleteNotes(noteId:String) : Response
        updateNotes(note:String) : String,
        addCollaborator(uId:String, noteId:String, role:String) : Response
    }
`
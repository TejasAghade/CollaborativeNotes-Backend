export const noteQueries = `#graphql
    type Query {
        getNotes(uId:String): ListResponse!,
        getNoteById(noteId:String, uId:String): Response!,
        getCollaborators(noteId:String): CollaboratorsRes!
    }
`
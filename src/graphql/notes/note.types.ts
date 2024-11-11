import { notesMutation } from "./note.mutations";
import { noteQueries } from "./note.queries";

export const noteTypes = `

    type Response{
        success : Boolean!
        message : String
        statusCode : Int
        errors :[String]
        data : Note
    }

    type ListResponse{
        success : Boolean!
        message : String
        statusCode : Int
        errors :[String]
        data : [Note]
    }

    type Note{
        noteId : String
        title : String
        content : String
        createdBy:String
        updatedBy:String
        createdAt:String
        updatedAt:String
        role : String
    }
    

    input NoteInput{
        title : String
        content : String
        createdBy:String
        updatedBy:String
    }

    type CollaboratorsRes{
        success : Boolean!
        message : String
        statusCode : Int
        errors :[String]
        data : [Collaborators]
    }

    type Collaborators{
        uId:String
        fullName:String
        email:String
        role:String
    }

    ${noteQueries}
    ${notesMutation}

`;



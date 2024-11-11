import { userMutations } from "./user.mutations";
import { userQueries } from "./user.queries";

export const userTypes = `

    type UserResponse{
        success : Boolean!
        message : String
        statusCode : Int
        errors :[String]
        data : User
    }

    type UserListResponse{
        success : Boolean!
        message : String
        statusCode : Int
        errors :[String]
        data : [User]
    }

    type User {
        uId: String
        fullName: String
        email: String
        token: String
    }

 
    input UserInput {
        id: String
        fullName: String
        email: String
        password:String
    }

    ${userQueries}
    ${userMutations}
`;



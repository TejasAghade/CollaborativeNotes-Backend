export const userQueries = `#graphql
    type Query {
        getUsers: UserListResponse!,
        loginUser(userData:UserInput!) : UserResponse
        searchUser : User,
    }
`
export const userMutations = `#graphql
    type Mutation {
        registerUser(userData:UserInput!) : UserResponse
    }
`
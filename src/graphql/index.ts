
import { ApolloServer } from "@apollo/server";
import { userTypes } from "./user/user.types";
import { userMutationsResolver, userQueriesResolver } from "./user/user.resolver";
import { noteTypes } from "./notes/note.types";
import { noteQueriesResolvers, noteMutationsResolvers } from "./notes/notes.resolver";


/**
   * function to start graphql server
*/
const startGqlServer = async () => {
   const server = new ApolloServer({
      typeDefs: `#graphql
           ${userTypes}
           ${noteTypes}
       `,
      resolvers: {
         Query: {
            ...userQueriesResolver,
            ...noteQueriesResolvers
         },
         Mutation: {
            ...userMutationsResolver,
            ...noteMutationsResolvers
         }
      },
   });
   await server.start();
   return server;
}

export default startGqlServer;
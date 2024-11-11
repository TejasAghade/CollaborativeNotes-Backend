import app, { connectDB, server } from "./app";
import { expressMiddleware } from '@apollo/server/express4';
import startGqlServer from "./graphql";
import cors from 'cors';
import UserService from "./services/user/user.service";
import SocketIoService from "./services/socket/socket_io.service";


connectDB().then(async (value) => {

    SocketIoService.setupSocket();

    const gqlServer = await startGqlServer();

    app.use("/gql", cors<cors.CorsRequest>(), expressMiddleware(
        gqlServer,
        {
            context: async ({ req }) => {
                const authHeader = req.headers['authorization'];
                const token = authHeader && authHeader.split(' ')[1];
                try {
                    const user = UserService.decodeAccessToken(token);
                    return { user };
                } catch (e) {
                    return {}
                }
            }
        }
    ));

    server.listen(4000, () => {

        console.log("server is running on 4000");

    });

}).catch((err) => {

    console.log(err);

})


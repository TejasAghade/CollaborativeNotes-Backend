import express from "express";
import cors from "cors";
import dotenv from 'dotenv';

import { Sequelize } from "sequelize";

import http from 'http';
import { Server } from 'socket.io';
import ApiResponse from "./utils/response/api_response";


const app = express();


export const server = http.createServer(app);

export const socketIo = new Server(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }
});


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();



let POSTGRES_USER = process.env.POSTGRES_USER;
let POSTGRES_PASS = process.env.POSTGRES_PASS;
let POSTGRES_HOST = process.env.POSTGRES_HOST;

// Initialize Sequelize connection
let sequelize = new Sequelize(
    `postgres://${POSTGRES_USER}:${POSTGRES_PASS}@${POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
    {
        dialect: 'postgres',
    },
);


/**
 * connect to database with sequelize
 */
const connectDB = async () => {
    try {
        await sequelize.authenticate();

        sequelize.sync()
            .then(() => {
                console.log('Tables have been created!');
            })
            .catch((error) => {
                console.error('Error syncing database:', error);
                throw error;
            });

        console.log("Connection has been established successfully.");
        return true;
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        throw error;

    }
};


export {
    sequelize,
    connectDB,
}

export default app;

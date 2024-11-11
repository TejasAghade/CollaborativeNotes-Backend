import express from "express";
import cors from "cors";
import dotenv from 'dotenv';

import http from 'http';
import { Server } from 'socket.io';


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



export default app;

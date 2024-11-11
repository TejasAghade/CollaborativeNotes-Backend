import { socketIo } from "../../app";
import NotesService from "../notes/notes.service";

class SocketIoService {
    public static setupSocket = () => {

        console.clear();

        socketIo.on('connection', (socket) => {
            console.log('A user connected:', socket.id);

            socket.on('joinNote', async ({ noteId, userId }) => {
                NotesService.joinNote(noteId, userId, socket);
                const response = await NotesService.getNoteById({ noteId, uId: userId });
                socketIo.to(noteId).emit('joined', response.data);
            });

            socket.on('updateNote', async (params) => {
                console.log("updating note");
                await NotesService.updateNote(params, socket);
            });

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        });

    }
}


export default SocketIoService;
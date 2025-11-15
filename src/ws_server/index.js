import { WebSocketServer } from 'ws';
import { register } from '../utils/register.js';
import { updateRoom } from '../utils/updateRoom.js';
import { updateWinners } from '../utils/updateWinners.js';
import { createRoom } from '../utils/createRoom.js';
import { addUserToRoom } from '../utils/addUserToRoom.js';
import { connections } from '../db/db.js';

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const { type, data } = JSON.parse(message);

        if (type === "reg") {
            const { name, password } = JSON.parse(data);
            register(ws, name, password);
            updateRoom(wss);
            updateWinners(wss);
            return;
        }

        if (type === "create_room") {
            createRoom(ws);
            updateRoom(wss);
            return;
        }

        if (type === "add_user_to_room") {
            const { indexRoom } = JSON.parse(data);
            addUserToRoom(wss, ws, indexRoom);
            return;
        }

        if (type === "add_ships") {

        }
    });

    ws.on("close", () => {
        connections.delete(ws);
    });
});

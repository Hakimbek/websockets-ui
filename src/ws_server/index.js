import { WebSocketServer } from 'ws';
import { register } from '../utils/register.js';
import { updateRoom } from '../utils/updateRoom.js';
import { updateWinners } from '../utils/updateWinners.js';
import { createRoom } from '../utils/createRoom.js';
import { addUserToRoom } from '../utils/addUserToRoom.js';
import { addShips } from '../utils/addShips.js';
import { connections } from '../db/db.js';

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const { type, data } = JSON.parse(message);

        if (type === "reg") {
            register(ws, data);
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
            addUserToRoom(wss, ws, data);
            return;
        }

        if (type === "add_ships") {
            addShips(wss, data);
            return;
        }

        if (type === "attack") {

        }
    });

    ws.on("close", () => {
        connections.delete(ws);
    });
});

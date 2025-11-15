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

        switch (type) {
            case "reg":
                register(ws, data);
                updateRoom(wss);
                updateWinners(wss);
                break;
            case "create_room":
                createRoom(ws);
                updateRoom(wss);
                break;
            case "add_user_to_room":
                addUserToRoom(wss, ws, data);
                break;
            case "add_ships":
                addShips(wss, data);
                break;
            case "attack":
                break;
            case "randomAttack":
                break;
        }
    });

    ws.on("close", () => {
        connections.delete(ws);
    });
});

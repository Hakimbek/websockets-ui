import { connections, rooms, games } from '../db/db.js';
import { v4 as uuidv4 } from "uuid";
import { updateRoom } from './updateRoom.js';
import { send } from './send.js';

export const addUserToRoom = (wss, ws, roomId) => {
    const room = rooms.get(roomId);
    const username = connections.get(ws);

    if (!username || !room) return;

    room.users.push(username);

    if (room.users.length === 2) {
        const gameId = uuidv4();
        const [player1, player2] = room.users;

        games.set(gameId, {
                gameId,
                players: {
                    [player1]: { idPlayer: uuidv4(), ships: [], ready: false },
                    [player2]: { idPlayer: uuidv4(), ships: [], ready: false }
                },
                turn: player1,
            }
        );

        rooms.delete(roomId);
        updateRoom(wss);

        wss.clients.forEach(ws => {
            const name = connections.get(ws);
            if (name === player1 || name === player2) {
                send(ws, "create_game", {
                    idGame: gameId,
                    idPlayer: games.get(gameId).players[name].idPlayer,
                });
            }
        });
    }
}

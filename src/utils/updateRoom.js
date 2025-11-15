import { rooms, players } from '../db/db.js';
import { broadcast } from './broadcast.js';

export const updateRoom = (wss) => {
    const data = Array.from(rooms.values()).map(room => ({
        roomId: room.roomId,
        roomUsers: room.users.map(name => ({
            name,
            index: players.get(name).id,
        }))
    }));

    broadcast(wss, "update_room", data);
}

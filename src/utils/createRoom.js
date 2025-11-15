import { v4 as uuidv4 } from "uuid";
import { connections, rooms } from "../db/db.js";

export const createRoom = (ws) => {
    const username = connections.get(ws);

    if (!username) return;

    const roomId = uuidv4();

    rooms.set(roomId, {
        roomId,
        users: [username]
    })
}

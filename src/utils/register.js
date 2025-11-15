import { v4 as uuidv4 } from "uuid";
import { players, connections } from '../db/db.js';
import { send } from './send.js';

export const register = (ws, name, password) => {
    if (!players.has(name)) {
        players.set(name, {
            id: uuidv4(),
            name,
            password,
            wins: 0,
        });
    }

    const { password: userPassword, id: userId } = players.get(name);

    if (userPassword !== password) {
        return send(ws, "reg",{
            name,
            index: "",
            error: true,
            errorText: "Wrong password"
        })
    }

    connections.set(ws, name);

    send(ws, "reg", {
        name,
        index: userId,
        error: false,
    })
}

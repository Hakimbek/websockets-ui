import { broadcast } from './broadcast.js';
import { players } from '../db/db.js';

export const updateWinners = (wss) => {
    const data = Array.from(players.values()).map(({ name, wins }) => ({
        name,
        wins,
    }));

    broadcast(wss, "update_winners", data);
}

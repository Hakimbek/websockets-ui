import { send } from './send.js';

export const broadcast = (wss, type, data) => {
    wss.clients.forEach(ws => send(ws, type, data));
}

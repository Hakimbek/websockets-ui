export const send = (ws, type, data) => ws.send(JSON.stringify({
    type,
    data: JSON.stringify(data),
    id: 0
}));
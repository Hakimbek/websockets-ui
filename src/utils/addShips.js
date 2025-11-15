import { games, connections } from '../db/db.js';
import { send } from './send.js';
import { broadcast } from './broadcast.js';

export const addShips = (wss, data) => {
    const { gameId, ships, indexPlayer } = JSON.parse(data);
    const game = games.get(gameId);

    if (!game) return;

    const player = Object.values(game.players).find(({ idPlayer }) => idPlayer === indexPlayer);

    if (!player) return;

    player.ships = ships;
    player.ready = true;

    const bothReady = Object.values(game.players).every(player => player.ready);

    if (bothReady) {
        Object.entries(game.players).forEach(([playerName, playerData]) => {
            const ws = [...wss.clients].find(ws => connections.get(ws) === playerName);

            send(ws, "start_game", {
                ships: playerData.ships,
                currentPlayerIndex: playerData.idPlayer
            });
        });

        broadcast(wss, "turn", {
            currentPlayer: game.players[game.turn].idPlayer
        })
    }
}

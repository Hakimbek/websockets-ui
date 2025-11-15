import { games, players } from '../db/db.js';
import { broadcast } from './broadcast.js';
import { updateWinners } from './updateWinners.js';

function checkHit(enemyShips, x, y) {
    for (const ship of enemyShips) {
        const cells = [];

        for (let i = 0; i < ship.length; i++) {
            if (ship.direction) {
                cells.push({ x: ship.position.x + i, y: ship.position.y });
            } else {
                cells.push({ x: ship.position.x, y: ship.position.y + i });
            }
        }

        const hit = cells.find(c => c.x === x && c.y === y);
        if (!hit) continue;

        ship.hits = ship.hits || [];
        ship.hits.push({ x, y });

        if (ship.hits.length === ship.length) {
            return "killed";
        }
        return "shot";
    }
    return "miss";
}

export const attack = (wss, data) => {
    const { gameId, x, y, indexPlayer } = JSON.parse(data);
    const game = games.get(gameId);

    if (!game || game.players[game.turn].idPlayer !== indexPlayer) return;

    const enemy = Object.keys(game.players).find(player => player !== game.turn);
    const enemyShips = game.players[enemy].ships;

    const status = checkHit(enemyShips, x, y);

    broadcast(wss, "attack", {
        position: { x, y },
        currentPlayer: indexPlayer,
        status
    })

    if (status === "miss") {
        game.turn = enemy;
    }

    const aliveShips = enemyShips.filter(ship => (ship.hits || []).length < ship.length).length;

    if (aliveShips === 0) {
        const winner = game.players[game.turn].idPlayer;

        broadcast(wss, "winner", {
            winPlayer: winner
        })

        players.get(game.turn).wins++;
        updateWinners(wss);
        return;
    }

    broadcast(wss, "turn", {
        currentPlayer: game.players[game.turn].idPlayer
    })
}

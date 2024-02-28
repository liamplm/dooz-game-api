import cors from 'cors';
import express from 'express';
import http from 'http';
import { Socket } from 'socket.io';

import { Server } from 'socket.io';
import { PlayingRooms } from './play-rooms';
import {
    DO_MOVE_EVENT,
    GAME_END_EVENT,
    GameEndReason,
    NEED_MATCH_EVENT,
    OPPONENT_DID_MOVE_EVENT,
    OPPONENT_LEFT_EVENT,
    PLAY_ROOM_PREFIX,
} from './constants';
import { TEAMS } from './dooz-game-state.class';
import compression from 'compression';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    path: '/ws',
    cors: {
        origin: '*',
    },
});

const gameService = new PlayingRooms(io);

io.on('connection', (socket: Socket) => {
    console.log('a user connected', socket.id);

    socket.on(NEED_MATCH_EVENT, async () => {
        gameService.matchMaking(socket);
    });

    socket.on(DO_MOVE_EVENT, (colIndex: number, ack) => {
        const playingRoomId = gameService.socketToRoomId.get(socket.id);
        if (!playingRoomId) return;

        const playingRoom = gameService.getSocketByPlayingRoomId(playingRoomId);
        if (!playingRoom) return;

        playingRoom.sockets.forEach((s, i) => {
            if (s.id == socket.id) {
                console.log('new move', playingRoomId, TEAMS[i], colIndex);
                playingRoom.state.dropAChipsInCol(colIndex, TEAMS[i]);
            }

            s?.emit(OPPONENT_DID_MOVE_EVENT, {
                colIndex,
                origin: socket.id,
            });
            ack('done');
        });

        const winner = playingRoom.state.checkWinner();
        console.log('winner', playingRoomId, winner);
        if (winner != 'empty') {
            playingRoom.sockets.forEach((s, i) => {
                const team = TEAMS[i];
                s.emit(
                    GAME_END_EVENT,
                    winner == team
                        ? GameEndReason.YouWin
                        : GameEndReason.YouLose,
                );
            });
        }

        // (await io.in(socket.rooms[0]).fetchSockets()).
    });

    socket.on('disconnect', () => {
        console.log('a user left', socket.id);
        const playingRoomId = gameService.socketToRoomId.get(socket.id);
        console.log('playingRoomId', playingRoomId);
        if (!playingRoomId) return;

        const playingRoom = gameService.getSocketByPlayingRoomId(playingRoomId);
        if (!playingRoom) return;

        console.log('playingRoom', playingRoomId, playingRoom.socketsId);
        // console.log('others len', others);
        // console.log('rooms', others?.length);

        playingRoom.sockets.forEach((s) => {
            if (!s) return;

            s.emit(GAME_END_EVENT, GameEndReason.OpponentLeft);

            if (s.id != socket.id) {
                gameService.matchMaking(s);
            }
        });
        const room = gameService.socketToRoomId.get(socket.id);

        playingRoom.socketsId.forEach((sid) => {
            gameService.socketToRoomId.delete(sid);
        });

        if (!room) return;
        gameService.roomToSockets.delete(room);
        // console.log('playingRomm after clean up', playingRoomId,playingRoom.socketsId);
    });
});



// config
const port = process.env.PORT || 3000;
const app_folder = './wwww/browser';
const options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['html', 'js', 'scss', 'css'],
    index: false,
    maxAge: '1y',
    redirect: true,
};

// create app
app.use(compression());
app.use(express.static(app_folder, options));

// serve angular paths
app.all('*', function (req, res) {
    res.status(200).sendFile(`/`, { root: app_folder });
});

app.use(
    cors({
        origin: '*',
    }),
);

server.listen(3000, () => {
    console.log('listening on *:3000');
});

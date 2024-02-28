import { Server, Socket } from 'socket.io';
import {
    MATCH_FOUND_EVENT,
    MATCH_MAKING_ROOM,
    PLAY_ROOM_PREFIX,
} from './constants';
import { DoozBoardState } from './dooz-game-state.class';

export class PlayingRooms {
    roomToSockets = new Map<
        string,
        { sockets: [string, string]; state: DoozBoardState }
    >();
    socketToRoomId = new Map<string, string>();

    constructor(private io: Server) {}

    getSocketById(id: string) {
        return this.io.sockets.sockets.get(id);
    }

    getSocketByPlayingRoomId(id: string) {
        const playingRoom = this.roomToSockets.get(id);

        if (!playingRoom) return undefined;

        return {
            state: playingRoom.state,
            socketsId: playingRoom.sockets,
            sockets: playingRoom.sockets.map(
                (sid) => this.getSocketById(sid) as Socket,
            ),
        };
    }

    getOtherSocketsOfPlayingRoom(id: string) {
        const playingRoom = this.socketToRoomId.get(id);
        if (!playingRoom) return;

        return this.getSocketByPlayingRoomId(playingRoom);
    }

    async matchMaking(guy: Socket) {
        const guysWaiting = await this.io.in(MATCH_MAKING_ROOM).fetchSockets();
        console.log('matchMaking', guy.id, guy.rooms);
        console.log(
            'guys waiting',
            guysWaiting.length,
            guysWaiting.map((s) => s.id),
        );
        if (guy.rooms.has(MATCH_MAKING_ROOM)) {
            console.warn(guy.id, 're-requesting match making');
            return;
        }
        if (
            Array.from(guy.rooms.values()).some((room) =>
                room.includes(PLAY_ROOM_PREFIX),
            )
        ) {
            console.warn(guy.id, 'already in a play room');
            return;
        }

        if (guysWaiting.length > 0) {
            const otherGuy = guysWaiting[0];

            const playingRoomId = this.genrateRandomName();
            this.roomToSockets.set(playingRoomId, {
                sockets: [otherGuy.id, guy.id],
                state: new DoozBoardState(),
            });
            this.socketToRoomId.set(otherGuy.id, playingRoomId);
            this.socketToRoomId.set(guy.id, playingRoomId);

            otherGuy.leave(MATCH_MAKING_ROOM);

            otherGuy.emit(MATCH_FOUND_EVENT, otherGuy.id);
            guy.emit(MATCH_FOUND_EVENT, otherGuy.id);

            console.log(guy.id, otherGuy.id, 'are playing at ', playingRoomId);
            console.log(
                Array.from(this.roomToSockets.keys()),
                this.socketToRoomId,
            );
        } else {
            guy.join(MATCH_MAKING_ROOM);
            console.log('user ', guy.id, 'needs match');
        }
    }

    genrateRandomName() {
        return (
            PLAY_ROOM_PREFIX + Math.ceil(Math.random() * 10000000).toString(16)
        );
    }
}

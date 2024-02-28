export const NEED_MATCH_EVENT = 'need_match',
    DO_MOVE_EVENT = 'DO_MOVE',
    OPPONENT_DID_MOVE_EVENT = 'OPPONENT_DID_MOVE',
    MATCH_FOUND_EVENT = 'match_found',
    OPPONENT_LEFT_EVENT = 'opponent_left',
    GAME_END_EVENT = 'game_end',
    MATCH_MAKING_ROOM = 'match_making',
    PLAY_ROOM_PREFIX = 'play_room--';

export enum GameEndReason {
    OpponentLeft,
    YouWin,
    YouLose
}

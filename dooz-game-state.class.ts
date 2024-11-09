import { IVec2, Vec2 } from './vec2.type';

export const TEAMS = ['A', 'B'] as const;

export type Team = (typeof TEAMS)[0] | (typeof TEAMS)[1];
export type ChipsType = 'empty' | Team;

export const getOpositeTeam = (t: Team) =>
    t == TEAMS[0] ? TEAMS[1] : TEAMS[0];

export class DoozBoardState {
    __length: IVec2;
    cols: ChipsType[][];

    constructor(l?: IVec2) {
        this.__length = l || new Vec2(7, 6);
        this.cols = new Array(this.__length.x)
            .fill(null)
            .map(() => new Array(this.__length.y).fill('empty'));

        return;
        const base = `
X@@XX@@
X@@XY@@
YY@YXX@
XX@YYY@
YY@XYY@
XYXYYXX
`
            .trim()
            .split('\n')
            .map((x) => x.split(''));

        const charToChips = (chips: string): ChipsType =>
            chips == '@' ? 'empty' : chips == 'X' ? 'A' : 'B';

        this.cols = new Array(this.__length.x)
            .fill(null)
            .map((_, x) =>
                new Array(this.__length.y)
                    .fill(null)
                    .map((_, y) => charToChips(base[y][x])),
            );
    }

    toString() {
        const chipsToChar = (chips: ChipsType) =>
            chips == 'empty' ? '@' : chips == 'A' ? 'X' : 'Y';
        return new Array(this.__length.y)
            .fill(null)
            .map((_, y) =>
                new Array(this.__length.x)
                    .fill(null)
                    .map((_, x) => chipsToChar(this.cols[x][y]))
                    .join(''),
            )
            .join('\n');
        // return this.cols
        //     .map((col) =>
        //         col
        //             .map((chips) =>
        //                 chips == 'empty' ? '@' : chips == 'A' ? 'X' : 'Y',
        //             )
        //             .join(''),
        //     )
        //     .join('\n');
    }

    dropAChipsInCol(colIndex: number, chipsType: Team): boolean {
        const col = this.cols[colIndex];

        if (col[0] != 'empty') return false;

        for (let i = 0; i <= col.length; i++) {
            if (col[i] == 'empty') continue;

            this.cols[colIndex][i - 1] = chipsType;

            break;
        }

        return true;
    }

    colHeight(colIndex: number): number {
        const col = this.cols[colIndex];
        // return col.length;

        return col.findIndex((c) => c != 'empty');
    }

    checkWinner(): ChipsType | 'tie' {
        // Vertical
        for (let x = 0; x < this.__length.x; x++) {
            let previousChips: ChipsType = 'empty';
            let counter = 0;

            for (let y = 0; y < this.__length.y; y++) {
                const c = this.cols[x][y];
                if (
                    c === 'empty' ||
                    (previousChips !== 'empty' && c != previousChips)
                ) {
                    previousChips = c;
                    counter = 0;
                    continue;
                }

                counter++;

                if (counter == 4) {
                    return c;
                }

                previousChips = c;
            }
        }

        // Horizontal
        for (let y = 0; y < this.__length.y; y++) {
            let previousChips: ChipsType = 'empty';
            let counter = 0;

            for (let x = 0; x < this.__length.x; x++) {
                const c = this.cols[x][y];

                if (c === 'empty') {
                    previousChips = c;
                    counter = 0;
                    continue;
                }
                if (c != previousChips) {
                    previousChips = c;
                    counter = 1;
                    continue;
                }

                counter++;

                if (counter == 4) {
                    return c;
                }

                previousChips = c;
            }
        }

        {
            let baseX = this.__length.x - 1,
                baseY = 0;
            while (1) {
                if (baseX == 0)
                    break; // step 3
                else if (baseY == this.__length.y - 1)
                    baseX--; // step 2
                else baseY++; // step 1

                // console.log(baseX, baseY);
                let x = baseX,
                    y = baseY;
                let previousChips: ChipsType = 'empty';
                let counter = 0;
                while (
                    0 <= x &&
                    x < this.__length.x &&
                    0 <= y &&
                    y < this.__length.y
                ) {
                    // console.log('iter xy',x,y)
                    const c = this.cols[x][y];
                    x--;
                    y--;

                    if (c === 'empty') {
                        previousChips = c;
                        counter = 0;
                        continue;
                    }
                    if (c != previousChips) {
                        previousChips = c;
                        counter = 1;
                        continue;
                    }

                    counter++;

                    if (counter == 4) {
                        return c;
                    }

                    previousChips = c;
                }
            }
            // for (baseX = 0; baseX < LENGTH; baseX++) {
            //
            // }
        }
        {
            let baseX = 0,
                baseY = 0;
            while (1) {
                if (baseX == this.__length.x - 1)
                    break; // step 3
                else if (baseY == this.__length.y - 1)
                    baseX++; // step 2
                else baseY++; // step 1

                // console.log(baseX, baseY);
                let x = baseX,
                    y = baseY;
                let previousChips: ChipsType = 'empty';
                let counter = 0;
                while (
                    0 <= x &&
                    x < this.__length.x &&
                    0 <= y &&
                    y < this.__length.y
                ) {
                    // console.log('iter xy',x,y)
                    const c = this.cols[x][y];
                    x++;
                    y--;

                    if (c === 'empty') {
                        previousChips = c;
                        counter = 0;
                        continue;
                    }
                    if (c != previousChips) {
                        previousChips = c;
                        counter = 1;
                        continue;
                    }

                    counter++;

                    if (counter == 4) {
                        return c;
                    }

                    previousChips = c;
                }
            }
            // for (baseX = 0; baseX < LENGTH; baseX++) {
            //
            // }
        }

        if (this.validCols().length == 0) {
            return 'tie';
        }

        return 'empty';
    }

    validCols() {
        return this.cols
            .map((col, i) => [i, col[0] != 'empty'] as const)
            .filter(([i, isFull]) => !isFull)
            .map(([i, _]) => i);
    }

    copy() {
        const x = new DoozBoardState(this.__length);
        x.cols = structuredClone(this.cols);

        return x;
    }

    static nextBest(
        state: DoozBoardState,
        maxDepth: number,
        ourTeam: Team,
        depth: number = maxDepth,
        currentTeam: Team = ourTeam,
    ): [number | undefined, number] {
        // const __log = (...x: any[]) => {
        //     console.log('d:', depth, 't:', currentTeam, '=>', ...x);
        // };
        // const log = (...x: any[]) => {
        //     if (depth == 9) {
        //         __log(...x);
        //     }
        // };

        const winner = state.checkWinner();
        const validMoves = state.validCols();
        const is_game_finished = winner !== 'empty' || validMoves.length == 0;

        if (depth == 0 || is_game_finished) {
            // console.log(state.toString(), winner);
        }

        const isOurNextMove = maxDepth - depth == 1;
        const isOpNextMove = maxDepth - depth == 2;
        // if (isOurNextMove || isOpNextMove) {
        //     console.log(state.toString());
        //     console.log('Next move winner', winner);
        // }
        // No further investigation needed game is finished
        if (is_game_finished) {
            // if were taling about the next move it live or die
            let winScore = 99999 * 2 ** (depth + 1);
            if (winner == 'empty') {
                return [undefined, 0];
            } else if (winner == ourTeam) {
                return [undefined, isOurNextMove ? Infinity : winScore];
            } else {
                return [undefined, isOpNextMove ? -Infinity : -winScore];
            }
        }
        if (depth == 0) {
            return [undefined, 0];
        }
        const mainBranch = depth == maxDepth;

        if (currentTeam == ourTeam) {
            const processedMoves = validMoves.map((move) => {
                const newState = state.copy();
                newState.dropAChipsInCol(move, currentTeam);
                const score = DoozBoardState.nextBest(
                    newState,
                    maxDepth,
                    ourTeam,
                    depth - 1,
                    getOpositeTeam(currentTeam),
                )[1];

                return {
                    move,
                    score,
                };
            });

            if (mainBranch) {
                console.log('All Moves', processedMoves);
                if (
                    processedMoves.every(
                        ({ score }, i, arr) =>
                            i == 0 || score == arr[i - 1].score,
                    )
                ) {
                    const randomMove =
                        validMoves[
                            Math.round((validMoves.length - 1) * Math.random())
                        ];

                    return [randomMove, processedMoves[0].score];
                }

                const bestMove = processedMoves.reduce((bestMove, m) => {
                    if (bestMove.score < m.score) return m;

                    return bestMove;
                }, processedMoves[0]);

                return [bestMove.move, bestMove.score];
            } else {
                return [
                    0,
                    processedMoves.reduce((s, { score }) => s + score, 0),
                ];
            }
        } else {
            let avgScore = 0;
            // let bestMove =
            //     validMoves[Math.round((validMoves.length - 1) * Math.random())];

            for (const move of validMoves) {
                const newState = state.copy();
                newState.dropAChipsInCol(move, currentTeam);
                const newScore = DoozBoardState.nextBest(
                    newState,
                    maxDepth,
                    ourTeam,
                    depth - 1,
                    getOpositeTeam(currentTeam),
                )[1];

                avgScore += newScore;
            }
            return [0, avgScore];
        }
    }
}

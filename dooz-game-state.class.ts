export type Team = 'A' | 'B';
export type ChipsType = 'empty' | Team;

export const TEAMS = ['A','B'] as const;

const LENGTH = 7;
export class DoozBoardState {
    cols: ChipsType[][] = new Array(LENGTH)
        .fill(null)
        .map(() => new Array(LENGTH).fill('empty'));

    checkWinner(): ChipsType {
        // Vertical
        for (let x = 0; x < LENGTH; x++) {
            let previousChips: ChipsType = 'empty';
            let counter = 0;

            for (let y = 0; y < LENGTH; y++) {
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
        for (let y = 0; y < LENGTH; y++) {
            let previousChips: ChipsType = 'empty';
            let counter = 0;

            for (let x = 0; x < LENGTH; x++) {
                const c = this.cols[x][y];
                console.log(previousChips,c,x,y)
                if (c === 'empty') {
                    previousChips = c;
                    counter = 0;
                    continue;
                }
                if (
                    c != previousChips
                ) {
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

        // Top Diagnole LTR
        for (let baseX = 0; baseX < LENGTH; baseX++) {
            let previousChips: ChipsType = 'empty';
            let counter = 0;

            let x = baseX,
                y = 0;
            for (let i = 0; i < LENGTH && x < LENGTH && y < LENGTH; i++) {
                const c = this.cols[x][y];
                x++;
                y++;
                if (c === 'empty') {
                    previousChips = c;
                    counter = 0;
                    continue;
                }
                if (
                    c != previousChips
                ) {
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

        // Bottom Diagnole LTR
        for (let baseX = 0; baseX < LENGTH; baseX++) {
            let previousChips: ChipsType = 'empty';
            let counter = 0;

            let x = 0,
                y = baseX;
            for (let i = 0; i < LENGTH && x < LENGTH && y < LENGTH; i++) {
                const c = this.cols[x][y];
                x++;
                y++;

                if (c === 'empty') {
                    previousChips = c;
                    counter = 0;
                    continue;
                }
                if (
                    c != previousChips
                ) {
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

        // Top Diagnole RTL
        for (let baseX = 0; baseX < LENGTH; baseX++) {
            let previousChips: ChipsType = 'empty';
            let counter = 0;

            let x = LENGTH - 1,
                y = baseX;
            for (let i = 0; i < LENGTH && x < LENGTH && y < LENGTH; i++) {
                const c = this.cols[x][y];
                x--;
                y++;

                if (c === 'empty') {
                    previousChips = c;
                    counter = 0;
                    continue;
                }
                if (
                    c != previousChips
                ) {
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

        // Bottom Diagnole LTR
        for (let baseX = 0; baseX < LENGTH; baseX++) {
            let previousChips: ChipsType = 'empty';
            let counter = 0;

            let x = baseX,
                y = LENGTH - 1;
            for (let i = 0; i < LENGTH && x < LENGTH && y < LENGTH; i++) {
                const c = this.cols[x][y];
                x--;
                y++;

                if (c === 'empty') {
                    previousChips = c;
                    counter = 0;
                    continue;
                }
                if (
                    c != previousChips
                ) {
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

        return 'empty';
    }

    toString() {
        return this.cols
            .map((col) =>
                col
                    .map((chips) =>
                        chips == 'empty' ? '@' : chips == 'A' ? 'X' : 'Y',
                    )
                    .join(''),
            )
            .join('\n');
    }

    dropAChipsInCol(colIndex: number, chipsType: ChipsType): boolean {
        const col = this.cols[colIndex];
        if (col[0] != 'empty') return false;

        for (let i = 0; i <= col.length; i++) {
            if (col[i] == 'empty') continue;

            this.cols[colIndex][i - 1] = chipsType;

            break;
        }

        return true;
    }
}

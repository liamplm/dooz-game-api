export interface IVec2 {
    x: number;
    y: number;
}

export class Vec2 implements IVec2 {
    constructor(
        public x: number,
        public y: number,
    ) {}

    copy() {
        return new Vec2(this.x, this.y);
    }

    add(v: Vec2) {
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    set(v: Vec2) {
        this.x = v.x;
        this.y = v.y;
    }
    // add(v: Vec2) {
    //     this.x = (this.x || 0) + (v.x || 0)
    //     this.y = (this.y || 0) + (v.y || 0)
    //
    //     return this
    // }
    //
    // div(v: Vec2) {
    //     this.x = (this.x || 0) + (v.x || 0)
    //     this.y = (this.y || 0) + (v.y || 0)
    //
    //     return this
    // }
}

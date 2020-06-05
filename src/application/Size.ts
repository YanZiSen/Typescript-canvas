import { vec2 } from "./math2d";

export class Size {
    public values: Float32Array;

    public constructor (w: number, h: number) {
        this.values = new Float32Array([w, h])
    }

    public set width (value: number) {
        this.values[0] = value
    }
    public get width () :number {
        return this.values[0]
    }
    public set height (value: number) {
        this.values[1] = value
    }
    public get height () :number {
        return this.values[1]
    }
    public static create (w: number, h: number) : Size {
        return new Size(w, h)
    }
}

// 矩形包围框 
export class Rectangle {
    public origin: vec2
    public size: Size
    public constructor (origin:vec2 = new vec2(), size: Size = new Size(1, 1)) {
        this.origin = origin
        this.size = size
    }
    public static create (x:number, y: number, w:number, h:number) : Rectangle {
        let origin = new vec2(x, y)
        let size = new Size(w, h)
        return new Rectangle(origin, size)
    }
}

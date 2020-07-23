const EPSILON : number = 0.00001 ;
const PiBy180 : number = 0.017453292519943295 ;

export class vec2 {
    public values: Float32Array // 使用float32Array
    public constructor (x: number = 0, y: number = 0) {
        this.values = new Float32Array([x, y])
    }
    public toString () :string {
        return `[${this.values[0]}, ${this.values[1]}]`
    }
    public get x () :number {
        return this.values[0]
    }
    public set x (x: number) {
        this.values[0] = x
    }
    public get y () :number {
        return this.values[1]
    }
    public set y (y: number) {
        this.values[1] = y
    }
    // 判断两个向量是否相等
    public equals (vector: vec2) : boolean {
        if (Math.abs(this.values[0] - vector.values[0]) > EPSILON) {
            return false
        }
        if (Math.abs(this.values[1] - vector.values[1]) > EPSILON) {
            return false
        }
        return true
    }
    public get squardLength () : number {
        let x = this.values[0]
        let y = this.values[1]
        return x * x + y * y
    }
    public get length () : number {
        return Math.sqrt(this.squardLength)
    }
    // 取负向量
    public negative () : vec2 {
        this.values[0] = -this.values[0]
        this.values[1] = -this.values[1]
        return this
    }
    public normalize () :number {
        let len = this.length 
        if (Math2D.isEquals(len, 0)) {
            this.values[0] = 0
            this.values[1] = 0
            return 0
        }
        if (Math2D.isEquals(len, 1)) {
            return 1.0
        }
        return len
    }
    public static create (x: number = 0, y: number = 0) : vec2 {
        return new vec2(x, y)
    }
    // 本向量与另一个向量相加
    public add (right: vec2) : vec2 {
        vec2.sum(this, right, this);
        return this
    }
    // 两个向量相加并返回result
    public static sum (left:vec2, right: vec2, result: vec2 | null = null) : vec2 {
        if (result === null) {
            result = new vec2()
        }
        result.values[0] = left.values[0] + right.values[0]
        result.values[1] = left.values[1] + right.values[1]
        return result
    }
    public substract (another: vec2) : vec2 {
        vec2.difference(this, another, this)
        return this
    } 
    public static difference(end: vec2, start: vec2, result: vec2 | null = null) : vec2 {
        if (result === null) {
            result = new vec2()
        } 
        result.values[0] = end.values[0] - start.values[0]
        result.values[1] = end.values[1] - start.values[1]
        return result
    }
    // 复制一个向量
    public static copy (src: vec2, result: vec2 | null = null): vec2 {
        if (result === null) {
            result = new vec2()
        }
        result.values[0] = src.values[0]
        result.values[1] = src.values[1]
        return result
    }
    // 缩放向量
    public static scale (direction: vec2, scalar: number, result: vec2 | null = null) : vec2 {
        if (result === null) result = new vec2()
        result.values[1] = direction.values[1] * scalar
        result.values[0] = direction.values[0] * scalar
        return result
    }
    public static scaleAdd (start: vec2, direction: vec2, scalar: number, result: vec2 | null = null) : vec2 {
        if (result === null) {
            result = new vec2()
        }
        vec2.scale(direction, scalar, result)
        return vec2.sum(result, start, result)
    }
    // 重置一个向量
    public reset (x:number = 0, y:number = 0):vec2 {
        this.values[0] = x
        this.values[1] = y
        return this
    }
}

export class math2d {
    public values: Float32Array
}

export class Math2D {
    // 角度转弧度
    public static toRadian (degree: number) : number {
        return degree * PiBy180
    }
    // 弧度转角度
    public static toDegree (radian: number) : number {
        return radian / PiBy180
    }
    public static isEquals (left: number, right: number, espilon: number = EPSILON) : boolean {
        if (Math.abs(right - left) > EPSILON) {
            return false
        }
        return true
    }
}
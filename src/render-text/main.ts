import {Canvas2D} from '../canvas-2d/Canvas2D'

let canvas: HTMLCanvasElement|null = document.getElementById('canvas') as HTMLCanvasElement

if (canvas === null) {
    throw new Error('没有找到canvas元素')
}

let canvas2d: Canvas2D = new Canvas2D(canvas)

canvas2d.drawText('HeHelksajdfklajsfdlkasjdflkajsdflkajsdflkjdslkfjal')
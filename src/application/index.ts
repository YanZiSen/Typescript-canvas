// 测试动画部分

//import {Application, TimerCallback} from './application'
// import {ApplicationTest} from './ApplicationTest'

// let canvas:HTMLCanvasElement|null = document.getElementById('canvas') as HTMLCanvasElement
// let stopBtn:HTMLElement|null = document.getElementById('stop')
// let startBtn:HTMLElement|null = document.getElementById('start')

// let app:Application = new ApplicationTest(canvas)

// let callback: TimerCallback = function (id:number, data:any):void {
//     console.log('callback-invoke', data)
// }

// app.update(0, 0)
// app.render()
// app.addTimer(callback, 3, false, {age: 16})
// if (startBtn) {
//     startBtn.addEventListener('click', () => {
//         app.start()
//     }, false) 
// }

// if (stopBtn) {
//     stopBtn.addEventListener('click', () => {
//         app.stop()
//     })
// }

// 矩形绘画

import {Canvas2dApplication, TimerCallback} from './application'
import {ETextLayout} from './ETextLayout'
import { Size, Rectangle } from './Size'
import { vec2 } from './math2d'
// import icon from './timg.jpg'
type Repeatition = 'x-repeat' | 'y-repeat' | 'repeat' | 'no-repeat'
type TextAlign = 'start' | 'left' | 'center' | 'right' | 'end'
type TextBaseLine = 'alphabetic' | 'hanging' | 'top' | 'middle' | 'bottom'
type FontType = '10px sans-serif' | '15px sans-serif' | '20px sans-serif' | '25px sans-serif'

class TestApplication extends Canvas2dApplication {
    private _lineDashOffset: number = 0
    private _linearGradient !: CanvasGradient
    private _radialGradient !: CanvasGradient
    private _pattern !: CanvasPattern | null
    public changeDashOffset ():void {
        this._lineDashOffset += 5
    }
    public constructor (canvas: HTMLCanvasElement) {
        super(canvas)
    }
    public static Colors : string[] = [
        'aqua', // 浅绿色
        'black', // 黑色
        'blue',
        'fuchsia',
        'gray',
        'green',
        'lime',
        'maroon',
        'navy',
        'olive',
        'orange',
        'purple',
        'red',
        'silver',
        'teal',
        'white',
        'yellow'
    ]
    public render () :void {
        if (this.context2D !== null) {
            this.context2D.clearRect(0, 0, this.context2D.canvas.width, this.context2D.canvas.height)
            // this._drawRect(10, 10, this.context2D.canvas.width - 20, this.context2D.canvas.height - 20)
            // this.fillLinearRect(20, 20, 100, 100)
            // this.fillRadialRect(20, 20, 100, 100)
            // this.fillImage(20, 20, 100, 100)
            // this.fillCircle(100, 100, 50, '#afa')
            this.strokeGrid()
            this.testCanvas2DTextLayout()
        }
    }
    private _drawRect (x: number, y: number, w: number, h: number) {
        if (this.context2D !== null) {
            this.context2D.save()
            console.log('lineCap', this.context2D.lineCap)
            console.log('lineJoin', this.context2D.lineJoin)
            console.log('miterLimit', this.context2D.miterLimit)
            this.context2D.fillStyle = '#afa'
            this.context2D.strokeStyle = '#faa'
            // this.context2D.lineWidth = 10
            this.context2D.lineDashOffset = this._lineDashOffset
            this.context2D.setLineDash([10, 20])
            this.context2D.beginPath()
            this.context2D.moveTo(x, y)
            this.context2D.lineTo(x + w, y)
            this.context2D.lineTo(x + w, y + h)
            this.context2D.lineTo(x, y + h)
            this.context2D.closePath()
            this.context2D.fill()
            this.context2D.stroke()
            this.context2D.restore()
        }
    }
    public fillLinearRect (x:number, y: number, w: number, h: number):void {
        if (this.context2D !== null) {
            this.context2D.save()
            if (this._linearGradient === undefined) {
                // 创建左上角到右下角的渐变
                this._linearGradient = this.context2D.createLinearGradient(x, y, x + w, y + h)
                this._linearGradient.addColorStop(0.0, 'gray')
                this._linearGradient.addColorStop(0.25, 'rgba(255, 0, 0, 1)')
                this._linearGradient.addColorStop(0.5, 'green')
                this._linearGradient.addColorStop(0.75, '#00f')
                this._linearGradient.addColorStop(1, 'black')
            }
            this.context2D.fillStyle = this._linearGradient
            this.context2D.beginPath()
            this.context2D.rect(x, y, w, h)
            this.context2D.stroke()
            this.context2D.fill()
            this.context2D.restore()
        }
    }
    public fillRadialRect (x: number, y: number, w: number, h: number) :void {
        if (this.context2D !== null ) {
            this.context2D.save()
            if (this._radialGradient === undefined) {
                let radius: number = Math.min(w, h) * 0.5
                let centerX: number = x + w/2
                let centerY: number = y + h/2
                this._radialGradient = this.context2D.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.7)
                this._radialGradient.addColorStop(0.0, 'gray')
                this._radialGradient.addColorStop(0.25, 'rgba(255, 0, 0, 1)')
                this._radialGradient.addColorStop(0.5, 'green')
                this._radialGradient.addColorStop(0.75, '#00f')
                this._radialGradient.addColorStop(1, 'black')
            }
            this.context2D.fillStyle = this._radialGradient
            this.context2D.beginPath()
            this.context2D.rect(x, y, w, h)
            this.context2D.fill()
            this.context2D.restore()
        }
    }
    public fillImage (x:number, y:number, w:number, h:number, repeat: Repeatition = 'x-repeat') :void {
        if (this.context2D !== null) {
            if (this._pattern === undefined) {
                let img: HTMLImageElement = document.createElement('img')
                img.src = './timg.jpg'
                img.onload = ():void => {
                    if (this.context2D !== null) {
                        this._pattern = this.context2D.createPattern(img, repeat)
                        this.context2D.save()
                        if (this._pattern !== null) {
                            this.context2D.fillStyle = this._pattern
                        }
                        this.context2D.beginPath()
                        this.context2D.rect(x, y, w, h)
                        this.context2D.fill()
                        this.context2D.restore()
                    }
                }
            } else {
                this.context2D.save()
                if (this._pattern) {
                    this.context2D.fillStyle = this._pattern
                }
                this.context2D.beginPath()
                this.context2D.rect(x, y, w, h)
                this.context2D.restore()
            }
        }
        
    }
    public fillCircle (x:number, y:number, radius: number, fillStyle: string | CanvasPattern | CanvasGradient) :void {
        if (this.context2D !== null) {
            this.context2D.save()
            this.context2D.fillStyle = fillStyle
            this.context2D.beginPath()
            this.context2D.arc(x, y, radius, 0, Math.PI * 2)
            this.context2D.fill()
            this.context2D.restore()
        }
    }
    // 纯stroke操作，因为此方法被其他地方多次调用，所以状态由调用方管理
    // 没有进行状态管理和状态修改
    public strokeLine (x0:number, y0:number, x1: number, y1:number) :void {
        if (this.context2D !== null) {
            this.context2D.beginPath()
            this.context2D.moveTo(x0, y0)
            this.context2D.lineTo(x1, y1)
            this.context2D.stroke()
        }
    }
    public strokeCoord (originX:number, originY:number, width: number, height:number) :void {
        if (this.context2D !== null) {
            this.context2D.save()
            this.context2D.strokeStyle='red'
            this.strokeLine(originX, originY, originX + width, originY)
            this.context2D.strokeStyle='blue'
            this.strokeLine(originX, originY, originX, originY + height)
            this.context2D.restore()
        }
    }
    public strokeGrid (color:string = 'grey', interval: number = 10) {
        if (this.context2D !== null) {
            this.context2D.save()
            this.context2D.strokeStyle = 'gray'
            this.context2D.lineWidth = 0.5
            for (let start = interval + 0.5; start <= this.canvas.width; start += interval) {
                this.strokeLine(start, 0, start, this.canvas.height)
            }
            for (let start = interval + 0.5; start <= this.canvas.height; start += interval) {
                this.strokeLine(0, start, this.canvas.width, start)
            }
            this.context2D.restore()
            this.fillCircle(0, 0, 5, 'green')
            this.strokeCoord(0, 0, this.context2D.canvas.width, this.context2D.canvas.height)
        }
    }
    public printTextState () :void {
        if (this.context2D !== null) {
            console.log('*******************TextState***********************')
            console.log('font', this.context2D.font)
            console.log('textAlign', this.context2D.textAlign)
            console.log('textBaseLine', this.context2D.textBaseline)
        }
    }
    public fillText (text: string, x: number, y: number, color:string = 'white', align:TextAlign = 'left', baseline: TextBaseLine, font:FontType = '10px sans-serif') :void {
        if (this.context2D !== null) {
            this.context2D.save()
            this.context2D.textAlign = align
            this.context2D.textBaseline = baseline
            this.context2D.font = font
            this.context2D.fillText(text, x, y)
            this.context2D.fillStyle = color
            this.context2D.restore()
        }
    }
    public testCanvas2DTextLayout () :void {
        let x:number = 20
        let y:number = 20
        let drawX:number = x
        let drawY:number = y
        let radius: number = 3
        let width: number = this.canvas.width - 20 * 2
        let height: number = this.canvas.height - 20 * 2
        this._drawRect(x, y, width, height)
        this.fillText('left-top', drawX, drawY, 'white', 'left', 'top')
        this.fillCircle(drawX, drawY, radius, 'black')

        drawX = x + width / 2
        this.fillText('center-top', drawX, drawY, 'black', 'center', 'top')
        this.fillCircle(drawX, drawY, radius, 'black')

        drawX = x + width
        this.fillText('right-top', drawX, drawY, 'white', 'right', 'top')
        this.fillCircle(drawX, drawY, radius, 'black')

        drawX = x
        drawY = y + height / 2
        this.fillText('left-middle', drawX, drawY, 'white', 'left', 'middle')
        this.fillCircle(drawX, drawY, radius, 'black')

        drawX = x + width / 2
        drawY = y + height / 2
        this.fillText('center-middle', drawX, drawY, 'black', 'center', 'middle')
        this.fillCircle(drawX, drawY, radius, 'black')

        drawX = x + width 
        drawY = y + height / 2
        this.fillText('right-middle', drawX, drawY, 'white', 'right', 'middle')
        this.fillCircle(drawX, drawY, radius, 'black')

        drawX = x
        drawY = y + height
        this.fillText('left-bottom', drawX, drawY, 'black', 'left', 'bottom')
        this.fillCircle(drawX, drawY, radius, 'black')

        drawX = x + width / 2
        drawY = y + height
        this.fillText('center-bottom', drawX, drawY, 'black', 'center', 'bottom')
        this.fillCircle(drawX, drawY, radius, 'black')

        drawX = x + width
        drawY = y + height
        this.fillText('left-bottom', drawX, drawY, 'black', 'right', 'bottom')
        this.fillCircle(drawX, drawY, radius, 'black')
    }
    public calcTextSize (text: string, char: string = 'W', scale: number = 0.5): Size {
        if (this.context2D !== null) {
            let size:Size = new Size(0, 0)
            size.width = this.context2D.measureText(text).width
            size.height = this.context2D.measureText(char).width * scale + size.width
            return size
        }
        throw new Error("canvas 2D渲染上下文为null")
    }
    public calcLocalTextRectangle (layout: ETextLayout, text: string, parentWidth: number, parentHeight: number) :Rectangle {
        let size: Size = this.calcTextSize(text)
        let o:vec2 = vec2.create(0, 0)
        let left: number = 0
        let top: number = 0
        let right: number = parentWidth - size.width
        let bottom: number = parentHeight - size.height
        let center: number = right * 0.5
        let middle: number = bottom * 0.5
        switch (layout) {
            case ETextLayout.LEFT_TOP:
                o.x = left
                o.y = top
                break
            case ETextLayout.CENTER_TOP:
                o.x = center
                o.y = top 
                break 
            case ETextLayout.RIGHT_TOP:
                o.x = right
                o.y = top
                break 
            case ETextLayout.LEFT_MIDDLE:
                o.x = left 
                o.y = middle
                break
            case ETextLayout.CENTER_MIDDLE:
                o.x = center 
                o.y = middle
                break
            case ETextLayout.RIGHT_MIDDLE:
                o.x = right 
                o.y = middle 
                break 
            case ETextLayout.LEFT_BOTTOM:
                o.x = left 
                o.y = bottom 
                break 
            case ETextLayout.CENTER_BOTTOM:
                o.x = center 
                o.y = bottom
                break 
            case ETextLayout.RIGHT_BOTTOM:
                o.x = right  
                o.y = bottom 
                break 

        }
        return new Rectangle(o, size)
    }
    // public fill
}

let canvas:HTMLCanvasElement | null = document.getElementById('canvas') as HTMLCanvasElement

let app:TestApplication = new TestApplication(canvas)

let move:TimerCallback = function (id, data) {
    app.changeDashOffset()
}

app.addTimer(move,0.03, false, null)
app.render()

// app.start()
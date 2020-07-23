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

import {Canvas2dApplication, TimerCallback, CanvasMouseEvent, CanvasKeyBoardEvent} from './application'
import {ELayout} from './ETextLayout'
import { Size, Rectangle } from './Size'
import { vec2, Math2D } from './math2d'
import {Tank} from './Tank'
// import icon from './timg.jpg'
type Repeatition = 'x-repeat' | 'y-repeat' | 'repeat' | 'no-repeat'
type TextAlign = 'start' | 'left' | 'center' | 'right' | 'end'
type TextBaseLine = 'alphabetic' | 'hanging' | 'top' | 'middle' | 'bottom'
type FontType = '10px sans-serif' | '15px sans-serif' | '20px sans-serif' | '25px sans-serif'

export class TestApplication extends Canvas2dApplication {
    private _lineDashOffset: number = 0
    private _linearGradient !: CanvasGradient
    private _radialGradient !: CanvasGradient
    private _pattern !: CanvasPattern | null
    private _mouseX: number = 0 // 鼠标移动中x坐标值
    private _mouseY: number = 0 // 鼠标移动中y坐标值

    private _rotateSunSpeed:number = 50 //太阳自传的角速度
    private _revolutionSpeed:number = 60 // 月球公转的角速度
    private _rotateMoonSpeed:number = 100 // 月球自传的角速度

    private _rotateSun = 0 // 太阳自传的初始角位移
    private _rotateMoon = 0 // 月亮自传的初始角位移
    private _revolution = 0 // 月球绕太阳公转的初始角位移

    private _Tank: Tank

    public changeDashOffset ():void {
        this._lineDashOffset += 5
    }
    public constructor (canvas: HTMLCanvasElement) {
        super(canvas)
        this.isSupportMouseMove = true
        this._Tank = new Tank()
        this._Tank.x = canvas.width*0.5
        this._Tank.y = canvas.height*0.5
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
    public update (elapsedMesc: number, intervalSec: number):void {
        // this._rotateSun += this._rotateSunSpeed * intervalSec
        // this._revolution += this._revolutionSpeed * intervalSec
        // this._rotateMoon += this._rotateMoonSpeed * intervalSec
        this._Tank.update(intervalSec)
    }
    public render () :void {
        if (this.context2D !== null) {
            this.context2D.clearRect(0, 0, this.context2D.canvas.width, this.context2D.canvas.height)
            // this._drawRect(10, 10, this.context2D.canvas.width - 20, this.context2D.canvas.height - 20)
            // this.fillLinearRect(20, 20, 100, 100)
            // this.fillRadialRect(20, 20, 100, 100)
            // this.fillImage(20, 20, 100, 100)
            // this.fillCircle(100, 100, 50, '#afa')
            this.strokeGrid()
            this.drawCanvasCoordCenter()
            this.drawCoordInfo(`坐标：[${this._mouseX- this._Tank.x}, ${this._mouseY-this._Tank.y}], 角度：[${Math2D.toDegree(this._Tank.tankRotation).toFixed(2)}]`, this._mouseX, this._mouseY)
           
            // this.doTranform(20, true)
            // this.testCanvas2DTextLayout()
            // this.testFillLocalRectWithTitle()
            // this.testTranslateRotateTranslateDrawRect()
            this.draw4Quadarnt()
            this.drawTank()
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
    public fillCircle (x:number, y:number, radius: number, fillStyle: string | CanvasPattern | CanvasGradient = 'red') :void {
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
    public drawCanvasCoordCenter () : void {
        if (this.context2D === null) {
            return
        }
        let halfWidth: number = this.canvas.width * 0.5
        let halfHeight: number = this.canvas.height * 0.5
        this.context2D.save()
        this.context2D.lineWidth = 2
        this.context2D.strokeStyle = 'rgba(255, 0, 0, .5)'
        // 绘制 x 轴
        this.strokeLine(0, halfHeight, this.canvas.width, halfHeight)
        this.context2D.strokeStyle = 'rgba(0, 0, 255, .5)'
        // 绘制 y 轴
        this.strokeLine(halfWidth, 0, halfWidth, this.canvas.height)
        this.context2D.restore()
        this.fillCircle(halfWidth, halfHeight, 5, 'rgba(0, 0, 0, .5)')
    }
    // 绘制某个点处的坐标信息
    public drawCoordInfo (info: string, x: number, y: number) : void {
        this.fillText(info, x, y, 'black', 'center', 'bottom')
    }
    public distance (x0: number, y0: number, x1: number, y1: number) : number {
        let diffX = x1 - x0 
        let diffY = y1 - y0
        return Math.sqrt(diffX * diffX + diffY * diffY)
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
    public strokeCircle ( x: number, y: number, radius: number, color: string = 'red', lineWidth: number = 1 ): void {
        if ( this.context2D !== null ) {
            this.context2D.save();
            this.context2D.strokeStyle = color;
            this.context2D.lineWidth = lineWidth;
            this.context2D.beginPath();
            this.context2D.arc( x, y, radius, 0, Math.PI * 2 );
            this.context2D.stroke();
            this.context2D.restore();
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
            this.context2D.fillStyle = color
            this.context2D.fillText(text, x, y)
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
            size.height = this.context2D.measureText(char).width * scale + this.context2D.measureText(char).width
            return size
        }
        throw new Error("canvas 2D渲染上下文为null")
    }
    public calcLocalTextRectangle (layout: ELayout, text: string, parentWidth: number, parentHeight: number) :Rectangle {
        let size: Size = this.calcTextSize(text)
        let o:vec2 = vec2.create(0, 0)
        let left: number = 0
        let top: number = 0
        let right: number = parentWidth - size.width
        let bottom: number = parentHeight - size.height
        let center: number = right * 0.5
        let middle: number = bottom * 0.5
        switch (layout) {
            case ELayout.LEFT_TOP:
                o.x = left
                o.y = top
                break
            case ELayout.CENTER_TOP:
                o.x = center
                o.y = top 
                break 
            case ELayout.RIGHT_TOP:
                o.x = right
                o.y = top
                break 
            case ELayout.LEFT_MIDDLE:
                o.x = left 
                o.y = middle
                break
            case ELayout.CENTER_MIDDLE:
                o.x = center 
                o.y = middle
                break
            case ELayout.RIGHT_MIDDLE:
                o.x = right 
                o.y = middle 
                break 
            case ELayout.LEFT_BOTTOM:
                o.x = left 
                o.y = bottom 
                break 
            case ELayout.CENTER_BOTTOM:
                o.x = center 
                o.y = bottom
                break 
            case ELayout.RIGHT_BOTTOM:
                o.x = right  
                o.y = bottom 
                break 

        }
        return new Rectangle(o, size)
    }
    protected dispatchMouseMove (evt: CanvasMouseEvent) : void{
        this._mouseX = evt.canvasPosition.x
        this._mouseY = evt.canvasPosition.y
        this._Tank.onMouseMove(evt)
    }
    protected dispatchKeypress (evt: CanvasKeyBoardEvent) : void {
        this._Tank.onKeyPress(evt)
    }
    // 绘制一个左上角位于画布中心的矩形
    public doTranform (degree: number, rotateFirst: boolean = true):void {
        if (this.context2D !== null) {
            let radians:number = Math2D.toRadian(degree)
            let width: number = 100;
            let height: number = 60;
            let x = this.canvas.width * 0.5
            let y = this.canvas.height * 0.5

            if (rotateFirst) {
                let radius: number = this.distance(0, 0, x, y)
                this.strokeCircle(0, 0, radius, 'black')
            }

            this.context2D.save()
            this.context2D.translate(x, y)
            this.fillRectWithTitle(0, 0, width, height,  `0 度旋转`)
            this.context2D.restore()

            this.context2D.save()
            if (rotateFirst) {
                this.context2D.rotate(radians)
                this.context2D.translate(x, y)
            } else {
                this.context2D.translate(x, y)
                this.context2D.rotate(radians)
            }
            this.fillRectWithTitle(0, 0, width, height,  `${radians} 度旋转`)
            this.context2D.restore()

            this.context2D.save()
            if (rotateFirst) {
                this.context2D.rotate(-radians)
                this.context2D.translate(x, y)
            } else {
                this.context2D.translate(x, y)
                this.context2D.rotate(-radians)
            }
            this.fillRectWithTitle(0, 0, width, height, `${-radians} 度旋转`)
            this.context2D.restore()
        }
    }
    public fillRectWithTitle ( x: number, y: number, width: number, height: number, title: string = '', layout: ELayout = ELayout.CENTER_MIDDLE, color: string = 'grey', showCoord: boolean = true ): void {
        if ( this.context2D !== null ) {
            this.context2D.save();
            this.context2D.fillStyle = color;
            this.context2D.beginPath();
            this.context2D.rect( x, y, width, height );
            this.context2D.fill();
            if ( title.length !== 0 ) {
                let rect: Rectangle = this.calcLocalTextRectangle( layout, title, width, height );
                console.log('rect', rect)
                this.fillText( title, x + rect.origin.x, y + rect.origin.y, 'white', 'left', 'top' /*, '10px sans-serif'*/ );
                this.strokeRect( x + rect.origin.x, y + rect.origin.y, rect.size.width, rect.size.height, 'rgba( 0 , 0 , 0 , 0.5 ) ' );
                this.fillCircle( x + rect.origin.x, y + rect.origin.y, 2 );
            }
            if ( showCoord ) {
                this.strokeCoord( x, y, width + 20, height + 20 );
                this.fillCircle( x, y, 3 );
            }
    
            this.context2D.restore();
        }
    }
    public fillLocalRectWithTitle (width: number, height: number, title: string = '', referencePt:ELayout = ELayout.CENTER_MIDDLE, layout:ELayout= ELayout.CENTER_MIDDLE, color:string='gray', showCoord: boolean = true) :void {
        if (this.context2D !== null) {
            let x: number = 0;
            let y: number = 0;
            switch (referencePt) {
                case ELayout.LEFT_TOP:
                    x = 0;
                    y = 0;
                    break;
                case ELayout.LEFT_MIDDLE:
                    x = 0;
                    y = -height / 2;
                    break;
                case ELayout.LEFT_BOTTOM:
                    x = 0;
                    y = -height;
                    break;
                case ELayout.RIGHT_TOP:
                    x = - width;
                    y = 0;
                    break;
                case ELayout.RIGHT_MIDDLE:
                    x = - width;
                    y = - height * 0.5;
                    break;
                case ELayout.RIGHT_BOTTOM:
                    x = - width;
                    y = - height;
                    break;
                case ELayout.CENTER_TOP:
                    x = - width * 0.5;
                    y = 0;
                    break;
                case ELayout.CENTER_MIDDLE:
                    x = - width * 0.5;
                    y = -height * 0.5;
                    break;
                case ELayout.CENTER_BOTTOM:
                    x = - width * 0.5;
                    y = -height;
                    break;
            }
            this.context2D.save()
            this.context2D.fillStyle = color
            this.context2D.beginPath()
            this.context2D.rect(x, y, width, height)
            this.context2D.fill()
            if (title.length !== 0) {
                let rect: Rectangle = this.calcLocalTextRectangle(layout, title, width, height)
                this.fillText(title, x + rect.origin.x, y + rect.origin.y, 'white', 'left', 'top')
                this.strokeRect(x+ rect.origin.x, y + rect.origin.y, rect.size.width, rect.size.height, 'rgba(0,0,0,.5)')
                this.fillCircle(x + rect.origin.x, y + rect.origin.y, 2)
            }
            if (showCoord) {
                this.strokeCoord(0, 0, width + 20, height + 20)
                this.fillCircle(0,0,3)
            }
            this.context2D.restore()
        }
    }
    public rotateTranslate (degree:number, layout: ELayout = ELayout.LEFT_TOP, width: number = 40, height: number = 20) {
        if (this.context2D === null) {
            return
        }
        let radians:number = Math2D.toRadian(degree)
        this.context2D.save()
        this.context2D.rotate(radians)
        this.context2D.translate(this.canvas.width * 0.5, this.canvas.height * 0.5)
        this.fillLocalRectWithTitle(width, height, '', layout)
        this.context2D.restore()
    }
    public testFillLocalRectWithTitle () : void {
        this.rotateTranslate(0, ELayout.LEFT_TOP);
        this.rotateTranslate(10, ELayout.LEFT_MIDDLE);
        this.rotateTranslate(20, ELayout.LEFT_BOTTOM);
        this.rotateTranslate(30, ELayout.CENTER_TOP);
        this.rotateTranslate(40, ELayout.CENTER_MIDDLE);
        this.rotateTranslate(-10, ELayout.CENTER_BOTTOM);
        this.rotateTranslate(-20, ELayout.RIGHT_TOP);
        this.rotateTranslate(-30, ELayout.RIGHT_MIDDLE);
        this.rotateTranslate(-40, ELayout.RIGHT_BOTTOM);
        let distance:number = this.distance(0,0, this.canvas.width * 0.5, this.canvas.height*0.5)
        this.strokeCircle(0, 0, distance, 'black')
    }
    public strokeRect ( x: number, y: number, w: number, h: number, color: string = 'black' ): void {
        if ( this.context2D !== null ) {
            this.context2D.save();
            this.context2D.strokeStyle = color;
            this.context2D.beginPath();
            this.context2D.moveTo( x, y );
            this.context2D.lineTo( x + w, y );
            this.context2D.lineTo( x + w, y + h );
            this.context2D.lineTo( x, y + h );
            this.context2D.closePath();
            this.context2D.stroke();
            this.context2D.restore();
        }
    }
    // 将 fillLocalRectWithTitle 函数进行变换，去掉referece改为矩形尺寸的比例关系
    public fillLocalRectWithTitleUV (width: number, height:number, title: string = '', u: number, v: number, layout: ELayout = ELayout.CENTER_MIDDLE, color: string = 'grey', showCoord: boolean = true) :void {
        if (this.context2D !== null) {
            let x: number = -width * u;
            let y: number = -height * v;
            this.context2D.save()
            this.context2D.fillStyle = color
            this.context2D.beginPath()
            this.context2D.rect(x, y, width, height)
            this.context2D.fill()
            if (title.length !== 0) {
                let rect: Rectangle = this.calcLocalTextRectangle(ELayout.CENTER_MIDDLE, title, width, height)
                this.fillText(title, rect.origin.x + x, rect.origin.y + y, 'white', 'left', 'top')
                this.strokeRect(x+ rect.origin.x, y + rect.origin.y, rect.size.width, rect.size.height, 'rgba(0,0,0,.5)')
                this.fillCircle(x + rect.origin.x, y + rect.origin.y, 2)
            }
            if (showCoord) {
                this.strokeCoord(0, 0, width + 20, height + 20)
                this.fillCircle(0, 0, 3)
            }
            this.context2D.restore()
        }
    }
    public translateRotateTranslateDrawRect (degree: number, u: number = 0, v: number = 0, radius: number = 200, width: number = 40, height: number = 40) : void {
        if (this.context2D === null) {
            return;
        }
        let radians:number = Math2D.toRadian(degree)
        this.context2D.save()
        this.context2D.translate(this.canvas.width * 0.5, this.canvas.height * 0.5)
        this.context2D.rotate(radians)
        this.context2D.translate(radius, 0)
        this.fillLocalRectWithTitleUV(width, height, '', u, v)
        this.context2D.restore()
    }
    public testTranslateRotateTranslateDrawRect () : void {
        if (this.context2D === null) {
            return
        }
        let radius: number = 200
        let steps: number = 18 // 180 / 10
        // 一二象限v参数不变 顺时针 右下，左下
        for (let i = 0; i < steps; i++) {
            let n = i / steps
            this.translateRotateTranslateDrawRect(i * 10, n, 0, radius)
        }
        // 三四象限u 不变 逆时针
        for (let i = 0; i < steps; i++) {
            let n = i / steps
            this.translateRotateTranslateDrawRect(-i * 10, 0, n, radius)
        }
    }
    public draw4Quadarnt () : void {
        if (this.context2D === null) {
            return
        }
        this.context2D.save()
        this.fillText('第一象限', this.canvas.width, this.canvas.height,'rgba(0,0,255, .5)', 'right', 'bottom')
        this.fillText('第二象限', 0, this.canvas.height, 'rgba(0, 0, 255, .5)', 'left', 'bottom')
        this.fillText('第三象限', 0, 0, 'rgba(0,0,255,.5)', 'left', 'top')
        this.fillText('第四象限', this.canvas.width, 0, 'rgba(0, 0, 255, .5)', 'right', 'top')
        this.context2D.restore()
    }
    public drawTank () : void {
        this._Tank.draw(this)
    }
    public drawTriangle (x0:number, y0:number, x1:number, y1:number, x2:number, y2:number, stroke:boolean = true) : void {
        if (this.context2D !== null) {
            this.context2D.save()
            this.context2D.lineWidth = 3
            this.context2D.beginPath()
            this.context2D.moveTo(x0, y0)
            this.context2D.lineTo(x1,y1)
            this.context2D.lineTo(x2,y2)
            this.context2D.closePath()
            if (stroke) {
                this.context2D.stroke()
            } else {
                this.context2D.fill()
            }
            this.fillCircle(x2, y2, 5)
            this.context2D.restore()
        }
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

app.start()
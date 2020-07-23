import {TestApplication} from './index'
import { CanvasMouseEvent, CanvasKeyBoardEvent } from './application';
import { Math2D } from './math2d';
export class Tank {
    public width: number = 80;
    public height: number = 50;
    // 初始位置
    public x: number = 100;
    public y: number = 100;
    // 默认缩放
    public scaleX:number = 1;
    public scaleY:number = 1;
   
    // 旋转角度
    public tankRotation: number= 0
    public turrectRotaion: number = 0 // 炮管的旋转角度
    // 坦克的初始方向
    public initYAxis: boolean = true
    public showLine: boolean = false 
    public showCoord: boolean = false
    public gunLength: number = Math.max(this.width, this.height)
    public gunMuzzleRadius: number = 5

    private targetX:number = 0 // 目标点坐标
    private targetY:number = 0 // 目标点坐标
    public turretRotateSpeed:number = Math2D.toRadian(2)

    public linearSpeed: number = 100

    constructor () {
        if (this.initYAxis) {
            this.tankRotation = Math.PI * 0.5
        }
    }

    public draw (app: TestApplication) {
        if (app.context2D === null) {
            return
        }
        app.context2D.save()
        app.context2D.translate(this.x, this.y)
        app.context2D.rotate(this.tankRotation)
        // app.context2D.rotate(this.initYAxis ? (this.tankRotation + Math.PI * 0.5) : this.tankRotation)
        app.context2D.scale(this.scaleX, this.scaleY)
            // 绘制坦克的底盘
            app.context2D.save()
            app.context2D.fillStyle = 'grey'
            app.context2D.beginPath()
            // if (this.initYAxis) {
            //     app.context2D.rect(this.height * -0.5, this.width * -0.5, this.height, this.width)
            // } else {
            //     app.context2D.rect(this.width * -0.5, this.height * -0.5, this.width, this.height)
            // }
            app.context2D.rect(this.width * -0.5, this.height * -0.5, this.width, this.height)
            app.context2D.fill()
            app.context2D.restore()
            // 绘制炮塔
            app.context2D.save()
                app.context2D.rotate(this.turrectRotaion)
                app.context2D.save()
                app.context2D.fillStyle = 'red'
                app.context2D.beginPath()
                // if (this.initYAxis) {
                //     app.context2D.ellipse(0, 0, 10, 15, 0, 0, Math.PI * 2)
                // } else {
                //     app.context2D.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2)
                // }
                app.context2D.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2)
                app.context2D.fill()
                app.context2D.restore()
                // 绘制炮管
                app.context2D.save()
                app.context2D.strokeStyle = 'blue'
                app.context2D.lineWidth = 5
                app.context2D.lineCap = 'round'
                app.context2D.beginPath()
                app.context2D.moveTo(0,0)
                // if (this.initYAxis) {
                //     app.context2D.lineTo(0, this.gunLength)
                // } else {
                //     app.context2D.lineTo(this.gunLength, 0)
                // }
                app.context2D.lineTo(this.gunLength, 0)
                app.context2D.stroke()
                // 炮口
                // if (this.initYAxis) {
                //     app.context2D.translate(0, this.gunLength)
                //     app.context2D.translate(0, this.gunMuzzleRadius)
                // } else {
                //     app.context2D.translate(this.gunLength, 0)
                //     app.context2D.translate(this.gunMuzzleRadius, 0)
                // }
                app.context2D.translate(this.gunLength, 0)
                app.context2D.translate(this.gunMuzzleRadius, 0)
                app.fillCircle(0, 0, 10, 'green')
                app.context2D.restore()
            app.context2D.restore()
        if (this.showCoord) {
            app.context2D.save()
            app.context2D.lineWidth = 1
            // app.context2D.lineCap = ' '
            app.strokeCoord(0, 0, this.width*1.2, this.height*1.2)
            app.context2D.restore()
        }
        app.context2D.restore()
    }

    public onMouseMove (evt: CanvasMouseEvent):void {
        this.targetX = evt.canvasPosition.x
        this.targetY = evt.canvasPosition.y
        this._lookAt()
    }

    public onKeyPress (evt: CanvasKeyBoardEvent) : void {
        if (evt.key === 'r') {
            this.turrectRotaion += this.turretRotateSpeed
        } else if (evt.key === 't') {
            this.turrectRotaion = 0
        } else if (evt.key === 'e') {
            this.turrectRotaion -= this.turretRotateSpeed
        }
    }

    private _lookAt () {
        let distanceX: number = this.targetX - this.x 
        let distanceY: number = this.targetY - this.y
        let radian:number = Math.atan2(distanceY, distanceX)
        this.tankRotation = radian
    }

    private _moveTowardTo (intervalSec:number):void {
        let diffX:number = this.targetX - this.x 
        let diffY:number = this.targetY - this.y 
        let curSpeed:number = this.linearSpeed * intervalSec // 单位间隔运行距离
        if ((diffX * diffX + diffY * diffY) > curSpeed * curSpeed) {
            this.x = this.x + Math.cos(this.tankRotation) * curSpeed
            this.y = this.y + Math.sin(this.tankRotation) * curSpeed
        }
    }
    public update (intervalSec: number) :void {
        this._moveTowardTo(intervalSec)
    }
}
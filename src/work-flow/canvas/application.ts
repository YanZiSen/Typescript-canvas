/**
 * 定义application 基类
 */
import {vec2} from './math2d'

export class CanvasInputEvent {
    public ctrlKey:boolean = false
    public shiftKey:boolean = false
    public altKey:boolean = false
    public type: EInputEventType

    public constructor (ctrlKey:boolean = false, shiftKey:boolean = false, altKey:boolean = false, type: EInputEventType = EInputEventType.MOUSEEVENT) {
        this.shiftKey = shiftKey
        this.altKey = altKey
        this.altKey = altKey
        this.type = type
    }
}

export class CanvasMouseEvent extends CanvasInputEvent {
    public button: number;
    public canvasPosition: vec2;
    public localPosition: vec2;

    public constructor (type: EInputEventType, canvasPos: vec2, button: number, ctrlKey: boolean = false, altKey: boolean = false, shiftKey: boolean = false) {
        super(ctrlKey, shiftKey, altKey, type)
        this.canvasPosition = canvasPos
        this.button = button
        this.localPosition = vec2.create()
    }
}

export class CanvasKeyBoardEvent extends CanvasInputEvent {
    public key: string // 按下的字符串
    public keyCode: number // 按下的字符的ASCII 码
    public repeat: boolean // 当前按下的键是否不停的触发操作

    public constructor (type: EInputEventType, key: string, keyCode: number, repeat:boolean, ctrlKey: boolean, shiftKey:boolean, altKey:boolean) {
        super(ctrlKey, shiftKey, altKey, type) 
        this.key = key
        this.keyCode = keyCode
        this.repeat = repeat   
    }   
}

export enum EInputEventType {
    MOUSEEVENT, // 总类，表示鼠标事件
    MOUSEDOWN, // 鼠标按下事件
   
    MOUSEUP, // 鼠标抬起事件
    MOUSEDRAG, // 鼠标拖动事件
    MOUSEMOVE, // 鼠标移动事件
    KEYBOARDEVENT, // 键盘输入事件
    KEYUP, // 键盘抬起事件
    KEYDOWN, // 键盘按下事件
    KEYPRESS, // 按键事件

}

export class Application implements EventListenerObject{
    // _start 成员变量用于标记当前Application是否进入不间断地循环状态
    protected _start : boolean = false;
    // Windows 对象 requestAnimationFrame 返回的大于0的id号
    protected _requestId : number = -1;
    // 级元时间的物理更新， 这些成员变量烈性前面使用了！， 可以进行延迟复制操作
    protected _lastTime !: number;
    protected _startTime !: number;
    protected canvas: HTMLCanvasElement;

    public isSupportMouseMove: boolean;
    protected _isMouseDown: boolean;

    public timers:Timer [] = []
    private _timeId: number = -1

    public constructor (canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.isSupportMouseMove = false
        this._isMouseDown = false
        this.canvas.addEventListener('mousedown', this, false)
        this.canvas.addEventListener('mouseup', this, false)
        this.canvas.addEventListener('mousemove', this, false)

        window.addEventListener('keydown', this, false)
        window.addEventListener('keyup', this, false)
        window.addEventListener('keypress', this, false)

    }
    public start () :void {
        if (!this._start) {
            this._start = true
            this._requestId = -1;
            this._lastTime = -1;
            this._startTime = -1;
            this._requestId = requestAnimationFrame((elapsedMsed: number):void => {
                this.step(elapsedMsed)
            })
        }
    }
    public stop () :void {
        if (this._start) {
            cancelAnimationFrame(this._requestId)
            this._start = false
            this._requestId = -1
            this._lastTime = -1
            this._startTime = -1
            this._start = false
        }
    }
    public isRunning () : boolean {
        return this._start
    }
    public step (timeStamp:number) :void {
        if (this._startTime === -1) this._startTime = timeStamp
        if (this._lastTime === -1) this._lastTime = timeStamp
         
        let elapsedMsec = timeStamp - this._startTime
        let intervalSec = (timeStamp - this._lastTime) / 1000

        this._lastTime = timeStamp

        this.update(elapsedMsec, intervalSec)
        this.render()
        this._handlerTimers(intervalSec)

        this._requestId = requestAnimationFrame((elapsedMesc:number /* 当前被调用时间 */):void => {
            this.step(elapsedMesc)
        })
    }

    /**
     * 状态更新函数
     * @param elapsedMesc 据开始程序开始运行的时间差
     * @param intervalSec 每次更新的间隔时间
     */
    public update (elapsedMesc: number, intervalSec: number):void {}
    public render ():void {}

    // 将视图坐标转为canvas坐标
    private _viewportToCanvasCoordinate (evt: MouseEvent) :vec2 {
        if (this.canvas) {
            let rect:ClientRect = this.canvas.getBoundingClientRect();
            // 作为测试，每次mousedown时，打印出当前canvas的boundClientRect的位置尺寸
            if (evt.type === 'mousedown') {
                console.log('boundingClientRect: ' + JSON.stringify(rect))
                console.log('clientX:' + evt.clientX + 'clientY:' + evt.clientY)
            }
            if (evt.target) {
                let borderLeftWidth:number = 0;
                let borderTopWidth: number = 0;
                let paddingTop: number = 0;
                let paddingLeft: number = 0;
                let decl:CSSStyleDeclaration = getComputedStyle(evt.target as HTMLElement)
                
                if (decl.borderLeftWidth) {
                    borderLeftWidth = parseInt(decl.borderLeftWidth, 10)
                }
                if (decl.borderTopWidth) {
                    borderTopWidth = parseInt(decl.borderTopWidth, 10)
                }
                if (decl.paddingTop) {
                    paddingTop = parseInt(decl.paddingTop, 10)
                }
                if (decl.paddingLeft) {
                    paddingTop = parseInt(decl.paddingLeft, 10)
                }

                let x: number = evt.clientX - rect.left - borderLeftWidth - paddingLeft
                let y: number = evt.clientY - rect.top - borderTopWidth - paddingTop
                return vec2.create(x, y)
            }
            alert('this.canvas 为null')
            throw new Error('未找到canvas元素')
        }
        alert('this.canvas 为null')
        throw new Error('未找到canvas元素')
    }
    private _toCanvasMouseEvent (evt: Event, type: EInputEventType) : CanvasMouseEvent {
        let event: MouseEvent = evt as MouseEvent
        let mousePosition: vec2 = this._viewportToCanvasCoordinate(event)
        let canvasMouseEvent = new CanvasMouseEvent(type, mousePosition, event.button, event.ctrlKey, event.altKey, event.shiftKey)
        return canvasMouseEvent
    } 
    private _toCanvasKeyboardEvent (evt: Event, type: EInputEventType) : CanvasKeyBoardEvent {
        let event: KeyboardEvent = evt as KeyboardEvent
        let canvasKeyBoardEvent = new CanvasKeyBoardEvent(type, event.key, event.keyCode, event.repeat, event.ctrlKey, event.shiftKey, event.altKey)
        return canvasKeyBoardEvent
    }
    handleEvent (evt: Event) :void {
        switch (evt.type) {
            case 'mousedown':
                this._isMouseDown = true;
                this.dispatchMouseDown(this._toCanvasMouseEvent(evt, EInputEventType.MOUSEDOWN))
                break;
            case 'mouseup':
                this._isMouseDown = false;
                this.dispatchMouseUp(this._toCanvasMouseEvent(evt, EInputEventType.MOUSEUP))
                break;
            case 'mousemove':
                if (this.isSupportMouseMove) {
                    this.dispatchMouseMove(this._toCanvasMouseEvent(evt, EInputEventType.MOUSEMOVE))
                }
                if (this._isMouseDown) {
                    this.dispatchMouseDrag(this._toCanvasMouseEvent(evt, EInputEventType.MOUSEDRAG))
                }
                break;
            case 'keydown':
                this.dispatchKeydown(this._toCanvasKeyboardEvent(evt, EInputEventType.KEYDOWN))
                break;
            case 'keyup':
                this.dispatchKeyUp(this._toCanvasKeyboardEvent(evt, EInputEventType.KEYUP))
                break;
            case 'keypress':
                this.dispatchKeypress(this._toCanvasKeyboardEvent(evt, EInputEventType.KEYPRESS))
                break;

        }
    }
    protected dispatchMouseDown (evt: CanvasMouseEvent) :void {
        return 
    }
    protected dispatchMouseUp (evt: CanvasMouseEvent) :void {
        return 
    }
    protected dispatchMouseMove (evt: CanvasMouseEvent) :void {

    }
    protected dispatchMouseDrag (evt: CanvasMouseEvent) :void {

    }
    protected dispatchKeydown (evt: CanvasKeyBoardEvent) :void {

    }
    protected dispatchKeyUp (evt: CanvasKeyBoardEvent) :void {

    }
    protected dispatchKeypress (evt: CanvasKeyBoardEvent) :void {

    }
    public removeTimer (id: number) :boolean {
        let found:boolean = false
        this.timers.forEach((timer: Timer) => {
            if (timer.id === id) {
                timer.enabled = false
                found = true
            }
        })
        return found
    }
    public addTimer (callback: TimerCallback, timeout: number = 1.0, onlyOnce: boolean = false, data: any = undefined) :number {
        let timer:Timer
        let found:boolean = false

        for (let i = 0; i < this.timers.length; i++) {
            let timer: Timer = this.timers[i]
            if (timer.enabled === false) {
                found = true
                timer.callback = callback
                timer.enabled = true
                timer.callbackData = data
                timer.onlyOnce = onlyOnce
                return timer.id
            }
        }
        timer = new Timer(callback)
        timer.id = ++this._timeId
        timer.onlyOnce = onlyOnce
        timer.enabled = true
        timer.callbackData = data
        timer.timeout = timeout
        timer.countdown = timeout
        this.timers.push(timer)
        return timer.id
    }
    private _handlerTimers (intervalSec: number) {
        for (let i = 0; i < this.timers.length; i++) {
            let timer: Timer = this.timers[i]
            if (timer.enabled === false) {
                continue
            }
            timer.countdown = timer.countdown - intervalSec
            if (timer.countdown < 0.0) {
                timer.callback(timer.id, timer.callbackData)
                if (timer.onlyOnce === false) {
                    timer.countdown = timer.timeout
                }  else {
                    this.removeTimer(timer.id)
                }
            }
        }
    }
}

export class Canvas2dApplication extends Application {
    public context2D: CanvasRenderingContext2D | null
    public constructor (canvas: HTMLCanvasElement) {
        super(canvas)
        this.context2D = this.canvas.getContext('2d')
    }
}

export type TimerCallback = (id: number, data: any) => void

class Timer {
    public id: number = -1
    public enabled: boolean = true
    public callback: TimerCallback
    public callbackData: any
    public onlyOnce: boolean = false
    public timeout: number = 0
    public countdown: number = 0

    constructor (callback: TimerCallback) {
        this.callback = callback
    }
}
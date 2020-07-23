import { Canvas2dApplication, CanvasMouseEvent,CanvasKeyBoardEvent } from "./application";
import {IDispatcher} from './interface'
export class Sprite2DApplication extends Canvas2dApplication {
    protected _dispatcher: IDispatcher
    // public get rootContainer () : ISpiteContainer {
    //     return this._dispatcher.container
    // }
    public update (msec: number, diff: number) :void {
        this._dispatcher.dispatchUpdate(msec, diff)
    }
    public render () : void {
        if (this.context2D !== null) {
            this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this._dispatcher.dispatchDraw(this.context2D)
        }
    }
    protected dispatchMouseDown (evt: CanvasMouseEvent) :void {
        super.dispatchMouseDown(evt)
        this._dispatcher.dispatchMouseEvent(evt)
    }
    protected dispatchMouseUp (evt: CanvasMouseEvent) :void {
        super.dispatchMouseUp(evt)
        this._dispatcher.dispatchMouseEvent(evt)
    }
    protected dispatchMouseMove (evt: CanvasMouseEvent) : void {
        super.dispatchMouseUp(evt)
        this._dispatcher.dispatchMouseEvent(evt)
    }
}
import {Application} from './application'

import {CanvasKeyBoardEvent, CanvasMouseEvent} from './application'
// ApplicationTest继承并扩展了Application基类

export class ApplicationTest extends Application {
    constructor (canvas: HTMLCanvasElement) {
        super(canvas)
    }

    protected dispatchKeydown (evt: CanvasKeyBoardEvent) :void {
        console.log(`
            keyCode: ${evt.keyCode}
            key: ${evt.key}
        `)
    }

    protected dispatchMouseDown (evt: CanvasMouseEvent) :void {
        console.log(`
            canvasPosition: ${evt.canvasPosition}
        `)
    }
    public update (elapseMesc:number, intervalSec: number): void {
        console.log('elapseMesc', elapseMesc, 'intervalSec', intervalSec)
    }

    public render () {
        console.log('render')
    }
}
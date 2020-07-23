import { Canvas2DApplication, CanvasMouseEvent, CanvasKeyBoardEvent } from "../application";
import {ISpriteContainer, IDispatcher, AddLinkEventHandler } from "./interface";
import { Sprite2DManager} from "./sprite2dSystem" ;

// interface Sprite2dConfig {
//     addLinkCallback ?: addLinkEventHandler
// }
// 继承于Canvas2DApplication 类 引用Sprite2D管理类
export class Sprite2DApplication extends Canvas2DApplication {
    protected _dispatcher : IDispatcher ;

    public constructor ( canvas : HTMLCanvasElement , isHierarchical : boolean = true ) {
        document . oncontextmenu = function ( ) {
            return false ;
        }
        super( canvas );
        {
            this . _dispatcher =  new Sprite2DManager ( ) ;
            // if (config) {
            //     this. _dispatcher.addLinkEvent = config.addLinkCallback
            // }
        }
    }

    public get rootContainer ( ) : ISpriteContainer {
        return this . _dispatcher . container ;
    } 

    // 状态更新逻辑
    public update ( msec : number , diff : number ): void {
        this . _dispatcher . dispatchUpdate ( msec , diff ) ;
    }

    // 每一帧渲染逻辑
    public render ( ) : void {
        if ( this . context2D ) {
            this . context2D . clearRect ( 0 , 0 , this . context2D . canvas . width , this . context2D . canvas . height ) ;
            this . drawGrids()
            this . _dispatcher . dispatchDraw ( this . context2D ) ;
        }
    }

    public drawGrids () :void {
        if (this.context2D !== null ) {
            let step = 10
            this.context2D.save()
            this.context2D.fillStyle = '#fff'
            this.context2D.strokeStyle = 'rgba(0,0,0,0.1)'
            this.context2D.lineWidth = 1

            this.context2D.fillRect(0, 0, this.canvas.width, this.canvas.height)
            this.context2D.beginPath() // 一定要有beginPath
            for (let i = 0; i < this.canvas.width / 10; i++) {
                this.context2D.moveTo(step * i, 0)
                this.context2D.lineTo(step * i, this.canvas.height)
            }
            for (let i = 0; i < this.canvas.height / 10; i++) {
                this.context2D.moveTo(0, i * step)
                this.context2D.lineTo(this.canvas.width, i * step)
            }
            this.context2D.stroke()
            this.context2D.restore()
        }
    }

    protected dispatchMouseDown ( evt : CanvasMouseEvent ) : void{
        super . dispatchMouseDown ( evt ) ;
        this . _dispatcher . dispatchMouseEvent ( evt ) ;
    }

    protected dispatchMouseUp( evt : CanvasMouseEvent ) : void {
        super . dispatchMouseUp ( evt ) ;
        this . _dispatcher . dispatchMouseEvent ( evt ) ;
    }

    protected dispatchMouseMove ( evt : CanvasMouseEvent ) : void {
        super . dispatchMouseMove ( evt ) ;
        this . _dispatcher . dispatchMouseEvent ( evt ) ;
    }

    protected dispatchMouseDrag ( evt : CanvasMouseEvent ) : void {
        super . dispatchMouseDrag ( evt ) ;
        this . _dispatcher . dispatchMouseEvent ( evt ) ;
    }

    protected dispatchMouseClick ( evt : CanvasMouseEvent ) : void {
        super . dispatchMouseDrag ( evt ) ;
        this . _dispatcher . dispatchMouseEvent ( evt ) ;
    }

    protected dispatchMouseDBClick ( evt : CanvasMouseEvent ) : void {
        super . dispatchMouseDrag ( evt ) ;
        this . _dispatcher . dispatchMouseEvent ( evt ) ;
    }

    protected dispatchKeyDown ( evt : CanvasKeyBoardEvent ) : void {
        super . dispatchKeyDown ( evt ) ;
        this . _dispatcher . dispatchKeyEvent ( evt ) ;
    }

    protected dispatchKeyUp ( evt : CanvasKeyBoardEvent ) : void {
        super . dispatchKeyUp ( evt ) ;
        this . _dispatcher . dispatchKeyEvent ( evt ) ;
    }

    protected dispatchKeyPress ( evt : CanvasKeyBoardEvent ) : void {
        super . dispatchKeyPress ( evt ) ;
        this . _dispatcher . dispatchKeyEvent ( evt ) ;
    }
}


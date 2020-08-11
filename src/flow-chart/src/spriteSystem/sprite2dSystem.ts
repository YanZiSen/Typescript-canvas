import { CanvasMouseEvent, CanvasKeyBoardEvent, EInputEventType } from "../application";
import {ISpriteContainer,IDispatcher,ISprite,EOrder, IShape, FeaturePt, SpriteFactory, PtPos, AddLinkEventHandler, ActiveSprEventHandler, UnActiveSprEventHandler, ShapeType, LinkedEventHandler, ConcelActiveEventHandler, DeleteHandler} from "./interface";
import {mat2d,Math2D , vec2 } from "../math2d"
import { Sprite2D } from "./sprite2d";
import {Line, BaseShape2D} from './shapes'

export class Sprite2DManager implements ISpriteContainer , IDispatcher  {
    public name : string = 'sprite2dManager' ;
    private _sprites: ISprite [ ] = [ ] ;
    public addLinkEvent: AddLinkEventHandler | null = null;
    public activeSprEvent: ActiveSprEventHandler | null = null;
    public unActiveSprEvent: UnActiveSprEventHandler | null = null;
    public onLinkedEvent: LinkedEventHandler | null = null;
    public onDeleteEvent: DeleteHandler | null = null;
    public onConcelActiveEvent: ConcelActiveEventHandler | null = null;

    public addSprite ( sprite : ISprite  ) : ISpriteContainer {
        sprite . owner = this ;
        this . _sprites . push ( sprite ) ;
        if (sprite.shape.type === ShapeType.GRID || sprite.shape.type === ShapeType.LINE) {

        } else {
            this._sprites.forEach(spr => spr.active = false)
            sprite.active = true
            this.activeSprEvent && this.activeSprEvent(sprite)
        }
        return this ;
    }

    public removeSpriteAt ( idx : number ) : void {
        let sprite: ISprite = this . _sprites . splice( idx , 1 ) [0] ;
        if (sprite.shape.type === ShapeType.LINE) {
            let line: Line = sprite.shape as Line
            for (let i = 0; i < this._sprites.length; i++) {
                let s = this._sprites[i]
                let shape = s.shape 
                if (shape.data.outLines) {
                    let index = shape.data.outLines.findIndex((id: string) => id === line.id)
                    if (index > -1) {
                        shape.data.outLines.splice(index, 1)
                    }
                }
                if (shape.data.inputLines) {
                    let index = shape.data.inputLines.findIndex((id: string) => id === line.id)
                    if (index > -1) {
                        shape.data.inputLines.splice(index, 1)
                    }
                }
            }
        } else {
            let shape:IShape = sprite.shape 
            let {outLines, inputLines} = shape.data 
            if (outLines && outLines.length) {
                outLines.forEach((id: string) => {
                    this._sprites.forEach((s: ISprite) => {
                        if (s.shape.type === ShapeType.LINE) {
                            if (id === s.shape.id) {
                                s.shape.data.sourceId = undefined
                            }
                        }
                    })
                });
            }
            if (inputLines && inputLines.length) {
                inputLines.forEach((id: string) => {
                    this._sprites.forEach((s: ISprite) => {
                        if (s.shape.type === ShapeType.LINE) {
                            if (s.shape.id === id) {
                                s.shape.data.targetId = undefined
                            }
                        }
                    })
                })
            }
        }
    }
    
    public removeSprite ( sprite : ISprite ) : boolean {
        let idx = this . getSpriteIndex ( sprite ) ;
        if ( idx != -1 ) {
            this . removeSpriteAt ( idx ) ;
            return true ;
        }
        return false ;
    }

    public removeAll ( ) : void {
        this . _sprites = [ ] ;
    }

    public getSprite ( identifier : number|string ) : ISprite {
        if (typeof identifier === 'number') {
            if ( identifier < 0 || identifier > this . _sprites . length - 1 ) {
                throw new Error ( "参数idx越界!!" ) ;
            }
            return this . _sprites [ identifier ] ;
        }
        return this . _sprites.find(i => i.shape.id === identifier)
    }

    public getSpriteCount ( ) : number {
        return this . _sprites . length ;
    }

    public getSpriteIndex ( sprite: ISprite ): number {
        for ( let i = 0 ; i < this . _sprites . length ; i++ ) {
            if ( this . _sprites [ i ] === sprite ) {
                return i ;
            }
        }
        return -1 ;
    }

    public getTopSprite ( ) : ISprite | undefined {
        if (this.getSpriteCount() === 0) {
            return undefined
        }
        return this._sprites[this.getSpriteCount() - 1]
    }

    public getParentSprite ( ) : ISprite | undefined {
        return undefined ;
    }

    public getAllSprite () : Array<ISprite> {
        return this._sprites
    }

    public sprite : ISprite | undefined = undefined ;

    private _dragSprite : ISprite | undefined = undefined ;

    private _scaleSprite : ISprite | undefined = undefined ;

    private _startPoint : vec2 | undefined = undefined;
   
    public get container ( ) : ISpriteContainer {
        return this ;
    }

    public dispatchUpdate ( msec : number , diff : number ) : void {
        for ( let i = 0 ; i < this . _sprites . length ; i ++ ) {
            this . _sprites [ i ] . update ( msec , diff , EOrder . PREORDER ) ;
        }

        for ( let i = this . _sprites . length -1 ; i >= 0 ; i -- ) {
            this . _sprites [ i ] . update ( msec , diff , EOrder . POSTORDER ) ;
        }
    }

    public dispatchDraw ( context : CanvasRenderingContext2D ) : void {
        for ( let i = 0 ; i < this . _sprites . length ; i++ ) {
            this . _sprites [ i ] . draw ( context ) ;
        }
    }

    public dispatchKeyEvent ( evt : CanvasKeyBoardEvent ) : void {
        let spr: ISprite ;
        for ( let i = 0 ; i < this . _sprites . length ; i++ ) {
            spr = this . _sprites [ i ] ;
            if (evt.keyCode === 8 && spr.active) {
                this.onDeleteEvent && this.onDeleteEvent(spr)
                this.removeSpriteAt(i)
                break;
            }
            if ( spr . keyEvent ) {
                spr . keyEvent ( spr, evt ) ;
            }
        }
    }

    public dispatchMouseEvent ( evt : CanvasMouseEvent ) : void {
        if ( evt . type === EInputEventType . MOUSEUP ) {
            this . _dragSprite = undefined ;
            this . _scaleSprite = undefined ;
            if (this . _startPoint !== undefined) {
                let sprite:ISprite = this.getTopSprite()
                let line = sprite.shape as Line
                if (vec2.difference(line.start, line.end).length < 40) {
                    this.removeSpriteAt(this._sprites.length - 1)
                }
                for ( let i = this . _sprites . length - 1 ; i >= 0 ; i-- ) {
                    let spr = this . _sprites [ i ] ;
                    // 获取全局变换的逆矩阵
                    let mat : mat2d | null = spr . getLocalMatrix ( ) ;
                    // 获取相对于图形的局部坐标 将逆矩阵乘以向量
                    Math2D . transform ( mat , evt . canvasPosition , evt . localPosition ) ;
                    let capturePt:FeaturePt | null 
                    if (capturePt = spr.hitFeaturePoint(evt.localPosition, 20)) {
                        line.data.targetId = spr.shape.id
                        let lineIns = line as Line
                        lineIns.endPos = capturePt.pos
                        if (spr.shape.data.inputLines === undefined) {
                            spr.shape.data.inputLines = []
                        }
                        spr.shape.data.inputLines.push(line.id)
                        this.onLinkedEvent && this.onLinkedEvent(sprite)
                        this._sprites.forEach(spr => spr.active = false)
                        sprite.active = true 
                        this.activeSprEvent && this.activeSprEvent(sprite)
                        break;
                    }
                }
                this . _startPoint = undefined ;
                return
            }
            
        } else if (evt . type === EInputEventType . MOUSEDRAG) {
            if ( this . _dragSprite !== undefined ) {
                if ( this . _dragSprite . mouseEvent !== null ) {
                    this . _dragSprite . mouseEvent ( this . _dragSprite , evt ) ;
                    return ;
                }
            } else if ( this . _scaleSprite !== undefined ) {
                // 错误做法
                    // // 获取全局变换的逆矩阵
                    // let mat : mat2d | null = this . _scaleSprite . getLocalMatrix ( ) ;
                    // // 获取相对于图形的局部坐标 将逆矩阵乘以向量
                    // Math2D . transform ( mat , evt . canvasPosition , evt . localPosition ) ;  
                    // let y = vec2.dotProduct(evt.localPosition, new vec2(0, 1))
                    // let x = vec2.dotProduct(evt.localPosition, new vec2(1,0))
                    // let shape = this._scaleSprite.shape as any
                    // this._scaleSprite.scaleX = Math.abs(x) / shape.width * 0.5
                    // this._scaleSprite.scaleY = Math.abs(y) / shape.height * 0.5
                let mat : mat2d | null = this . _scaleSprite . getLocalMatrix ( ) ;
                // 获取相对于图形的局部坐标 将逆矩阵乘以向量
                Math2D . transform ( mat , evt . canvasPosition , evt . localPosition ) ;  
                let y = vec2.dotProduct(evt.localPosition, new vec2(0, 1))
                let x = vec2.dotProduct(evt.localPosition, new vec2(1,0))
                let shape = this._scaleSprite.shape as BaseShape2D
                let diffrentX = Math.abs(x) - shape.width * 0.5
                let diffrentY = Math.abs(y) - shape.height * 0.5
                this . _scaleSprite.scaleEvent(this._scaleSprite, diffrentX, diffrentY)
                return
            } else if (this._startPoint !== undefined) {
                let line:ISprite = this.getTopSprite()
                let shape = line.shape as Line

                for ( let i = this . _sprites . length - 1 ; i >= 0 ; i-- ) {
                    let spr = this . _sprites [ i ] ;
                    // 获取全局变换的逆矩阵
                    let mat : mat2d | null = spr . getLocalMatrix ( ) ;
                    // 获取相对于图形的局部坐标 将逆矩阵乘以向量
                    Math2D . transform ( mat , evt . canvasPosition , evt . localPosition ) ;
                    let capturePt:FeaturePt | null 
                    if (capturePt = spr.hitFeaturePoint(evt.localPosition, 20)) {
                        console.log('cash---------')
                        let mat : mat2d | null = spr . getWorldMatrix ( ) ;
                        let vec2Pt : vec2 = new vec2(capturePt.centerX, capturePt.centerY)
                        Math2D . transform ( mat , vec2Pt , vec2Pt ) ;  
                        shape.end = vec2Pt
                        return
                    }
                }
                shape.end = evt.canvasPosition
                return
            }
        }

        let spr : ISprite ;
        let startPoint: FeaturePt | null
        for ( let i = this . _sprites . length - 1 ; i >= 0 ; i-- ) {
            spr = this . _sprites [ i ] ;
            // 获取全局变换的逆矩阵
            let mat : mat2d | null = spr . getLocalMatrix ( ) ;
            // 获取相对于图形的局部坐标 将逆矩阵乘以向量
            Math2D . transform ( mat , evt . canvasPosition , evt . localPosition ) ;

            if (this._startPoint !== undefined) {
                return
            }
            if (startPoint = spr.hitFeaturePoint(evt.localPosition, 6)) {
                let shapeSource: IShape = spr.shape
                let mat : mat2d | null = spr . getWorldMatrix ( ) ;
                let startPos = new vec2(startPoint.centerX, startPoint.centerY)
                Math2D . transform ( mat , startPos , startPos ) ;  
                this._startPoint = startPos
                let endPoint = vec2.copy(startPos)
                let line: IShape = SpriteFactory.createLine(startPos, endPoint)
                line.data.sourceId = shapeSource.id
                let lineIns = line as Line
                lineIns.startPos = startPoint.pos
                if (shapeSource.data.outLines === undefined) {
                    shapeSource.data.outLines = []
                }
                shapeSource.data.outLines.push(line.id)
                let sprite: ISprite = SpriteFactory.createSprite(line)
                this.addLinkEvent && this.addLinkEvent(sprite)
                this.addSprite(sprite)
                return
            }

            if (spr.hitHandlerTest(evt.localPosition)) {
                console.log(spr)
                this._scaleSprite = spr
                return
                // this._dragPos = evt.canvasPosition
                // dragmove 过程中获取缩放比例
            }

            // if (spr.hitLinkCircleTest(evt.localPosition)) {
            //     this._dragPos = evt.canvasPosition
            //     this._linkStart = spr
            //     // dragmove  过程中寻找检测
            // }

            if ( spr . hitTest ( evt . localPosition ) ) {
                evt . hasLocalPosition = true ;
                if ( evt . button === 0 && evt . type === EInputEventType . MOUSEDOWN) {

                    this . _dragSprite = spr ;
                } 

                if ( evt . type === EInputEventType . MOUSEDRAG ) {
                    return ;
                }
                if ( evt . type === EInputEventType . MOUSECLICK) {
                    spr.active = !spr.active
                    if (spr.active) {
                        this.activeSprEvent && this.activeSprEvent(spr)
                    } else {
                        this.unActiveSprEvent && this.unActiveSprEvent(spr)
                        this.onConcelActiveEvent && this.onConcelActiveEvent(spr)
                    }
                    this . _sprites . forEach((sprite: ISprite, idx: number) => {
                        if (i !== idx) {
                            // console.log('trigger', 'tailer', i, 'fonter', idx, spr, sprite)
                            sprite.active = false
                            this.unActiveSprEvent && this.unActiveSprEvent(sprite)
                        }
                    })
                }
                
                if ( spr . mouseEvent ) {
                    spr . mouseEvent ( spr , evt ) ;
                    return ;   // 只顶层元素事件触发
                }
            }  
        }
    }
}

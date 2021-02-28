import { Sprite2DApplication } from "./src/spriteSystem/sprite2DApplication"
import { IShape, SpriteFactory, ISprite, ERenderType, MouseEventHandler, ShapeType, PtPos} from "./src/spriteSystem/interface"
import { CanvasMouseEvent, EInputEventType } from "./src/application"
import { vec2 } from "./src/math2d"
import { Sprite2DManager } from "./src/spriteSystem/sprite2dSystem"
import { Sprite2D } from "./src/spriteSystem/sprite2d"
import { Line, Rect, Circle, Rhomb, Ladder, BaseShape2D } from "./src/spriteSystem/shapes"

interface AppConfig {
    onActive?: (spr: ISprite) => void;
    onCancelActive?: (spr: ISprite) => void;
    onDelete?: (spr: ISprite) => void;
    onAddShape?: () => void;
    onLinked?: (spr: ISprite) => void;
    stretchX?: (x: number) => void;
    stretchY?: (y: number) => void;
}


export class App implements EventListenerObject {
    canvas: HTMLCanvasElement
    _app: Sprite2DApplication
    config: AppConfig
    constructor (canvas: HTMLCanvasElement, config: AppConfig = {}) {
        let app = new Sprite2DApplication(canvas)
        this.canvas = canvas
        this.config = config
        this._app = app
        this._app.rootContainer.addLinkEvent = this.handleAddLink.bind(this)
        this._app.rootContainer.activeSprEvent = this.handleActiveSpr.bind(this)
        this._app.rootContainer.unActiveSprEvent = this.handleUnActiveSpr.bind(this)
        this._app.rootContainer.onConcelActiveEvent = this.handleConcelActiveSpr.bind(this)
        this._app.rootContainer.onLinkedEvent = this.handleLinkedSpr.bind(this)
        this._app.rootContainer.onDeleteEvent = this.handleDeleteSpr.bind(this)
        this.canvas.addEventListener('drop', this, false)
        this.canvas.addEventListener('dragenter', this, false)
        this.canvas.addEventListener('dragover', this, false)
        // this.addGrid()
        this._app.start()
    }
    handleConcelActiveSpr (spr:ISprite) {
        this.config.onCancelActive && this.config.onCancelActive(spr)
    }
    handleLinkedSpr (spr: ISprite) {
        this.config.onLinked && this.config.onLinked(spr)
    }
    addGrid () : void {
        let grid: IShape = SpriteFactory.createGrid(this.canvas.width, this.canvas.height, 10, 10)
        let gridSprite : ISprite = SpriteFactory.createSprite(grid, 'grid')
        gridSprite.strokeStyle = 'rgba(0, 0, 0, .1)'
        let rootContainer = this._app.rootContainer
        rootContainer.addSprite(gridSprite)
    }
    handleActiveSpr (sprite: ISprite) {
        this.config.onActive && this.config.onActive(sprite)
        if(sprite.shape.type === ShapeType.LINE) {
            sprite.strokeStyle = 'red'
        }
    }
    handleUnActiveSpr (sprite: ISprite) {
        if(sprite.shape.type === ShapeType.LINE) {
            sprite.strokeStyle = 'black'
        }
    }
    handleAddLink (sprite: ISprite) {
        sprite.mouseEvent = this.mouseEventHandler.bind(this)
    }
    handleDeleteSpr (sprite: ISprite) {
        this.config.onDelete && this.config.onDelete(sprite)
    }
    handleEvent (evt: Event) : void{
        // switch (evt.type) {
        //     case 'drop':
        //         let e = evt as DragEvent
        //         this.dispatchDrop(e)
        //         break;
        //     case 'dragenter':
        //         evt.preventDefault()
        //         break;
        //     case 'dragover':
        //         evt.preventDefault()
        //         break;
        // }
    }
    mouseEventHandler (s: ISprite, evt: CanvasMouseEvent) :void {
        if (s.shape.type === ShapeType.LINE) {
            return
        }
        if (evt.type === EInputEventType.MOUSEDOWN) { // MOUSEDOWN 和 MOUSEUP 不在同一个图形下触发就会有问题
            s.lineWidth = 3
        } else if (evt.type === EInputEventType.MOUSEUP) {
            s.lineWidth = 1
        } else if (evt.type === EInputEventType.MOUSEDRAG) {
            let shape: IShape = s.shape 
            let {inputLines, outLines} = shape.data
            if (inputLines) {
                let input: Line [] = []
                inputLines.forEach( (id: string) => {
                    let spr = this._app.rootContainer.getSprite(id)
                    let line = spr.shape as Line
                    input.push(line)
                })
                input.forEach(line => {
                    line.end.x += evt.canvasPosition.x - s.x 
                    line.end.y += evt.canvasPosition.y - s.y
                })
            } 
            if (outLines) {
                let out: Line [] = []
                outLines.forEach( (id: string) => {
                    let spr = this._app.rootContainer.getSprite(id)
                    let line = spr.shape as Line
                    out.push(line)
                })
                out.forEach(line => {
                    line.start.x += evt.canvasPosition.x - s.x 
                    line.start.y += evt.canvasPosition.y - s.y
                })
            }
            s.x = evt.canvasPosition.x
            s.y = evt.canvasPosition.y
            try {
                let cShape = s.shape as BaseShape2D
                let x = s.x  + cShape.width * 0.5 + 10 - this.canvas.width
                let y = s.y  + cShape.height * 0.5 + 10 - this.canvas.height
                if (x > 0) {
                    this.config.stretchX && this.config.stretchX(x)
                }
                if (y > 0) {
                    this.config.stretchY && this.config.stretchY(y)

                }
            } catch (e) {
                console.log('不能转为BaseShape2D类型')
            }
           
        }
    }
    scaleEventHandler (s: ISprite, diffrentX: number, diffrentY: number) : void {
        console.log(`differentX:${diffrentX}, differentY: ${diffrentY}`)
        let shape:IShape  = s.shape
        switch (shape.type) {
            case ShapeType.RECT:
            case ShapeType.CALCRECT:
            case ShapeType.CHILDRECT:
            case ShapeType.ROUNDRECT:
            case ShapeType.DIALOGRECT:
            case ShapeType.FULLROUNDRECT:
                let rect = shape as Rect
                console.log('rect.width', rect.width)
                rect.width += diffrentX * 2
                rect.height += diffrentY * 2
                break;
            case ShapeType.CIRCLE:
                let circle = shape as Circle
                circle.radius += diffrentX
                diffrentY = diffrentX
                break;
            case ShapeType.RHOMB:
                let rhomb = shape as Rhomb
                rhomb.points.forEach((point, i) => {
                    i === 0 ?
                        (point.values[1] -= diffrentX):
                    i === 1 ?
                        (point.values[0] += diffrentX):
                    i === 2 ?
                        (point.values[1] += diffrentX):
                        (point.values[0] -= diffrentX)

                })
                diffrentY = diffrentX
                break;
            case ShapeType.LADDER:
                let ladder = shape as Ladder
                ladder.points.forEach((point, i) => {
                    i === 0 ?
                        (point.values[0] -= diffrentX, point.values[1] -= diffrentY):
                    i === 1 ?
                        (point.values[0] -= diffrentX, point.values[1] -= diffrentY):
                    i === 2 ?
                        (point.values[0] += diffrentX, point.values[1] -= diffrentY):
                    i === 3 ?
                        (point.values[0] += diffrentX, point.values[1] -= diffrentY):
                    i === 4 ?
                        (point.values[0] += diffrentX, point.values[1] += diffrentY):
                        (point.values[0] -= diffrentX, point.values[1] += diffrentY)
                })
                break;
        }
        let {inputLines, outLines} = shape.data
        if (inputLines) {
            let input: Line [] = []
            inputLines.forEach( (id: string) => {
                let spr = this._app.rootContainer.getSprite(id)
                let line = spr.shape as Line
                input.push(line)
            })
            input.forEach(line => {
                console.log('line', line)
                switch (line.endPos) {
                    case PtPos.TOP: 
                        line.end.y -= diffrentY
                        break;
                    case PtPos.BOTTOM:
                        line.end.y += diffrentY
                        break;
                    case PtPos.LEFT:
                        line.end.x -= diffrentX
                        break;
                    case PtPos.RIGHT:
                        line.end.x += diffrentX
                }
            })
        } 
        if (outLines) {
            let out: Line [] = []
            outLines.forEach( (id: string) => {
                let spr = this._app.rootContainer.getSprite(id)
                let line = spr.shape as Line
                out.push(line)
            })
            out.forEach(line => {
                console.log('line', line)
                switch (line.startPos) {
                    case PtPos.TOP: 
                        line.start.y -= diffrentY
                        break;
                    case PtPos.BOTTOM:
                        line.start.y += diffrentY
                        break;
                    case PtPos.LEFT:
                        line.start.x -= diffrentX
                        break;
                    case PtPos.RIGHT:
                        line.start.x += diffrentX
                }
            })
        }
    }
    addShape (e: MouseEvent, type: ShapeType) : ISprite {
        // let transferData = JSON.parse(e.dataTransfer.getData('text'))
        let localPt = this._app._viewportToCanvasCoordinate(e)
        let shape: IShape, sprite: ISprite
        if (type === ShapeType.RECT) { // 信息表单
            shape = SpriteFactory.createRect(90, 60, 0.5, 0.5)
            sprite = SpriteFactory.createSprite(shape)
            sprite.text = '矩形'
        } else if (type === ShapeType.ROUNDRECT) { // 评分表单
            shape = SpriteFactory.createRoundRect(60, 60, 0.5, 0.5, 10)
            sprite = SpriteFactory.createSprite(shape)
            sprite.text = '矩形2'
        } else if (type === ShapeType.RHOMB) { // 决策框
            let points = [new vec2(0, -42), new vec2(42, 0), new vec2(0, 42), new vec2(-42, 0)]
            shape = SpriteFactory.createRhomb(points)
            sprite = SpriteFactory.createSprite(shape)
            sprite.text = '菱形'
        } else if (type === ShapeType.CALCRECT) { // 计算框
            shape = SpriteFactory.createCalcRect(60, 60, 0.5, 0.5)
            sprite = SpriteFactory.createSprite(shape)
            sprite.renderType = ERenderType.CUSTOM
            sprite.text = '矩形4'
        }  else if (type === ShapeType.CHILDRECT) { // 子流程
            shape = SpriteFactory.createChildRect(96, 60, 0.5, 0.5)
            sprite= SpriteFactory.createSprite(shape)
            sprite.text = '子流程'
        } else if (type === ShapeType.LADDER) { // 触发器
            let points = [
                new vec2(-42, -15), new vec2(-19, -30), new vec2(19, -30), new vec2(42, -15),
                new vec2(42, 30), new vec2(-42, 30)
            ]
            shape = SpriteFactory.createLadder(points)
            sprite = SpriteFactory.createSprite(shape)
            sprite.text = '梯形'
        } else if (type === ShapeType.FULLROUNDRECT) { // 结束框
            shape = SpriteFactory.createFullRoundRect(146, 60, 0.5, 0.5)
            sprite = SpriteFactory.createSprite(shape)
            sprite.text = '圆角矩形'
        } else if (type === ShapeType.DIALOGRECT) { // 对话框
            shape = SpriteFactory.createDialogRect(125, 60, 0.5, 0.5, 16)
            sprite = SpriteFactory.createSprite(shape)
            sprite.text = '矩形3'
        } else if (type === ShapeType.CIRCLE) {
            shape = SpriteFactory.createCircle(50)
            sprite = SpriteFactory.createSprite(shape)
            sprite.text = '圆形'
        }
        sprite.renderType = ERenderType.STROKE_FILL
        sprite.x = localPt.values[0]
        sprite.y = localPt.values[1]
        this._app.rootContainer.addSprite(sprite)
        sprite.mouseEvent = this.mouseEventHandler.bind(this)
        sprite.scaleEvent = this.scaleEventHandler.bind(this)
        return sprite
    }
    addShapeFromData (data: any) : ISprite {
        let shape: IShape, sprite: ISprite
        let type = data.type
        if (type === ShapeType.RECT) { // 信息表单
            shape = SpriteFactory.createRect(data.width, data.height, data.u, data.v)
            shape.id = data.id
            sprite = SpriteFactory.createSprite(shape)
        } else if (type === ShapeType.ROUNDRECT) { // 评分表单
            shape = SpriteFactory.createRoundRect(data.width, data.height, data.u, data.v)
            shape.id = data.id
            sprite = SpriteFactory.createSprite(shape)
        } else if (type === ShapeType.RHOMB) { // 决策框
            let points = data.points.map((points: any) => new vec2(points.values[0], points.values[1]))
            shape = SpriteFactory.createRhomb(points)
            shape.id = data.id
            sprite = SpriteFactory.createSprite(shape)
        } else if (type === ShapeType.CALCRECT) { // 计算框
            shape = SpriteFactory.createCalcRect(data.width, data.height, data.u, data.v)
            shape.id = data.id
            sprite = SpriteFactory.createSprite(shape)
            sprite.renderType = ERenderType.CUSTOM
        } else if (type === ShapeType.CHILDRECT) { // 子流程
            shape = SpriteFactory.createChildRect(data.width, data.height, data.u, data.v)
            shape.id = data.id
            sprite= SpriteFactory.createSprite(shape)
        } else if (type === ShapeType.LADDER) { // 触发器
            let points = data.points.map((points: any) => new vec2(points.values[0], points.values[1]))
            shape = SpriteFactory.createLadder(points)
            shape.id = data.id
            sprite = SpriteFactory.createSprite(shape)
        } else if (type === ShapeType.FULLROUNDRECT) { // 结束框
            shape = SpriteFactory.createFullRoundRect(data.width, data.height, data.u, data.v)
            shape.id = data.id
            sprite = SpriteFactory.createSprite(shape)
        } else if (type === ShapeType.DIALOGRECT) { // 对话框
            shape = SpriteFactory.createDialogRect(data.width, data.height, data.u, data.v, 16)
            shape.id = data.id
            sprite = SpriteFactory.createSprite(shape)
        } else if (type === ShapeType.CIRCLE) {
            shape = SpriteFactory.createCircle(data.radius)
            shape.id = data.id
            sprite = SpriteFactory.createSprite(shape)
        } else if (type === ShapeType.LINE) {
            shape = SpriteFactory.createLine(
                new vec2(data.start.values[0], data.start.values[1]), 
                new vec2(data.end.values[0], data.end.values[1])
            )
            let line = shape as Line
            line.startPos = data.startPos
            line.endPos = data.endPos
            shape.id = data.id
            sprite = SpriteFactory.createSprite(shape)
        }
        shape.data = data.data
        sprite.renderType = ERenderType.STROKE_FILL
        sprite.text = data.text
        sprite.x = data.transform.position.values[0]
        sprite.y = data.transform.position.values[1]
        this._app.rootContainer.addSprite(sprite)
        sprite.mouseEvent = this.mouseEventHandler.bind(this)
        sprite.scaleEvent = this.scaleEventHandler.bind(this)
        return sprite
    }
    getSprites () : Array<ISprite> {
        return this._app.rootContainer.getAllSprite()
    }
    removeAll () : void {
        this._app.rootContainer.removeAll(false)
    }
}
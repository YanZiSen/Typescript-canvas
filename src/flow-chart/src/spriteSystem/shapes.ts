import { IShape, ERenderType, ITransformable , IRenderState, Scale9Data , EImageFillType, FeaturePt , ShapeType, PtPos} from "./interface";
import { mat2d, Math2D , vec2, Rectangle , Size } from "../math2d"
import { ContextReplacementPlugin } from "webpack";
import { math2d } from "../../../application/math2d";

function generateUUID () {
    var d = new Date().getTime() + Math.random() * 210
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
}

type multiplePt = Array<vec2>

export abstract class  BaseShape2D implements IShape {
    public axisXStyle : string | CanvasGradient | CanvasPattern;
    public axisYStyle : string | CanvasGradient | CanvasPattern;
    public axisLineWidth : number;
    public axisLength : number ;
    public data : any ;
    public active: false;
    public id : string;
    abstract get width () : number;
    abstract get height () : number;

    public abstract get  type (): ShapeType ;
    public abstract hitTest ( localPt : vec2 , transform : ITransformable ) : boolean ;
    public abstract hitHandlerTest ( localPt: vec2, transform: ITransformable ) : boolean;
    public abstract hitFeaturePoint (localPt: vec2, precision: number) : FeaturePt | null;
  
    public constructor ( ) {
        this . axisXStyle = "rgba( 255 , 0 , 0 , 128 ) " ;
        this . axisYStyle = "rgba( 0 , 255 , 0 , 128 ) " ;
        this . axisLineWidth = 1 ;
        this . axisLength = 100 ;
        this . data = {} ;
        this . id = generateUUID();
    }

    protected drawLine ( ctx : CanvasRenderingContext2D , style : string | CanvasGradient | CanvasPattern , isAxisX : boolean = true ) {
        ctx  .save ( ) ;
        ctx . strokeStyle = style ;
        ctx . lineWidth = this . axisLineWidth ;
        ctx . beginPath ( ) ;
        ctx . moveTo( 0 , 0 ) ;
        if ( isAxisX ) {
            ctx . lineTo ( this . axisLength , 0 ) ;
        } else {
            ctx.lineTo( 0 , this . axisLength ) ;
        }
        ctx . stroke ( ) ;
        ctx . restore( ) ;
    }

    public beginDraw ( transformable: ITransformable, state : IRenderState , context: CanvasRenderingContext2D ): void {
        context . save ( ) ;
        context . lineWidth = state . lineWidth ;
        context . strokeStyle = state . strokeStyle ;
        context . fillStyle = state . fillStyle ;
        context . font = state . font;
        context . textAlign = state . textAlign;
        context . textBaseline = state . textBaseLine;
        let mat : mat2d = transformable . getWorldMatrix ( ) ;
        context . setTransform ( mat . values [ 0 ] , mat . values [ 1 ] , mat.values [ 2 ] , mat . values [ 3 ] , mat . values [ 4 ] , mat . values [ 5 ] ) ;
    }

    public draw ( transformable : ITransformable , state : IRenderState , context: CanvasRenderingContext2D, ): void {
        if ( state.renderType === ERenderType.STROKE ) {
            context.stroke();
        } else if ( state.renderType === ERenderType.FILL ) {
            context.fill();
        } else if ( state.renderType === ERenderType.STROKE_FILL ) {
            context.stroke();
            context.fill();
        } else if ( state . renderType === ERenderType . CLIP ) {
            context . clip ( ) ;
        }
        context.save()
        context.fillStyle = 'black'
        context.fillText(state.text, 0, 0)
        context.restore()
    }

    public drawHandler (context: CanvasRenderingContext2D) : void {

    }

    public endDraw ( transformable : ITransformable , state : IRenderState , context : CanvasRenderingContext2D ) : void {
        if ( state . renderType !== ERenderType . CLIP ) {
            if ( state . showCoordSystem ) {
               this . drawLine ( context , this . axisXStyle , true ) ;
               this . drawLine ( context , this . axisYStyle , false ) ;
            }
            context . restore ( ) ;
        }
    }
}

export class Circle extends BaseShape2D {
    public radius : number ;  

    public get featurePoints () : FeaturePt [] {
        return [
            {x: 0 - 4,y: -this.radius - 4, width: 8, height: 8, centerX: 0, centerY: -this.radius, pos: PtPos.TOP},
            {x: 0 - 4,y: this.radius - 4, width: 8, height: 8, centerX: 0, centerY: this.radius, pos: PtPos.BOTTOM},
            {x: this.radius - 4,y: 0 - 4, width: 8, height: 8, centerX: this.radius, centerY: 0, pos: PtPos.RIGHT},
            {x: -this.radius - 4,y: 0 - 4, width: 8, height: 8, centerX: -this.radius, centerY: 0, pos: PtPos.LEFT},
        ]
    }

    public get multiplePoints () : multiplePt {
        return [
            new vec2(-this.radius, -this.radius),
            new vec2(this.radius, -this.radius), 
            new vec2(this.radius, this.radius), 
            new vec2(-this.radius, this.radius)
        ]
    }

    get x () : number {
        return -this.radius
    }

    get y () : number {
        return -this.radius
    }

    get width () : number {
        return this.radius * 2
    }

    get height () : number {
        return this.radius * 2
    }

    public constructor ( radius: number = 1 ) {
        super ( ) ;
        this . radius = radius;
    }
    public hitTest ( localPt : vec2 , transform : ITransformable ): boolean {
        return Math2D . isPointInCircle ( localPt , vec2 . create ( 0, 0 ), this.radius ) ;
    }

    public draw ( transformable: ITransformable, state : IRenderState , context: CanvasRenderingContext2D, ): void {
        context.beginPath();
        context.arc( 0, 0, this.radius, 0.0, Math.PI * 2.0, true );
        super.draw( transformable, state , context );
    }

    public get type (): ShapeType {
        return ShapeType.CIRCLE;
    }

    public drawHandler (context: CanvasRenderingContext2D) : void {
        // 绘制操纵点
        context.save()
            context.beginPath()
            context.strokeStyle = 'rgba(255, 0, 0, .5)'
            context.lineWidth = 2
            context.rect(this.x, this.y, this.width, this.height)
            context.stroke()
        context.restore()

        this.multiplePoints.forEach(point => {
            context.beginPath()
            context.arc(point.values[0], point.values[1], 4, 0, Math.PI * 2)
            context.fill()
            context.stroke()
        })
        
        // 绘制特征点
        let points: FeaturePt [] = this.featurePoints
        context.beginPath()
        points.forEach(point => {
            context.rect(point.x, point.y, point.width, point.height)
        })
        context.fill()
        context.stroke()
    }
    public hitHandlerTest (localPt : vec2 ) : boolean {
        return this.multiplePoints.some(point => Math2D.isPointInCircle(localPt, point, 4))
    }
    public hitFeaturePoint (localPt : vec2, precision: number = 0) : FeaturePt|null {
        return this.featurePoints.find(point => Math2D.isPointInRect(
                localPt.x, localPt.y, 
                point.x - precision, point.y - precision, 
                point.width + precision, point.height + precision
            )
        )
    }
}

export class Ellipse extends BaseShape2D {
    public radiusX : number ;
    public radiusY : number ;
    public get width (): number {
        return this.radiusX * 2
    }
    public get height () : number {
        return this.radiusY * 2
    }
    public constructor ( radiusX : number = 10 , radiusY : number = 10 ) {
        super ( ) ;
        this . radiusX = radiusX ;
        this . radiusY = radiusY ;
    }

    public hitTest ( localPt : vec2 , transform : ITransformable ): boolean {
        let isHitted : boolean = Math2D . isPointInEllipse ( localPt . x , localPt . y , 0 , 0 , this . radiusX, this . radiusY ) ;
        return isHitted;
    }
    public hitHandlerTest () : boolean {
        return false
    }
    public hitFeaturePoint () : FeaturePt|null {
        return null
    }

    public draw ( transform: ITransformable, state : IRenderState , context: CanvasRenderingContext2D ) : void {
        context . beginPath ( ) ;
        context . ellipse ( 0 , 0 , this . radiusX , this . radiusY , 0 , 0 , Math.PI * 2 ) ;
        super . draw ( transform , state , context ) ;
    }

    public get type ( ) : ShapeType {
        return ShapeType.ELLIPSE ;
    }
}

export class ConvexPolygon extends BaseShape2D {
    public points : vec2 [ ] ;
    public get width (): number {
        return undefined
    }
    public get height () : number {
        return undefined
    }

    public constructor ( points : vec2 [ ] ) {
        if ( points . length < 3 ) {
            alert ( "多边形顶点必须大于3或等于3!!")
            new Error ( "多边形顶点必须大于3或等于3!!") ;
        }
        if ( Math2D . isConvex ( points ) === false ) {
            alert ( "当前多边形不是凸多边形!!" ) ;
            new Error ( "当前多边形不是凸多边形!!" ) ;
        }
        super ( ) ;
        this . points = points ;
        
    }

    public hitTest ( localPt : vec2 , transform : ITransformable ) : boolean {
        return Math2D . isPointInPolygon ( localPt , this . points ) ;
    }
    public hitHandlerTest (localPt: vec2) : boolean {
        return false
    }
    public hitFeaturePoint (localPt: vec2, precision: number = 0) : FeaturePt|null {
        return null
    }

    public draw ( transformable: ITransformable, state : IRenderState , context: CanvasRenderingContext2D ): void {
        context . beginPath ( ) ;
        context . moveTo ( this . points [ 0 ] . x , this . points [ 0 ] . y ) ;
        for ( let i = 1 ; i < this . points . length ; i ++ ) {
            context . lineTo ( this . points [ i ] . x , this . points [ i ] . y ) ;
        }
        context . closePath ( ) ;
        super . draw ( transformable , state , context ) ;
    } 

    public get type ( ) : ShapeType {
        return ShapeType.CONVEXPOLYGON ;
    }
} 

export class Rhomb extends ConvexPolygon {
    public get featurePoints () : FeaturePt [] {
       
        return this.points.map((point:vec2) => {
            let pos: PtPos = PtPos.RIGHT
            if (point.values[0] > 0) {
                pos = PtPos.RIGHT
            } else if (point.values[0] < 0){
                pos = PtPos.LEFT
            } else if (point.values[1] > 0){
                pos = PtPos.BOTTOM
            } else if (point.values[1] < 0){
                pos = PtPos.TOP
            }
            return {
                x: point.values[0] - 4,
                y: point.values[1] - 4,
                width: 8, height: 8,
                centerX: point.values[0],
                centerY: point.values[1],
                pos: pos
            }
        })
    }

    public get multiplePoints () : multiplePt {
        let [top, right, bottom, left] = this.points
        return [
            new vec2(left.values[0], top.values[1]),
            new vec2(right.values[0], top.values[1]), 
            new vec2(left.values[0], bottom.values[1]), 
            new vec2(right.values[0], bottom.values[1])
        ]
    }

    get type () : ShapeType {
        return ShapeType.RHOMB
    }
    get x () : number {
        return this.points[3].values[0]
    }

    get y () : number {
        return this.points[0].values[1]
    }

    get width () : number {
        return this.points[1].values[0] - this.x
    }

    get height () : number {
        return this.points[2].values[1] - this.y
    }

    public drawHandler (context: CanvasRenderingContext2D) : void {
        // 绘制操纵点
        context.save()
            context.beginPath()
            context.strokeStyle = 'rgba(255, 0, 0, .5)'
            context.lineWidth = 2
            context.rect(this.x, this.y, this.width, this.height)
            context.stroke()
        context.restore()

        this.multiplePoints.forEach(point => {
            context.beginPath()
            context.arc(point.values[0], point.values[1], 4, 0, Math.PI * 2)
            context.fill()
            context.stroke()
        })
        
        // 绘制特征点
        let points: FeaturePt [] = this.featurePoints
        context.beginPath()
        points.forEach(point => {
            context.rect(point.x, point.y, point.width, point.height)
        })
        context.fill()
        context.stroke()
    }
    public hitHandlerTest (localPt : vec2 ) : boolean {
        return this.multiplePoints.some(point => Math2D.isPointInCircle(localPt, point, 4))
    }
    public hitFeaturePoint (localPt : vec2, precision: number = 0) : FeaturePt|null {
        return this.featurePoints.find(point => Math2D.isPointInRect(
                localPt.x, localPt.y, 
                point.x - precision, point.y - precision, 
                point.width + precision, point.height + precision
            )
        )
    }
}

export class Ladder extends ConvexPolygon {
    public get featurePoints () : FeaturePt [] {
        let [leftTopOne, leftTopTwo, rightTopOne, rightTopTwo, rightBottom, leftBottom] = this.points
        return [
            {x: 0-4, y: leftTopTwo.values[1] - 4, width: 8, height: 8, centerX: 0, centerY: leftTopTwo.values[1], pos: PtPos.TOP},
            {x: rightTopTwo.values[0] - 4, y: -4, width: 8, height: 8, centerX: rightTopTwo.values[0], centerY: 0, pos: PtPos.RIGHT},
            {x: 0-4, y: rightBottom.values[1] - 4, width: 8, height: 8, centerX: 0, centerY: rightBottom.values[1], pos: PtPos.BOTTOM},
            {x: leftTopOne.values[0] -4, y: 0 - 4, width: 8, height: 8, centerX: leftTopOne.values[0], centerY: 0, pos: PtPos.LEFT},
        ]
    }

    public get multiplePoints () : multiplePt {
        let [leftTopOne, leftTopTwo, rightTopOne, rightTopTwo, rightBottom, leftBottom] = this.points
        return [
            new vec2(leftTopOne.values[0], leftTopTwo.values[1]),
            new vec2(rightTopTwo.values[0], rightTopOne.values[1]), 
            new vec2(leftBottom.values[0], leftBottom.values[1]), 
            new vec2(rightBottom.values[0], rightBottom.values[1])
        ]
    }

    get x () : number {
        return this.points[0].values[0]
    }

    get y () : number {
        return this.points[1].values[1]
    }

    get width () : number {
        return this.points[3].values[0] - this.x
    }

    get height () : number {
        return this.points[4].values[1] - this.y
    }

    get type () : ShapeType {
        return ShapeType.LADDER
    }

    public drawHandler (context: CanvasRenderingContext2D) : void {
        // 绘制操纵点
        context.save()
            context.beginPath()
            context.strokeStyle = 'rgba(255, 0, 0, .5)'
            context.lineWidth = 2
            context.rect(this.x, this.y, this.width, this.height)
            context.stroke()
        context.restore()

        this.multiplePoints.forEach(point => {
            context.beginPath()
            context.arc(point.values[0], point.values[1], 4, 0, Math.PI * 2)
            context.fill()
            context.stroke()
        })
        
        // 绘制特征点
        let points: FeaturePt [] = this.featurePoints
        context.beginPath()
        points.forEach(point => {
            context.rect(point.x, point.y, point.width, point.height)
        })
        context.fill()
        context.stroke()
    }

    public hitHandlerTest (localPt : vec2 ) : boolean {
        return this.multiplePoints.some(point => Math2D.isPointInCircle(localPt, point, 4))
    }
    public hitFeaturePoint (localPt : vec2, precision: number = 0) : FeaturePt|null {
        return this.featurePoints.find(point => Math2D.isPointInRect(
                localPt.x, localPt.y, 
                point.x - precision, point.y - precision, 
                point.width + precision, point.height + precision
            )
        )
    }
}

export class Rect extends BaseShape2D {
    public width : number ;
    public height : number ;
    // public x : number ;
    // public y : number ;
    public u : number ;
    public v : number ;

    public get x () : number {
        return - this.width * this. u 
    }

    public get y () : number {
        return - this.height * this.v
    }
    public get right ( ) : number {
        return this . x + this .width ;
    }

    public get bottom ( ) : number {
        return this . y + this .height ;
    }

    public get featurePoints () : FeaturePt [] {
        // let xCenter = 0, xRight = this.width * 0.5
        // let yCenter = 0, yBottom = this.height * 0.5

        return [
            {x: 0 - 4, y: this.height * 0.5 -4, width: 8, height: 8, centerX:0, centerY: this.height * 0.5, pos: PtPos.BOTTOM},
            {x: 0 - 4, y:  -(this.height * 0.5 -4), width: 8, height: 8, centerX:0, centerY: - this.height * 0.5, pos: PtPos.TOP},
            {x: this.width * 0.5 - 4, y:  0 - 4, width: 8, height: 8, centerX:this.width * 0.5, centerY: 0, pos: PtPos.RIGHT},
            {x: - (this.width * 0.5 - 4), y:  0 - 4, width: 8, height: 8, centerX:-this.width * 0.5, centerY: 0, pos: PtPos.LEFT}
        ]
    }

    public get multiplePoints () : multiplePt {
        return [
            new vec2(-0.5 * this.width, -0.5 * this.height),
            new vec2(0.5 * this.width, -0.5 * this.height), 
            new vec2(-0.5 * this.width, 0.5 * this.height), 
            new vec2(0.5 * this.width, 0.5 * this.height)
        ]
    }

    public constructor ( w: number = 1, h: number = 1 , u : number = 0 , v : number = 0  ) {
        super ( ) ;
        this . width = w ;
        this . height = h ;
        this . u = u;
        this . v = v;
        // this . x = - this . width * u ;
        // this . y = - this . height * v ;
    }

    public get type (): ShapeType {
        return ShapeType.RECT;
    }

    public hitTest ( localPt : vec2 , transform : ITransformable ): boolean {
        return Math2D . isPointInRect ( localPt . x , localPt . y , this . x , this . y , this . width , this . height ) ;
    }
    public hitHandlerTest (localPt: vec2, transform: ITransformable) : boolean {
        return this.multiplePoints.some((point: vec2)=> Math2D . isPointInCircle ( localPt , point, 4 ))
    }
    public hitFeaturePoint (localPt: vec2, precision:number = 0) : any {
        return this.featurePoints.find((point) => Math2D.isPointInRect(localPt.x, localPt.y, point.x - precision, point.y - precision, point.width + precision, point.height + precision))
    }

    public draw ( transformable: ITransformable, state : IRenderState , context: CanvasRenderingContext2D ): void {
        context.beginPath();
        context.moveTo( this . x ,  this . y  );
        context.lineTo( this . x + this . width , this . y  );
        context.lineTo( this . x + this . width  , this . y +  this . height ) ;
        context.lineTo( this . x , this . y + this . height ) ;
        context.closePath();
        super . draw ( transformable, state , context ) ;
    }

    public drawHandler (context: CanvasRenderingContext2D) {
        context.beginPath()
        context.arc(this.x, this.y, 4, 0, Math.PI * 2)
        context.fill()
        context.stroke()

        context.beginPath()
        context.arc(this . x + this . width, this.y, 4, 0, Math.PI * 2)
        context.fill()
        context.stroke()

        context.beginPath()
        context.arc( this . x + this . width  , this . y +  this . height, 4, 0, Math.PI * 2)
        context.fill()
        context.stroke()

        context.beginPath()
        context.arc( this . x , this . y + this . height, 4, 0, Math.PI * 2)
        context.fill()
        context.stroke()

        // 绘制几何点
        context.beginPath()
        context.rect(this.x + this.width * 0.5 -4, this.y -4, 8, 8)
        context.rect(this.x + this.width * 0.5 -4, this.y + this.height -4, 8, 8)
        context.rect(this.x - 4, this.y + this.height * 0.5 -4, 8, 8)
        context.rect(this.x + this.width - 4, this.y + this.height * 0.5 - 4, 8, 8)
        context.fill()
        context.stroke()
    }
}

export class CalcRect extends Rect {
    public get type (): ShapeType {
        return ShapeType.CALCRECT
    }
    public constructor ( w: number = 1, h: number = 1 , u : number = 0 , v : number = 0  ) {
        super ( w, h, u, v) ;
    }
    public draw ( transformable: ITransformable, state : IRenderState , context: CanvasRenderingContext2D) {
        super.draw( transformable, state , context )
        context.stroke()
        context.fill()
        context.beginPath()
        context.moveTo(this.x, this.y + 16)
        context.lineTo(this.x + this.width, this.y + 16)
        context.stroke()
        context.save()
        context.fillStyle = 'black'
        context.fillText(state.text, 0, 0)
        context.restore()
    }
}

export class ChildRect extends Rect {
    public get type ():ShapeType {
        return ShapeType.CHILDRECT
    }
    public constructor ( w: number = 1, h: number = 1 , u : number = 0 , v : number = 0  ) {
        super ( w, h, u, v) ;
    }
    public draw ( transformable: ITransformable, state : IRenderState , context: CanvasRenderingContext2D) {
        super.draw( transformable, state , context )
        context.stroke()
        context.fill()
        context.beginPath()
        context.moveTo(this.x + 10, this.y)
        context.lineTo(this.x + 10, this.y + this.height)
        context.moveTo(this.x + this.width - 10, this.y)
        context.lineTo(this.x + this.width - 10, this.y + this.height)
        context.stroke()
        context.save()
        context.fillStyle = 'black'
        context.fillText(state.text, 0, 0)
        context.restore()
    }
}

// 对话框
export class DialogRect extends BaseShape2D {
    public width : number ;
    public height : number ;
    public u : number ;
    public v : number ;
    public radius: number;

    public get x () : number {
        return - this.width * this. u 
    }

    public get y () : number {
        return - this.height * this.v
    }

    public get right ( ) : number {
        return this . x + this .width ;
    }

    public get bottom ( ) : number {
        return this . y + this .height ;
    }

    public constructor ( w: number = 1, h: number = 1 , u : number = 0 , v : number = 0, radius: number = 0,  ) {
        super ( ) ;
        this . width = w ;
        this . height = h ;
        this . radius = radius;
        this . u = u ;
        this . v = v ;
    }

    public get type (): ShapeType {
        return ShapeType.DIALOGRECT;
    }

    public get featurePoints () : FeaturePt [] {
        // let xCenter = 0, xRight = this.width * 0.5
        // let yCenter = 0, yBottom = this.height * 0.5

        return [
            {x: 0 - 4, y: this.height * 0.5 -4, width: 8, height: 8, centerX:0, centerY: this.height * 0.5, pos: PtPos.BOTTOM},
            {x: 0 - 4, y:  -this.height * 0.5 -4, width: 8, height: 8, centerX:0, centerY: - this.height * 0.5, pos: PtPos.TOP},
            {x: this.width * 0.5 - 4, y:  0 - 4, width: 8, height: 8, centerX:this.width * 0.5, centerY: 0, pos: PtPos.RIGHT},
            {x: - this.width * 0.5 - 4, y:  0 - 4, width: 8, height: 8, centerX:-this.width * 0.5, centerY: 0, pos: PtPos.LEFT}
        ]
    }
    public get multiplePoints () : multiplePt {
        return [
            new vec2(-0.5 * this.width, -0.5 * this.height),
            new vec2(0.5 * this.width, -0.5 * this.height), 
            new vec2(-0.5 * this.width, 0.5 * this.height), 
            new vec2(0.5 * this.width, 0.5 * this.height)
        ]
    }

    public hitTest ( localPt : vec2 , transform : ITransformable ): boolean {
        return Math2D . isPointInRect ( localPt . x , localPt . y , this . x , this . y , this . width , this . height ) ;
    }
    public hitHandlerTest (localPt : vec2 ) : boolean {
        return this.multiplePoints.some(point => Math2D.isPointInCircle(localPt, point, 4))
    }
    public hitFeaturePoint (localPt : vec2, precision: number = 0) : FeaturePt|null {
        return this.featurePoints.find(point => Math2D.isPointInRect(
                localPt.x, localPt.y, 
                point.x - precision, point.y - precision, 
                point.width + precision, point.height + precision
            )
        )
    }

    public draw ( transformable: ITransformable, state : IRenderState , context: CanvasRenderingContext2D ): void {
        context.beginPath();
        let centerXL = this.radius + this.x , centerXR = this.width - this.radius + this.x
        let centerYT = this.radius + this.y , centerYB = this.height - this.radius + this.y 
        context.moveTo( this . x ,  this . y  );
        context.lineTo(centerXR, this.y)
        context.arc(centerXR, centerYT, this.radius, Math.PI * 1.5, Math.PI * 2)
        context.lineTo(this.width + this.x, centerYB)
        context.arc(centerXR, centerYB, this.radius, 0, Math.PI * 0.5)
        context.lineTo(centerXL, this.height + this.y)
        context.arc(centerXL, centerYB, this.radius, Math.PI * 0.5, Math.PI)
        context.closePath();
        super . draw ( transformable, state , context ) ;
    } 

    public drawHandler (context: CanvasRenderingContext2D) : void {
        // 绘制操纵点
        context.save()
            context.beginPath()
            context.strokeStyle = 'rgba(255, 0, 0, .5)'
            context.lineWidth = 2
            context.rect(this.x, this.y, this.width, this.height)
            context.stroke()
        context.restore()

        this.multiplePoints.forEach(point => {
            context.beginPath()
            context.arc(point.values[0], point.values[1], 4, 0, Math.PI * 2)
            context.fill()
            context.stroke()
        })
        
        // 绘制特征点
        let points: FeaturePt [] = this.featurePoints
        context.beginPath()
        points.forEach(point => {
            context.rect(point.x, point.y, point.width, point.height)
        })
        context.fill()
        context.stroke()
    }
}

export class RoundRect extends BaseShape2D {
    public width : number ;
    public height : number ;
    // public x : number ;
    // public y : number ;
    public u : number ;
    public v : number ;
    public radius: number;

    public get right ( ) : number {
        return this . x + this .width ;
    }

    public get bottom ( ) : number {
        return this . y + this .height ;
    }
    public get x () : number {
        return - this.width * this. u 
    }

    public get y () : number {
        return - this.height * this.v
    }
    public get featurePoints () : FeaturePt [] {
        // let xCenter = 0, xRight = this.width * 0.5
        // let yCenter = 0, yBottom = this.height * 0.5

        return [
            {x: 0 - 4, y: this.height * 0.5 -4, width: 8, height: 8, centerX:0, centerY: this.height * 0.5, pos: PtPos.BOTTOM},
            {x: 0 - 4, y:  -this.height * 0.5 -4, width: 8, height: 8, centerX:0, centerY: - this.height * 0.5, pos: PtPos.TOP},
            {x: this.width * 0.5 - 4, y:  0 - 4, width: 8, height: 8, centerX:this.width * 0.5, centerY: 0, pos: PtPos.RIGHT},
            {x: - this.width * 0.5 - 4, y:  0 - 4, width: 8, height: 8, centerX:-this.width * 0.5, centerY: 0, pos: PtPos.LEFT}
        ]
    }
    public get multiplePoints () : multiplePt {
        return [
            new vec2(-0.5 * this.width, -0.5 * this.height),
            new vec2(0.5 * this.width, -0.5 * this.height), 
            new vec2(-0.5 * this.width, 0.5 * this.height), 
            new vec2(0.5 * this.width, 0.5 * this.height)
        ]
    }

    public constructor ( w: number = 1, h: number = 1 , u : number = 0 , v : number = 0, radius: number = 0,  ) {
        super ( ) ;
        this . width = w ;
        this . height = h ;
        this . radius = radius;
        this . u = u
        this . v = v
    }

    public get type (): ShapeType {
        return ShapeType.ROUNDRECT;
    }

    public hitTest ( localPt : vec2 , transform : ITransformable ): boolean {
        return Math2D . isPointInRect ( localPt . x , localPt . y , this . x , this . y , this . width , this . height ) ;
    }
    public hitHandlerTest (localPt : vec2 ) : boolean {
        return this.multiplePoints.some(point => Math2D.isPointInCircle(localPt, point, 4))
    }
    public hitFeaturePoint (localPt : vec2, precision: number = 0) : FeaturePt|null {
        return this.featurePoints.find(point => Math2D.isPointInRect(
                localPt.x, localPt.y, 
                point.x - precision, point.y - precision, 
                point.width + precision, point.height + precision
            )
        )
    }

    public draw ( transformable: ITransformable, state : IRenderState , context: CanvasRenderingContext2D ): void {
        context.beginPath();

        let centerXL = this.radius + this.x , centerXR = this.width - this.radius + this.x
        let centerYT = this.radius + this.y , centerYB = this.height - this.radius + this.y 
        context.arc(centerXL, centerYT, this.radius, Math.PI, Math.PI * 1.5)
        // context.moveTo( this . x ,  this . y  );
        // context.lineTo( this . x + this . width , this . y  );
        // context.lineTo( this . x + this . width  , this . y +  this . height ) ;
        // context.lineTo( this . x , this . y + this . height ) ;
        context.lineTo(centerXR, this.y)
        context.arc(centerXR, centerYT, this.radius, Math.PI * 1.5, Math.PI * 2)
        context.lineTo(this.width + this.x, centerYB)
        context.arc(centerXR, centerYB, this.radius, 0, Math.PI * 0.5)
        context.lineTo(centerXL, this.height + this.y)
        context.arc(centerXL, centerYB, this.radius, Math.PI * 0.5, Math.PI)
        context.closePath();
        super . draw ( transformable, state , context ) ;
    }
    public drawHandler (context: CanvasRenderingContext2D) : void {
        // 绘制操纵点
        context.save()
            context.beginPath()
            context.strokeStyle = 'rgba(255, 0, 0, .5)'
            context.lineWidth = 2
            context.rect(this.x, this.y, this.width, this.height)
            context.stroke()
        context.restore()

        this.multiplePoints.forEach(point => {
            context.beginPath()
            context.arc(point.values[0], point.values[1], 4, 0, Math.PI * 2)
            context.fill()
            context.stroke()
        })
        
        // 绘制特征点
        let points: FeaturePt [] = this.featurePoints
        context.beginPath()
        points.forEach(point => {
            context.rect(point.x, point.y, point.width, point.height)
        })
        context.fill()
        context.stroke()
    }
}

export class FullRoundRect extends RoundRect {
    public get radius ():number {
        return Math.min(this.width, this.height) / 2
    }
    public set radius (val) {
        
    }
    public get type (): ShapeType {
        return ShapeType.FULLROUNDRECT;
    }
    public constructor ( w: number = 1, h: number = 1 , u : number = 0 , v : number = 0) {
        super ( w, h, u, v, Math.min(w, h) / 2) ;
        this . width = w ;
        this . height = h ;
        this . u = u
        this . v = v
    }
}

export class Grid extends Rect {
    public xStep: number;
    public yStep: number;

    public constructor ( w : number = 10, h : number = 10 , xStep : number = 10, yStep : number = 10 ) {
        super( w , h , 0 , 0 ) ;
        this . xStep = xStep ;
        this . yStep = yStep ;
    }

    public draw ( transformable : ITransformable , state : IRenderState , context : CanvasRenderingContext2D ) : void {
        state . renderType = ERenderType . CUSTOM ;
        context . fillRect ( 0 , 0 , this . width , this . height ) ;

        context . beginPath ( ) ;
        for ( var i = this . xStep + 0.5 ; i < this . width ; i += this . xStep )
         {
            context . moveTo ( i , 0 ) ;
            context . lineTo ( i , this . height ) ;
        }
        context . stroke ( ) ;

        context . beginPath ( ) ;
        for ( var i = this . yStep + 0.5 ; i < this . height ; i += this . yStep )
        {
            context . moveTo ( 0 , i );
            context . lineTo ( this . width , i ) ;
        }
        context . stroke ( ) ;
    }

    public get type ( ) : ShapeType {
        return ShapeType.GRID;
    }
}

export class BezierPath extends BaseShape2D {
    public points : vec2 [ ] ;
    public isCubic : boolean ;
    public get width (): number {
        return undefined
    }
    public get height () : number {
        return undefined
    }

    public constructor ( points : vec2 [ ]  , isCubic : boolean = false ) {
        super ( ) ;
        this . points = points ;
        this . isCubic = isCubic ;
        this . data = points ; 
    }

    public get type ( ) : ShapeType {
        return ShapeType.BEZIERPATH ;
    }

    public hitTest ( localPt : vec2 , transform : ITransformable ) : boolean { return false ; }
    public hitHandlerTest () : boolean {
        return false
    }
    public hitFeaturePoint () : FeaturePt|null {
        return null
    }

    public draw ( transformable: ITransformable, state : IRenderState , context: CanvasRenderingContext2D ): void {
        context . beginPath ( ) ;
        context . moveTo ( this . points [ 0 ] . x , this . points [ 0 ] . y ) ;
        if ( this . isCubic ) {
            for ( let i = 1 ; i < this . points . length ; i += 3 ) {
                context . bezierCurveTo (this . points [ i ] . x , 
                    this . points [ i ] . y ,
                    this . points [ i + 1 ] . x ,
                    this . points [ i + 1 ] . y ,
                    this . points [ i + 2 ] . x ,
                    this . points [ i + 2 ] . y ) ;
            }  
        } else {
            for ( let  i : number  = 1 ; i < this . points . length  ; i += 2 ) {
                context . quadraticCurveTo ( this . points [ i ] . x , 
                                             this . points [ i] . y ,
                                             this . points [ i + 1  ] . x ,
                                             this . points [ i + 1 ] . y ) ;
            } 
        }
        super . draw ( transformable , state , context ) ;
    }
}

export class Line implements IShape {
    public start : vec2 ;
    public end : vec2 ;
    public data : any ; 
    public startPos: PtPos;
    public endPos: PtPos;

    readonly id : string;

    public constructor ( len : number = 10 , t : number = 0 ) {
        
        this . data = {} ;
        this . id = generateUUID()
    }

    public get drawPt () : vec2 []{
        let x1 = this.start.x, y1 = this.start.y
        let x2 = this.end.x, y2 = this.end.y
        let diffX = x2 - x1, diffY = y2 - y1
        // 线段过短不区分
        // short dosomething
        let points: vec2 [] = []
        points.push(new vec2(x1, y1))
        if (this.endPos) { // 不用修正直线的笔直度
            // console.log('dosomething')
        }
        if (this.startPos === PtPos.BOTTOM || this.startPos === PtPos.TOP) {
            if (this.endPos !== undefined) {
                switch (this.endPos) {
                    case PtPos.BOTTOM :
                    case PtPos.TOP :
                        points.push(new vec2(x1, (y1 + y2)/2));
                        points.push(new vec2(x2, (y1 + y2)/2));
                        break;
                    case PtPos.RIGHT :
                    case PtPos.LEFT :
                        points.push(new vec2 (x1, y2))
                        break;
                }
            } else {
                if (Math.abs(diffX) > Math.abs(diffY)) { // 横向大于纵向
                    points.push(new vec2 (x1, y2))
                } else { // 纵向大于横向
                    points.push(new vec2(x1, (y1 + y2)/2))
                    points.push(new vec2(x2, (y1 + y2)/2))
                }
            }
        } else if (this.startPos === PtPos.RIGHT || this.startPos === PtPos.LEFT) {
            if (this.endPos !== undefined) {
                switch (this.endPos) {
                    case PtPos.BOTTOM :
                    case PtPos.TOP :
                        points.push(new vec2 (x2, y1))
                        break;
                    case PtPos.RIGHT :
                    case PtPos.LEFT :
                        points.push(new vec2 ((x1 + x2) / 2, y1))
                        points.push(new vec2 ((x1 + x2) / 2, y2))
                        break;
                }
            } else {
                if (Math.abs(diffX) > Math.abs(diffY)) { // 横向大于纵向
                    points.push(new vec2 ((x1 + x2) / 2, y1))
                    points.push(new vec2 ((x1 + x2) / 2, y2))
                } else { // 纵向大于横向
                    points.push(new vec2 (x2, y1))
                }
            }  
        }
        points.push(new vec2(x2, y2))
        return points
    }

    public hitTest ( localPt : vec2 , transform : ITransformable ): boolean {
        let points = this.drawPt, collision: boolean = false
        for (let i = 0; i < points.length - 1; i++) {
            if (Math2D . isPointOnLineSegment ( localPt , points[i] , points[i + 1] , 8)){
                collision = true 
                break;
            }
        }
        console.log('isCollision', collision)
        return collision
    }
    public hitHandlerTest () : boolean {
        return false
    }
    public hitFeaturePoint () : FeaturePt|null {
        return null
    }
    public drawText (context : CanvasRenderingContext2D, state: IRenderState) : void {
        let reduceArr: [number, vec2, Array<vec2>] = this.drawPt.reduce((asum:[number, vec2, Array<vec2>],item:vec2, index:number) => {
            let substract: vec2 = vec2.difference(asum[1], item, new vec2())
            asum[0] += substract.length
            asum[1] = item
            asum[2].push(substract)
            return asum
        }, [0, this.drawPt[0], []])
        let [total,,asumArr] = reduceArr
        let totalLenHalf = total / 2

        if (totalLenHalf < 20) { // 线段过短不绘制文字
            return
        }

        let index:number = 0
        asumArr.shift()

        while (totalLenHalf > 0) {
            totalLenHalf -= asumArr[index].length
            index++
        }

        let curPt: vec2 = this.drawPt[index]
        
        let dir: 'x'|'y' = 'x', otherDir:'x'|'y' = 'y'
        if (this.drawPt[index].x === this.drawPt[index - 1].x) {
            dir = 'y'
            otherDir = 'x'
        }
        if (this.drawPt[index][dir] >= this.drawPt[index - 1][dir]) {
            totalLenHalf = -totalLenHalf
        }
        let dis = dir === 'x' ? new vec2(totalLenHalf, 0): new vec2(0, totalLenHalf)

        let drawPt:vec2 = vec2.difference(curPt, dis, new vec2())
        context.save()
        context.font = state.font
        context.textAlign = state.textAlign
        context.textBaseline = state.textBaseLine
        context.fillText(state.text, drawPt.x, drawPt.y)
        context.restore()
    }

    public beginDraw ( transformable : ITransformable , state : IRenderState , context : CanvasRenderingContext2D ): void {
        context . save ( ) ;
        context . lineWidth = state . lineWidth ;
        context . strokeStyle = state . strokeStyle ;
        let mat : mat2d = transformable . getWorldMatrix ( ) ; 
        context . setTransform ( mat . values [ 0 ] , mat . values [ 1 ] , mat . values [ 2 ] , mat . values [ 3 ] , mat . values [ 4 ] , mat . values [ 5 ] ) ;
    }

    public draw ( transformable : ITransformable , state : IRenderState , context : CanvasRenderingContext2D ) : void {
        state . renderType = ERenderType . STROKE ;
        let points = this.drawPt
        context . beginPath ( ) ; 
        points.forEach((point, i) => {
            if (i === 0) {
                context . moveTo ( point . x ,  point . y  ) ;
            } else {
                context . lineTo ( point . x , point. y ) ;
            }
        })
        this.drawText(context, state)
        let v: vec2 = vec2.difference(points[points.length - 2], points[points.length - 1])
        v.normalize()
        let rotate: mat2d = mat2d.makeRotationFromVectors(vec2.xAxis, v)
        context.save()
        context.transform(rotate.values[0], rotate.values[1], rotate.values[2], rotate.values[3], this.end.x, this.end.y)
        context.moveTo(0,0)
        context.lineTo(15, 8)
        context.moveTo(0,0)
        context.lineTo(15, -8)
        context.restore()
        context . stroke ( ) ;
    }

    public endDraw ( transformable: ITransformable, state : IRenderState , context: CanvasRenderingContext2D ): void {
        context.restore();
    }

    drawHandler (context: CanvasRenderingContext2D) {
   
    }

    getA () : vec2 [] {
        return this.drawPt
    }
    public get type () : ShapeType {
        return ShapeType.LINE;
    }
}

export class Scale9Grid extends Rect {

    public data : Scale9Data ;
    public srcRects ! : Rectangle [ ] ;
    public destRects ! : Rectangle [ ] ;

    public get type ( ) : ShapeType {
        return ShapeType.SCALE9GRID ;
    }

    public constructor ( data : Scale9Data , width : number , height : number , u : number , v : number ) {
        super ( width , height , u , v ) ;
        this . data = data ;
        this . _calcDestRects ( ) ;
    }

    private _calcDestRects ( ) : void {
        this . destRects = [ ] ;
        this . srcRects =  [ ] ;

        let rc : Rectangle ;
        rc = new Rectangle ( ) ;
        rc . origin = vec2 . create ( 0 , 0 ) ;
        rc . size = Size . create ( this . data . leftMargin , this . data . topMargin ) ;
        this . srcRects . push ( rc ) ;

        rc = new Rectangle ( ) ;
        rc . origin = vec2 . create ( this . x , this . y ) ;
        rc . size = Size . create ( this . data . leftMargin , this . data . topMargin ) ;
        this . destRects . push ( rc ) ;

        rc = new Rectangle ( ) ;
        rc . origin = vec2 . create ( this . data . image . width - this . data . rightMargin  , 0 ) ;
        rc . size = Size . create ( this . data . rightMargin , this . data . topMargin ) ;
        this . srcRects . push ( rc ) ;

        rc = new Rectangle ( ) ;
        rc . origin = vec2 . create ( this . right - this . data . rightMargin , this . y ) ;
        rc . size = Size . create ( this . data . rightMargin , this . data . topMargin ) ;
        this . destRects . push ( rc ) ;

        rc = new Rectangle ( ) ;
        rc . origin = vec2 . create ( this . data . image . width - this . data . rightMargin  , this . data . image . height - this . data . bottomMargin ) ;
        rc . size = Size . create ( this . data . rightMargin , this . data . bottomMargin ) ;
        this . srcRects . push ( rc ) ;

        rc = new Rectangle ( ) ;
        rc . origin = vec2 . create ( this . right - this . data . rightMargin , this . bottom - this . data . bottomMargin ) ;
        rc . size = Size . create ( this . data . rightMargin , this . data . bottomMargin ) ;
        this . destRects . push ( rc ) ;

        rc = new Rectangle ( ) ;
        rc . origin = vec2 . create ( 0  , this . data . image . height - this . data . bottomMargin ) ;
        rc . size = Size . create ( this . data . leftMargin , this . data . bottomMargin ) ;
        this . srcRects . push ( rc ) ;

        rc = new Rectangle ( ) ;
        rc . origin = vec2 . create ( this . x , this . bottom - this . data . bottomMargin ) ;
        rc . size = Size . create ( this . data . leftMargin , this . data . bottomMargin  ) ;
        this . destRects . push ( rc ) ;

        rc = new Rectangle ( ) ;
        rc . origin = vec2 . create ( 0  , this . data . topMargin ) ;
        rc . size = Size . create ( this . data . leftMargin , this .data . image . height - this . data . topMargin - this . data . bottomMargin ) ;    
        this . srcRects . push ( rc ) ;

        rc = new Rectangle ( ) ;
        rc . origin = vec2 . create ( this . x , this . y + this . data . topMargin ) ;
        rc . size = Size . create ( this . data . leftMargin , this . height - this . data . topMargin - this . data . bottomMargin ) ;
        this . destRects . push ( rc ) ;

        rc = new Rectangle ( ) ;
        rc . origin = vec2 . create ( this . data . leftMargin  , 0 ) ;
        rc . size = Size . create ( this . data . image . width - this . data . leftMargin - this . data .rightMargin ,  this . data . topMargin ) ;    
        this . srcRects . push ( rc ) ;

        rc = new Rectangle ( ) ;
        rc . origin = vec2 . create ( this . x + this . data . leftMargin , this . y ) ;
        rc . size = Size . create ( this . width - this . data . leftMargin - this . data . rightMargin , this . data . topMargin ) ;
        this . destRects . push ( rc ) ;

        rc = new Rectangle ( ) ;
        rc . origin = vec2 . create ( this . data . image . width - this .data . rightMargin  , this .data . topMargin ) ;
        rc . size = Size . create ( this . data . rightMargin ,  this . data . image . height - this . data . topMargin - this . data . bottomMargin ) ;    
        this . srcRects . push ( rc ) ;

        rc = new Rectangle ( ) ;
        rc . origin = vec2 . create ( this . right - this . data . rightMargin , this . y + this . data . topMargin ) ;
        rc . size = Size . create ( this . data . rightMargin , this . height - this .data . topMargin - this . data . bottomMargin ) ;
        this . destRects . push ( rc ) ;

        rc = new Rectangle ( ) ;
        rc . origin = vec2 . create ( this . data . leftMargin  , this . data . image . height - this .data . bottomMargin ) ;
        rc . size = Size . create ( this . data . image . width - this . data . leftMargin - this . data . rightMargin ,  this . data . bottomMargin ) ;    
        this . srcRects . push ( rc ) ;

        rc = new Rectangle ( ) ;
        rc . origin = vec2 . create (  this . x + this . data . leftMargin , this . bottom - this . data . bottomMargin  ) ;
        rc . size = Size . create ( this . width - this . data . leftMargin - this . data . rightMargin  , this . data . bottomMargin ) ;
        this . destRects . push ( rc ) ;

        rc = new Rectangle ( ) ;
        rc . origin = vec2 . create ( this . data . leftMargin ,  this . data . topMargin  ) ;
        rc . size = Size . create ( this . data . image . width - this . data . leftMargin - this . data . rightMargin  , this . data . image . height - this .data . topMargin - this .data . bottomMargin ) ;
        this . srcRects . push ( rc ) ;

        rc = new Rectangle ( ) ;
        rc . origin = vec2 . create (  this . x + this . data . leftMargin , this . y + this . data . topMargin  ) ;
        rc . size = Size . create ( this . width - this . data . leftMargin - this . data . rightMargin  , this . height - this .data . topMargin - this .data . bottomMargin ) ;
        this . destRects . push ( rc ) ;
    }

    private  _drawImage ( context : CanvasRenderingContext2D , img : HTMLImageElement | HTMLCanvasElement ,  destRect : Rectangle , srcRect : Rectangle  , fillType : EImageFillType = EImageFillType . STRETCH ) : boolean {
         if ( srcRect . isEmpty ( ) ) {
            return false;
         }
 
         if ( destRect . isEmpty ( ) ) {
            return false ; 
         }
 
         if ( fillType === EImageFillType . STRETCH ) {
            context . drawImage ( img , 
                                           srcRect . origin . x , 
                                           srcRect . origin . y ,
                                           srcRect . size . width ,
                                           srcRect . size . height ,
                                           destRect . origin . x ,
                                           destRect . origin . y ,
                                           destRect . size . width ,
                                           destRect . size . height
             ) ;
        } else  {
             let rows : number  = Math . ceil ( destRect . size . width / srcRect . size . width ) ;
             let colums : number  = Math . ceil ( destRect . size . height / srcRect . size . height ) ;

             let left : number = 0;
             let top : number = 0 ;
 
             let right : number = 0 ;
             let bottom : number = 0 ;
 
             let width : number = 0 ;
             let height : number = 0 ;

             let destRight : number = destRect . origin . x + destRect . size . width ;
             let destBottom : number = destRect . origin . y + destRect . size . height ;
 
             if ( fillType === EImageFillType . REPEAT_X ) {
                 colums = 1 ; 
             } else if ( fillType === EImageFillType . REPEAT_Y ) {
                 rows = 1 ;
             }
 
             for ( let i : number = 0 ; i < rows ; i ++ ) {
                 for ( let j : number = 0 ; j < colums ; j ++ ) 
                 {
                     left = destRect . origin . x + i * srcRect . size . width ;
                     top =  destRect . origin . y + j * srcRect . size . height ;
 
                     width = srcRect . size . width ;
                     height = srcRect . size . height ;
                   
                     right = left + width ;
                     bottom = top + height ;
 
                     if ( right > destRight ) {
                         width = srcRect . size . width - ( right - destRight ) ;   
                     }
 
                     if ( bottom > destBottom ) {
                        height = srcRect . size . height - ( bottom - destBottom ) ;
                     }
       
                     context . drawImage ( img , 
                         srcRect . origin . x , 
                         srcRect . origin . y ,
                         width ,
                         height ,
                         left , top , width , height
                     ) ;
                 }
             }      
        } 
        return true ;
     }
    
    public draw ( transformable : ITransformable , state : IRenderState , context : CanvasRenderingContext2D ) : void {
        for ( let i : number = 0 ; i < this . srcRects . length ; i ++ ) {
            this . _drawImage ( context , this . data . image , this . destRects [ i ] , this . srcRects [ i ] , EImageFillType . STRETCH ) ;
        }
    }
}


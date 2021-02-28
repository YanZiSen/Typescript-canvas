import { mat2d , vec2 , Inset } from "../math2d";
import { CanvasMouseEvent , CanvasKeyBoardEvent } from "../application";
import { Rect, Circle, Grid, Ellipse , Line  , ConvexPolygon , Scale9Grid  , BezierPath, RoundRect, CalcRect ,ChildRect ,DialogRect, Rhomb, Ladder,FullRoundRect} from "./shapes";
import { Sprite2D } from "./sprite2d";

export enum ERenderType {
    CUSTOM ,  
    STROKE ,  
    FILL ,   
    STROKE_FILL , 
    CLIP  
}
export enum PtPos {
    RIGHT,
    TOP,
    BOTTOM,
    LEFT
}
export enum ShapeType{
    RECT = 1,
    ROUNDRECT,
    DIALOGRECT,
    CALCRECT,
    FULLROUNDRECT,
    RHOMB,
    CIRCLE,
    CHILDRECT,
    LADDER,
    CONVEXPOLYGON,
    ELLIPSE,
    REDUCE, // 医学处理
    LINE,
    BEZIERPATH,
    GRID,
    SCALE9GRID
}
export type FeaturePt = {
    x: number,
    y: number,
    height: number,
    width: number,
    centerX: number,
    centerY: number,
    pos: PtPos
}

export interface ITransformable {
    x : number ;
    y : number ;

    rotation : number ; 

    scaleX : number ;
    scaleY : number ;

    getWorldMatrix ( ) : mat2d ;
    getLocalMatrix ( ) : mat2d ;

}

export type FontType = '10px sans-serif' | '15px sans-serif' | '20px sans-serif' | '25px sans-serif'
export type TextAlign = 'start' | 'left' | 'center' | 'right' | 'end'
export type TextBaseLine = 'alphabetic' | 'hanging' | 'top' | 'middle' | 'bottom'
export interface IRenderState {
    isVisible : boolean ;       
    showCoordSystem : boolean ;  
    lineWidth : number ;        
    fillStyle : string | CanvasGradient | CanvasPattern ; 
    strokeStyle : string | CanvasGradient | CanvasPattern ; 
    renderType : ERenderType ; 
    font: FontType;
    textAlign: TextAlign;
    textBaseLine: TextBaseLine;
    text: string;
}


export interface IHittable {
    hitTest ( localPt : vec2 , transform : ITransformable ) : boolean ;
    hitHandlerTest ( localPt : vec2 , transform : ITransformable) : boolean;
    hitFeaturePoint ( localPt : vec2 , precision?: number) : FeaturePt | null;
}

export interface IDrawable {
    beginDraw ( transformable : ITransformable , state : IRenderState , context : CanvasRenderingContext2D ) : void ;
    draw ( transformable : ITransformable , state : IRenderState , context : CanvasRenderingContext2D ) : void ;
    drawHandler (context: CanvasRenderingContext2D) : void;
    endDraw ( transformable : ITransformable , state : IRenderState , context : CanvasRenderingContext2D ) : void ;
}

export interface IShape extends IHittable , IDrawable {
    readonly type : ShapeType ; 
    data : any ; 
    id: string;
}

export interface ISpriteContainer {
    name : string ;
    addSprite ( sprite : ISprite ) : ISpriteContainer ;
    removeSprite ( sprite : ISprite ) : boolean ;
    removeAll ( includeThis : boolean  ) : void ;
    getSpriteIndex ( sprite : ISprite ) : number ;
    getSprite ( idx : number ) : ISprite ;
    getSprite ( id: string ) : ISprite;
    getAllSprite () : Array<ISprite>;
    getSpriteCount ( ) : number ;
    getParentSprite ( ) : ISprite | undefined ;
    addLinkEvent: AddLinkEventHandler | null;
    activeSprEvent: ActiveSprEventHandler | null;
    unActiveSprEvent: UnActiveSprEventHandler | null;
    onLinkedEvent: LinkedEventHandler | null;
    onConcelActiveEvent: ConcelActiveEventHandler | null;
    onDeleteEvent: DeleteHandler | null;
    readonly sprite : ISprite | undefined ;
}

export enum EOrder {
    PREORDER,
    POSTORDER
}

export type UpdateEventHandler = ( ( spr : ISprite , mesc : number, diffSec : number , travelOrder : EOrder ) => void ) ;
export type MouseEventHandler = ( ( spr : ISprite , evt : CanvasMouseEvent  ) => void ) ;
export type KeyboardEventHandler = ( ( spr : ISprite , evt : CanvasKeyBoardEvent  ) => void ) ;
export type RenderEventHandler = ( spr : ISprite , context : CanvasRenderingContext2D , renderOreder : EOrder ) => void ;
export type ScaleEventHandler = (spr: ISprite, diffrentX: number, diffrentY: number) => void;
export type AddLinkEventHandler = (spr: ISprite) => void;
export type ActiveSprEventHandler = (spr: ISprite) => void;
export type UnActiveSprEventHandler = (spr: ISprite) => void;
export type LinkedEventHandler = (spr: ISprite) => void;
export type ConcelActiveEventHandler = (spr: ISprite) => void;
export type DeleteHandler = (spr: ISprite) => void;

export interface ISprite extends ITransformable , IRenderState {
    name : string ;  
    shape : IShape ;  
    owner : ISpriteContainer ; 
    data : any ; 
    active : boolean;

    hitTest ( localPt : vec2 ) : boolean ; 
    hitHandlerTest (localPt: vec2) : boolean;
    hitFeaturePoint (localPt: vec2, precision?: number) : FeaturePt | null;
    update ( mesc : number ,  diff : number , order : EOrder ) : void ; 
    draw ( context : CanvasRenderingContext2D ) : void ; 

    mouseEvent : MouseEventHandler | null ;
    keyEvent : KeyboardEventHandler | null ;
    updateEvent : UpdateEventHandler | null ;
    renderEvent : RenderEventHandler | null ;
    scaleEvent: ScaleEventHandler | null;
}

export interface IDispatcher {
    readonly container : ISpriteContainer ;  
    dispatchUpdate ( msec : number , diffSec : number ) : void ;
    dispatchDraw ( context : CanvasRenderingContext2D ) : void ;
    dispatchMouseEvent ( evt : CanvasMouseEvent ) : void ;
    dispatchKeyEvent ( evt: CanvasKeyBoardEvent ) : void ;
}

export class SpriteFactory {

    public static createGrid ( w : number , h : number , xStep : number = 10, yStep : number = 10 ) : IShape {
        return new Grid ( w , h , xStep , yStep ) ;
    }

    public static createCircle ( radius : number ) : IShape {
        return new Circle ( radius ) ;
    }

    public static createRect ( w : number , h : number , u : number = 0 , v : number = 0) : IShape {
        return new Rect ( w , h , u , v ) ;
    }

    public static createCalcRect ( w : number , h : number , u : number = 0 , v : number = 0) : IShape {
        return new CalcRect(w, h, u, v)
    }

    public static createChildRect ( w : number , h : number , u : number = 0 , v : number = 0) : IShape {
        return new ChildRect(w, h, u, v)
    }

    public static createRoundRect (w: number, h: number, u: number =0, v: number =0, radius:number = 5) : IShape {
        return new RoundRect(w, h, u, v, radius)
    }

    public static createFullRoundRect (w: number, h: number, u: number =0, v: number =0) : IShape {
        return new FullRoundRect(w, h, u, v)
    }

    public static createDialogRect (w: number, h: number, u: number =0, v: number =0, radius:number = 5) : IShape {
        return new DialogRect(w, h, u, v, radius)
    }

    public static createEllipse ( radiusX : number , radiusY : number ) : IShape {
        return new Ellipse ( radiusX , radiusY ) ;
    }

    public static createPolygon ( points : vec2 [ ] ) : IShape {
        if ( points . length < 3 ) {
            throw new Error ( "多边形顶点数量必须大于或等于3!!!") ;
        } 
        return new ConvexPolygon ( points ) ;
    }

    public static createRhomb (points: vec2[]) : IShape {
        if ( points . length !== 4 ) {
            throw new Error ( "菱形顶点数量必须等于4!!!") ;
        } 
        return new Rhomb ( points ) ;
    }

    public static createLadder (points: vec2[]) : IShape {
        if (points.length !== 6) {
            throw new Error ( "顶点数量必须等于6!!!") ;
        }
        return new Ladder( points )
    }

    public static createScale9Grid ( data : Scale9Data , width : number ,  height : number , u : number = 0 , v : number = 0 ) : IShape {
        return new Scale9Grid ( data , width , height ,u , v  ) ;
    }

    public static createLine ( start : vec2 , end : vec2 ) : IShape {
        let line : Line = new Line ( ) ;
        line . start = start ;
        line . end = end ;
        return line ;
    }

    public static createXLine ( len : number = 10 , t : number = 0 ) : IShape {
        return new Line ( len , t ) ;
    }

    public static createBezierPath ( points : vec2 [ ] , isCubic : boolean = false ) : IShape {
        return new BezierPath ( points , isCubic ) ;
    }

    public static createSprite ( shape: IShape , name : string = '' ) : ISprite {
        let spr : ISprite = new Sprite2D ( shape , name ) ;
        return spr ;
    }

    public static createISprite ( shape: IShape  , x: number = 0, y: number = 0, rotation: number = 0, scaleX: number = 1.0, scaleY: number = 1.0 , name : string = ' '  ): ISprite {
        let spr : ISprite = new Sprite2D ( shape , name ) ;
        spr . x = x ;
        spr . y = y ;
        spr . rotation = rotation ;
        spr. scaleX = scaleX ;
        spr. scaleY = scaleY ;
        return spr ;
    }
}

export enum EImageFillType {
    NONE ,      
    STRETCH ,   
    REPEAT ,    
    REPEAT_X ,  
    REPEAT_Y 
}

export class Scale9Data {
    public image : HTMLImageElement ;
    private _inset : Inset ;

    public set inset ( value : Inset )  {
        this . _inset = value ;
    }

    public get leftMargin ( ) : number {
        return this . _inset . leftMargin ;
    }

    public get rightMargin ( ) : number {
        return this . _inset . rightMargin ;
    }

    public get topMargin ( ) : number {
        return this . _inset . topMargin ;
    }

    public get bottomMargin ( ) : number {
        return this . _inset . bottomMargin ;
    }

    public constructor ( image : HTMLImageElement , inset : Inset ) {
        this . image = image ;
        this . _inset = inset ;
    }
}



   





import { CanvasMouseEvent,CanvasKeyBoardEvent } from "./application";
import { Math2D } from "../../application/math2d";

export interface IDispatcher {
    readonly container : ISpriteContainer
    // 遍历ISpriteContainer 进行精灵的update分发
    dispatchUpdate (mesc: number, diffSec: number) : void;
    dispatchDraw (context: CanvasRenderingContext2D) : void;
    dispatchMouseEvent (evt: CanvasMouseEvent) : void;
    dispatchKeyEvnt (evt: CanvasKeyBoardEvent) : void;
}

// 对图形统一操作接口
export interface ISpriteContainer {
    name: string;
    // addSprite (sprite: ISprite) : ISpriteContainer;
    // removeSprite (sprite: ISPrite) : boolean;
    removeAll (includeThis: boolean) : void;
    // getSpriteIndex (sprite: ISprite) : number;
    getSpriteCount () : number;
}

export enum ERenderType {
    CUSTOM,
    STROKE,
    FILL,
    STROKE_FILL,
    CLIP
}

export interface IRenderState {
    visible: boolean;
    showCoorSystem: boolean;
    lineWidth: number;
    fillStyle: string | CanvasGradient | CanvasPattern
    strokeStyle: string | CanvasGradient | CanvasPattern
    renderType: ERenderType
}

export interface ITransformable {
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;

    // getWorldMatrix () : mat2d;
    // getLocalMarix () : mat2d
}

export enum EOrder {
    PREORDER,
    POSTORDER
}

// export type UpdateEventHandler = ( ( spr : ISprite , mesc : number, diffSec : number , travelOrder : EOrder ) => void ) ;
// export type MouseEventHandler = ( ( spr : ISprite , evt : CanvasMouseEvent  ) => void ) ;
// export type KeyboardEventHandler = ( ( spr : ISprite , evt : CanvasKeyBoardEvent  ) => void ) ;
// export type RenderEventHandler = ( spr : ISprite , context : CanvasRenderingContext2D , renderOreder : EOrder ) => void ;

export interface ISprite extends ITransformable, IRenderState {
    name: string; // 当前图形的名称
    // shape: IShape; // Isprite 引用了一个IShape接口， 如draw 和 hitTest 都
}
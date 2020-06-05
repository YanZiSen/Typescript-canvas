class RenderStateStack {
    private _stack:RenderState [] = [new RenderState()]

    public save (): RenderState {
        let context = new RenderState()
        this._stack.push(context)
        return context
    }

    public restore () {
        this._stack.pop()
    }

    public get _currentState () :RenderState {
        return this._stack[this._stack.length - 1]
    }

    public get fillStyle () :string {
        return this._currentState.fillStyle
    }

    public set fillStyle (val:string) {
        this._currentState.fillStyle = val
    }
    public get lineWidth () :number {
        return this._currentState.lineWidth
    }
}

// class RenderState {
//     public fillStyle:string
//     public strokeStyle: string
//     public lineWidth: number

//     constructor () {
//         this.fillStyle = '#afa'
//         this.strokeStyle = '#aaa'
//         this.lineWidth = 1
//     }

//     public get fillStyle ():string {

//     }
//     public set fillStyle (val):void {

//     }
// }

class RenderState {
    public lineWidth:number = 1
    public fillStyle:string = 'green'
    public strokeStyle:string = 'red'

    public clone () :RenderState {
        let state: RenderState = new RenderState()
        state.lineWidth = this.lineWidth
        state.fillStyle = this.fillStyle
        state.strokeStyle = this.strokeStyle
        return state
    }
}
class Canvas2D {
    public context: CanvasRenderingContext2D;
    private centerX: number = 20
    private centerY: number = 20
    private startTime: number = Date.now()
    private step: number = 10
    public constructor (el:HTMLCanvasElement) {
        this.context = el.getContext('2d') as CanvasRenderingContext2D
    }
    public draw () :void {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height)
        this.context.save()
        this.context.fillStyle = '#f00'
        this.context.strokeStyle = '#0f0'
        this.context.beginPath()
        this.context.arc(this.centerX, this.centerY, 20, 0, Math.PI * 2)
        this.context.fill()
        this.context.restore()
    }
    public animate (): void {
        let now:number = Date.now()
        let interval = now - this.startTime
        this.centerX += interval * this.step / 1000
        this.startTime = Date.now()
        this.draw()
        requestAnimationFrame(this.animate.bind(this))
    }
    public start () : void {
        this.startTime = Date.now()
        requestAnimationFrame(this.animate.bind(this))
    }
}

let canvas:HTMLCanvasElement = document.getElementById('app') as HTMLCanvasElement

let instance = new Canvas2D(canvas)

instance.start()
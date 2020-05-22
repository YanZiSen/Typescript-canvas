export type TimerCallback = (id: number, data: any) => void

class Timer {
    public id: number = -1
    public enabled: boolean = true
    public callback: TimerCallback

    constructor (callback: TimerCallback) {
        this.callback = callback
    }
}
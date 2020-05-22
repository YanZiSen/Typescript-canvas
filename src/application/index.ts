import {Application} from './application'
import {ApplicationTest} from './ApplicationTest'

let canvas:HTMLCanvasElement|null = document.getElementById('canvas') as HTMLCanvasElement
let stopBtn:HTMLElement|null = document.getElementById('stop')
let startBtn:HTMLElement|null = document.getElementById('start')

let app:Application = new ApplicationTest(canvas)

app.update(0, 0)
app.render()
if (startBtn) {
    startBtn.addEventListener('click', () => {
        app.start()
    }, false) 
}

if (stopBtn) {
    stopBtn.addEventListener('click', () => {
        app.stop()
    })
}



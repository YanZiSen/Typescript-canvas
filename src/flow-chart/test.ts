import {App} from './index'

let canvasC:HTMLElement = document.getElementById('containerC')
let dragList:NodeList = document.querySelectorAll('.drag-item')
let rect: DOMRect = canvasC.getBoundingClientRect()
console.log('rect', rect)
let canvas:HTMLCanvasElement = document.createElement('canvas')
canvas.setAttribute('width', rect.width + '')
canvas.setAttribute('height', rect.height + '')
canvasC.appendChild(canvas)

Array.from(dragList).forEach((item, idx) => {
    item.addEventListener('dragstart', (e) => {
        let evt = e as DragEvent
        let target = e.target as HTMLElement
        evt.dataTransfer.setData('text/plain', JSON.stringify({type: idx + 1}))
    }, false)
})

let app = new App(canvas)

canvasC.addEventListener('dragenter', e => e.preventDefault())
canvasC.addEventListener('dragover', e => e.preventDefault())
canvasC.addEventListener('drop', (e) => {
    let transferData = JSON.parse(e.dataTransfer.getData('text'))
    let type = parseInt(transferData.type)
    app.addShape(e, type)
})
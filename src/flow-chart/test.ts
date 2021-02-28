import {App} from './index'

let canvasC:HTMLElement = document.getElementById('containerC')
let dragList:NodeList = document.querySelectorAll('.drag-item')
let rect: DOMRect = canvasC.getBoundingClientRect()

let canvas:HTMLCanvasElement = document.createElement('canvas')
canvas.setAttribute('width', rect.width + '')
canvas.setAttribute('height', rect.height + '')
canvasC.appendChild(canvas)

Array.from(dragList).forEach((item, idx) => {
    item.addEventListener('dragstart', (e) => { // 此处事件绑定仅用于测试
        let evt = e as DragEvent
        let target = e.target as HTMLElement
        evt.dataTransfer.setData('text/plain', JSON.stringify({type: idx + 1}))
    }, false)
})

let app = new App(canvas, {
    onDelete (sprite) {
        console.log('sprite is delete', sprite);
    },
    onActive: (spr) => console.log,
    onCancelActive: (spr) => console.log,
    onAddShape: () => console.log,
    onLinked: (spr) => console.log,
    stretchX: (x: number) => console.log,
    stretchY: (y: number) => console.log,
})

document.getElementById('removeAll').addEventListener('click', () => app.removeAll());
document.getElementById('getAll').addEventListener('click', () => {
    console.log(app.getSprites());
});


canvasC.addEventListener('dragenter', e => e.preventDefault())
canvasC.addEventListener('dragover', e => e.preventDefault())
canvasC.addEventListener('drop', (e) => {
    let transferData = JSON.parse(e.dataTransfer.getData('text'))
    let type = parseInt(transferData.type)
    app.addShape(e, type)
})

let sprites = [
    {
        "text":"矩形1",
        "transform":{
            "position":{
                "values":{
                    "0":157,
                    "1":95
                }
            },
            "rotation":0,
            "scale":{
                "values":{
                    "0":1,
                    "1":1
                }
            }
        },
        "data":{
            "outLines":[
                "4b13f2e6-6209-4545-8cf2-cafcacfdf682"
            ]
        },
        "id":"cb974507-a0ec-449d-83d2-5f12d92aa8eb",
        "width":90,
        "height":60,
        "u":0.5,
        "v":0.5,
        "type":1
    },
    {
        "text":"矩形2",
        "transform":{
            "position":{
                "values":{
                    "0":371,
                    "1":151
                }
            },
            "rotation":0,
            "scale":{
                "values":{
                    "0":1,
                    "1":1
                }
            }
        },
        "data":{
            "inputLines":[
                "4b13f2e6-6209-4545-8cf2-cafcacfdf682"
            ],
            "outLines":[
                "6c9c1d8d-dbb1-46f1-bd41-9fff5f9a6b82"
            ]
        },
        "id":"402f883b-0af9-4e28-ae92-b3362d85d925",
        "width":60,
        "height":60,
        "u":0.5,
        "v":0.5,
        "type":2,
        "radius":10
    },
    {
        "text":"矩形3",
        "transform":{
            "position":{
                "values":{
                    "0":642,
                    "1":91
                }
            },
            "rotation":0,
            "scale":{
                "values":{
                    "0":1,
                    "1":1
                }
            }
        },
        "data":{
            "inputLines":[
                "6c9c1d8d-dbb1-46f1-bd41-9fff5f9a6b82"
            ]
        },
        "id":"983fd58c-1255-4771-94d1-c523110b7133",
        "width":146,
        "height":60,
        "u":0.5,
        "v":0.5,
        "type":3,
        "radius":30
    },
    {
        "text":"文字测试",
        "transform":{
            "position":{
                "values":{
                    "0":0,
                    "1":0
                }
            },
            "rotation":0,
            "scale":{
                "values":{
                    "0":1,
                    "1":1
                }
            }
        },
        "data":{
            "sourceId":"cb974507-a0ec-449d-83d2-5f12d92aa8eb",
            "targetId":"402f883b-0af9-4e28-ae92-b3362d85d925"
        },
        "id":"4b13f2e6-6209-4545-8cf2-cafcacfdf682",
        "type":13,
        "end":{
            "values":{
                "0":341,
                "1":151
            }
        },
        "start":{
            "values":{
                "0":202,
                "1":95
            }
        },
        "startPos":0,
        "endPos":3
    },
    {
        "text":"文字测试",
        "transform":{
            "position":{
                "values":{
                    "0":0,
                    "1":0
                }
            },
            "rotation":0,
            "scale":{
                "values":{
                    "0":1,
                    "1":1
                }
            }
        },
        "data":{
            "sourceId":"402f883b-0af9-4e28-ae92-b3362d85d925",
            "targetId":"983fd58c-1255-4771-94d1-c523110b7133"
        },
        "id":"6c9c1d8d-dbb1-46f1-bd41-9fff5f9a6b82",
        "type":13,
        "end":{
            "values":{
                "0":569,
                "1":91
            }
        },
        "start":{
            "values":{
                "0":401,
                "1":151
            }
        },
        "startPos":0,
        "endPos":3
    }
]

sprites.forEach((sprite) => {
    app.addShapeFromData(sprite)
})
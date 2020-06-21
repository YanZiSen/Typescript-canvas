let inputEl:HTMLInputElement = document.getElementById('upload') as HTMLInputElement

inputEl.addEventListener('change', getFile, false)

const ALLOWLIST = ['image/jpeg', 'image/jpg', 'image/png']
const MAX_SIZE = 1024 * 1024 * 3

function getFile (e: Event):void {
    const target = e.target as HTMLInputElement
    let file: File= target.files && target.files[0]
    let {type: fileType, size: fileSize} = file
    if (!ALLOWLIST.includes(fileType)) {
        alert('文件类型不支持')
        target.value = ''
        return
    }
    if (fileSize > MAX_SIZE) {
        alert('文件过大')
        target.value = ''
        return
    }
    readFile(file, (data) => compress(data, sendToRemote))
}



function readFile (file: File, callback: (data: string, cb?:any) => void) : void {
    let fsReader:FileReader = new FileReader()
    // let fsReader = new FileReader()
    fsReader.readAsDataURL(file)
    fsReader.onload = function (e:Event) {
       let result:string = <string>fsReader.result
       callback && callback(result)
       fsReader = null 
    }
}

function compress (fileStr: string, cb: (data: string) => void) {
    let img:HTMLImageElement = new Image()
    let maxH = 1024, maxW = 1024
    img.src = fileStr
    img.addEventListener('load', function (e:Event) {
        let {naturalHeight, naturalWidth} = img
        let needCompress = false
        if (naturalWidth > maxW) {
            needCompress = true
            let radio = naturalWidth / maxW 
            maxH = naturalHeight / radio
        }
        if (naturalHeight > maxH) {
            needCompress = true
            let radio = naturalHeight / maxH
            maxW = naturalWidth / radio
        }
        if (!needCompress) {
            maxW = naturalWidth
            maxH = naturalHeight
        }
        let canvas:HTMLCanvasElement = document.createElement('canvas')
        canvas.width = maxW
        canvas.height = maxH
        canvas.style.visibility = 'hidden'
        document.body.appendChild(canvas)
        let context:CanvasRenderingContext2D = canvas.getContext('2d')
        console.log('maxW', 'maxH', maxW, maxH)
        context.drawImage(img, 0, 0, maxW, maxH)
        let result:string = canvas.toDataURL('image/jpeg', 0.8)
        cb && cb(result)
        canvas.remove()
    })
}

function sendToRemote (data: string) {
    console.log('send to server...', data)
}


var Canvas2DUtil = /** @class */ (function () {
    // public 访问级别的构造函数
    function Canvas2DUtil(canvas) {
        this.context = canvas.getContext('2d');
    }
    // public 访问级别的成员函数
    Canvas2DUtil.prototype.drawText = function (text) {
        // canvas2D和webGL 这种底层绘图API都是状态机模式
        // 每次绘制前调用save将即将要修改的状态记录下来
        // 每次绘制后调用restore将已修改的状态丢弃，恢复到初始化时的状态
        // 这样的好处时状态不会混乱
        // 假设当前绘制文本使用红色，如果你没有使用save/restore 绘制函数的话
        // 则下次调用绘图函数时，如果你没更改颜色，则会继续使用跟上次绘制的红色进行绘制
        // 随着程序越来越复杂，如不使用save/restore 来管理，最后整个渲染状态会机器混乱
        // 请时刻保持使用save/restore配对函数来管理渲染状态
        this.context.save();
        this.context.textBaseline = 'middle';
        this.context.textAlign = 'center';
        var centerX = this.context.canvas.width * 0.5;
        var centerY = this.context.canvas.height * 0.5;
        this.context.fillStyle = 'red';
        this.context.fillText(text, centerX, centerY);
        this.context.strokeStyle = 'green';
        this.context.strokeText(text, centerX, centerY);
        this.context.restore();
    };
    return Canvas2DUtil;
}());
var canvas = document.getElementById('canvas');
if (canvas === null) {
    throw new Error('没有找到canvas元素');
}
var canvas2d = new Canvas2DUtil(canvas);
canvas2d.drawText('HeHe');

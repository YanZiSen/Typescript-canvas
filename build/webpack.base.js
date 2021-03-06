const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        'render-text': path.join(__dirname, '../src/render-text/main.ts'),
        'image-compress': path.join(__dirname, '../src/image-compress/index.ts'), 
        'animation': path.join(__dirname, '../src/animation/index.ts'),
        'application': path.join(__dirname, '../src/application/index.ts'),
        'canvas-t': path.join(__dirname, '../src/canvas-t/index.ts'),
        'flow-chart': path.join(__dirname, '../src/flow-chart/test.ts'),
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, '../dist'),
        library: 'chart',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_module/ 
            },
            {
                test: /\.(png|jpg|svg|gif)$/, 
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../src/render-text/index.html'),
            filename: 'render-text.html',
            chunks: ['render-text'],
            inject: true
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../src/animation/index.html'),
            filename: 'animation.html',
            chunks: ['animation'],
            inject: true
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../src/application/index.html'),
            filename: 'application.html',
            chunks: ['application'],
            inject: true
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../src/image-compress/index.html'),
            filename: 'image-compress.html',
            chunks: ['image-compress'],
            inject: true
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../src/canvas-t/index.html'),
            filename: 'canvas-t.html',
            chunks: ['canvas-t'],
            inject: true
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../src/flow-chart/index.html'),
            filename: 'flow-chart.html',
            chunks: ['flow-chart'],
            inject: true
        })
        // 
    ]
}

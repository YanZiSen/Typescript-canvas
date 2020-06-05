const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        'render-text': path.join(__dirname, '../src/render-text/main.ts'),
        'animation': path.join(__dirname, '../src/animation/index.ts'),
        'application': path.join(__dirname, '../src/application/index.ts'),
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, '../dist')
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
        })
    ]
}

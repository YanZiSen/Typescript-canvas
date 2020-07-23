const merge = require('webpack-merge')
const webpack = require('webpack')
const baseConfig = require('./webpack.base')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = /**merge(baseConfig,*/ {
    entry: {
        'flow-chart': path.join(__dirname, '../src/flow-chart/index.ts'),
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
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../src/flow-chart/index.html'),
            filename: 'flow-chart.html',
            chunks: ['flow-chart'],
            inject: true
        })
    ],
    mode: 'production'
}
/** ) */
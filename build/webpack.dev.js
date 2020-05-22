const merge = require('webpack-merge')
const webpack = require('webpack')
const baseConfig = require('./webpack.base')

const webpackConfig = merge(baseConfig, {
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    mode: "development",
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: '../dist',
        watchContentBase: true,
        hot: true,
        overlay: true,
        port: 3003
    }
})

module.exports = webpackConfig
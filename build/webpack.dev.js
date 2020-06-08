const merge = require('webpack-merge')
const webpack = require('webpack')
const baseConfig = require('./webpack.base')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')


const webpackConfig = merge(baseConfig, {
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../static'),
                    to: path.resolve(__dirname, '../dist/static'),
                    globOptions: {
                        ignore: [
                          // Ignore all `txt` files
                          '.*',
                        ],
                    },
                }
            ]
        })
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
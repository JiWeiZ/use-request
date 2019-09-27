const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        main: './example/index.js',
    },
    devServer: {
        hot: true,
        disableHostCheck: true,
        port: 3334,
        open: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Use Request',
            filename: 'index.html',
            template: './example/index.html',
        }),
    ],
})
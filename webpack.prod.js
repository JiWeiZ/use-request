const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const DIST = path.resolve(__dirname, './dist');

module.exports = merge(common, {
    mode: 'production',
    entry: {
        main: './src/index.ts',
    },
    output: {
        path: DIST,
        filename: 'index.js',
        library: 'useRequest',
        libraryTarget: 'umd',
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
    optimization: {
        minimizer: [new UglifyJsPlugin()],
    },
    externals: {
        react: 'react',
    },
});

const babelOptions = require('./.babelrc.json');

module.exports = {
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelOptions,
                    },
                    {
                        loader: 'ts-loader',
                    },
                ],
                exclude: [/node_modules/, /\*.d.ts/],
            },
            {
                test: /\.(js|jsx)$/,
                options: babelOptions,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        mainFields: ['es2015', 'module', 'main'],
    },
};

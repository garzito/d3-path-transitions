var webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        './src/index.js'
    ],
    module: {
        // preLoaders: [
        //     {
        //         test: /\.js?$/,
        //         exclude: /node_modules/,
        //         loader: 'eslint-loader'
        //     }
        // ],
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel'
            },
            {
                test: /\.scss$/,
                loader: 'css!sass'
            }
        ]
    },
    output: {
        path: 'dist',
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [],
    eslint: {
        configFile: './.eslintrc'
    }
};
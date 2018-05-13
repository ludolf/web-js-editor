const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: './src/jseditor.js',
    output: {
        filename: 'jseditor.js',
        path: path.resolve(__dirname, 'dist', 'js')
    },
    module: {
        rules: [ {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    externals: {
      'jquery-slim': 'jQuery'
    },
    plugins: [
        new CleanWebpackPlugin([
            'dist'
        ]),
        new CopyWebpackPlugin([{
               from: 'resources/*',
               to: path.resolve(__dirname, 'dist'),
               flatten: true
            }, {
               from: 'node_modules/jquery-slim/dist/jquery.slim.min.js',
               to: path.resolve(__dirname, 'dist/js/jquery'),
               flatten: true
            }, {
               from: 'node_modules/ace-builds/src-min-noconflict/mode-javascript.js',
               to: path.resolve(__dirname, 'dist/js/ace'),
               flatten: true
            }, {
               from: 'node_modules/ace-builds/src-min-noconflict/worker-javascript.js',
               to: path.resolve(__dirname, 'dist/js/ace'),
               flatten: true
            }, {
               from: 'node_modules/ace-builds/src-min-noconflict/theme-clouds.js',
               to: path.resolve(__dirname, 'dist/js/ace'),
               flatten: true
            }, {
               from: 'node_modules/ace-builds/src-min-noconflict/theme-dracula.js',
               to: path.resolve(__dirname, 'dist/js/ace'),
               flatten: true
            }
        ])
    ]
}
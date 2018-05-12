const path = require('path');

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
            }, {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    }
}
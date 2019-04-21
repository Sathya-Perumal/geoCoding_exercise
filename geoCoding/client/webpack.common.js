const htmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');

module.exports = {
    entry: './src/scripts/index.js',      
    module:{
        rules : [{
            test : /\.(jsx||js)$/,
            exclude : /node_modules/,
            use : {
                loader : "babel-loader"
            }

        },
        {
            test : /\.html$/,
            exclude : /node_modules/,
            use : {
                loader : "html-loader"
            }

        }, 
        {
            test:/\.css$/,
            use:['style-loader','css-loader']
        }
       ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
      },
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'bundle.js'
    },
    plugins : [
        new htmlWebpackPlugin({
            template: "./src/index.html",
            filename: "./index.html"     
        }),
        
    ]

}
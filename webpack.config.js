var fs      = require('fs');
var path    = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        homepage: [
            // 'webpack/hot/dev-server',
            path.resolve('./app/homepage/index.js')
        ],
        login: [
            // 'webpack/hot/dev-server',
            path.resolve('./app/login/index.js')
        ]
    },
    output: {
        path: path.resolve(__dirname, 'assets/js'),
        filename: '[name].js',
        publicPath: "/assets/js/"
    },
	module: {
	    loaders: [
          { test: /\.html$/, loader: "dot-loader" }
        ]
	}
};

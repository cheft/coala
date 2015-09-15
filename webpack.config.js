var fs      = require('fs');
var path    = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        homepage: [
            'webpack/hot/dev-server',
            path.resolve('./modules/homepage/index.js')
        ]
    },
    output: {
        path: path.resolve(__dirname, 'assets/js'),
        filename: 'homepage.js',
        publicPath: "/assets/js/"
    },
	module: {
	    loaders: [
          { test: /\.dot$/, loader: "dot-loader" }
        ]
	}
};

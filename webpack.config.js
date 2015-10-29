var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: {
    homepage: [
      'webpack/hot/dev-server',
      path.resolve('./app/homepage/index.js')
    ],
    login: [
      'webpack/hot/dev-server',
      path.resolve('./app/login/index.js')
    ],
    mytodo: [
      'webpack/hot/dev-server',
      path.resolve('./app/mytodo/index.js')
    ]
  },
  output: {
    path: path.resolve(__dirname, 'assets/js'),
    filename: '[name].js',
    publicPath: '/assets/js/'
  },
  module: {
    loaders: [{
      test: /\.html$/,
      loader: 'dot-loader'
    },
    {
      test: /\.css$/,
      loader: 'style!css'
    }]
  }
};

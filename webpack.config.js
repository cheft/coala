var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: {
    docs: [
      // 'webpack/hot/dev-server',
      path.resolve('./docs/main.js')
    ],
    todomvc: [
      // 'webpack/hot/dev-server',
      path.resolve('./examples/components/todomvc/main.js')
    ],
    dbmonster: [
      // 'webpack/hot/dev-server',
      path.resolve('./examples/components/dbmonster/main.js')
    ],
    bootstrap: [
      // 'webpack/hot/dev-server',
      path.resolve('./examples/integrates/bootstrap/main.js')
    ],
    sui: [
      // 'webpack/hot/dev-server',
      path.resolve('./examples/integrates/sui/main.js')
    ],
    adminlte: [
      // 'webpack/hot/dev-server',
      path.resolve('./examples/integrates/adminlte/main.js')
    ],
    qfang: [
      // 'webpack/hot/dev-server',
      path.resolve('./examples/components/qfang/main.js')
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [{
      test: /\.html$/,
      loader: 'coala-dot-loader'
    },
    { test: /\.md$/, loader: "html!markdown" },
    {
      test: /\.css$/,
      loader: 'style!css'
    }]
  }
};

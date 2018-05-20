var path = require('path');
var webpack = require('webpack');

module.exports = {
  target: 'node',
  entry: path.resolve(__dirname, 'src', 'server.tsx'),
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: ['babel-loader', 'awesome-typescript-loader'],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};

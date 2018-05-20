var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: path.resolve('src', 'index.tsx'),
  output: {
    filename: 'bundle.js',
    path: path.resolve('dist', 'assets')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'awesome-typescript-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.css', '.woff', '.woff2', '.eot', '.ttf', '.otf']
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, 'manifest.json') },
      { from: path.resolve(__dirname, 'browserconfig.xml') },
      { from: path.resolve(__dirname, 'src/icons'), to: 'icons' }
    ]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
};

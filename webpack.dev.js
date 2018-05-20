var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:9966',
    'webpack/hot/only-dev-server',
    path.resolve(__dirname, 'src', 'index.tsx')
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  devtool: 'source-map',
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
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
      { from: path.resolve(__dirname, 'index.html') },
      { from: path.resolve(__dirname, 'manifest.json'), to: 'assets' },
      { from: path.resolve(__dirname, 'browserconfig.xml'), to: 'assets' },
      { from: path.resolve(__dirname, 'src/icons'), to: 'assets/icons' }
    ]),
    new webpack.EnvironmentPlugin({ 'NODE_ENV': 'development' }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};

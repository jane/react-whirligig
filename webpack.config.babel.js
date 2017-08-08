import webpack from 'webpack'
import { resolve } from 'path'

const pub = resolve(__dirname, 'docs')

export default {
  entry: {
    demo: './dev.js',
    index: './src/track/index.js'
  },
  output: {
    path: pub,
    filename: '[name].js',
    library: 'react-track',
    libraryTarget: 'umd'
  },

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname
      }
    })
  ],
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    contentBase: pub,
    compress: true,
    port: 9090
  }
}

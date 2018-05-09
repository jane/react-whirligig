import webpack from 'webpack'
import { resolve } from 'path'

const pub = resolve(__dirname, 'docs')

export default {
  mode: 'production',
  entry: {
    demo: './dev.js',
    index: './src/whirligig.js',
  },
  output: {
    path: pub,
    filename: '[name].js',
    library: 'react-track',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
      },
    }),
  ],
  devtool: 'inline-source-map',
  devServer: {
    host: '0.0.0.0',
    contentBase: pub,
    compress: true,
    port: 9090,
  },
  performance: {
    hints: false,
  },
}

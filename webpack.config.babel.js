import webpack from 'webpack'

const { NODE_ENV } = process.env

export default {
  entry: {
    demo: './dev.js',
    index: './src/track/index.js'
  },
  output: {
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
  devtool: NODE_ENV !== 'production' ? '#source-map' : '',
  devServer: {
    host: '0.0.0.0',
    contentBase: __dirname,
    compress: true,
    port: 9090
  }
}

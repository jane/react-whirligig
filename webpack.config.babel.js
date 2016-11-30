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
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader'
    }]
  },
  plugins: [ // https://github.com/webpack/webpack/issues/3018#issuecomment-248633498
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname
        // ...other configs that used to directly on `modules.exports`
      }
    })// ,
    // TODO: prod config?
    // new ExtractTextPlugin({ filename: 'dist/[name].css', disable: false, allChunks: true })
  ],

  devtool: NODE_ENV !== 'production' ? 'eval-source-map' : '',
  devServer: {
    contentBase: __dirname,
    compress: true,
    port: 9090
  }

}

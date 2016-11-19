import { join } from 'path'
import webpack from 'webpack'
import postCSSMixins from 'postcss-mixins'
import postCSSImport from 'postcss-import'
import postCSSCSSNext from 'postcss-cssnext'
// import ExtractTextPlugin from 'extract-text-webpack-plugin'

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
    }, {
      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules that inject <style> tags.
      // In production, we use a plugin to extract that CSS to a file, but
      // in development "style" loader enables hot editing of CSS.
      test: /\.css$/,
      loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[local]__[hash:base64:9]!postcss-loader'
    }]
  },
  plugins: [ // https://github.com/webpack/webpack/issues/3018#issuecomment-248633498
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
        postcss: [ // <---- postcss configs go here under LoadOptionsPlugin({ options: { ??? } })
          postCSSMixins(),
          postCSSImport({ path: join(__dirname, 'src') }),
          postCSSCSSNext({
            browsers: [
              '>1%',
              'last 4 versions',
              'Firefox ESR',
              'not ie < 11'
            ]
          })
        ]
        // ...other configs that used to directly on `modules.exports`
      }
    })// ,
    // TODO: prod config?
    // new ExtractTextPlugin({ filename: 'dist/[name].css', disable: false, allChunks: true })
  ],

  devtool: NODE_ENV !== 'production' ? 'cheap-module-eval-source-map' : '',
  devServer: {
    contentBase: __dirname,
    compress: true,
    port: 9090
  }

}

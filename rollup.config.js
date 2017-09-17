import nodeResolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import inject from 'rollup-plugin-inject'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import pkg from './package.json'

const processShim = '\0process-shim'

const output = [
  { file: pkg.main, format: 'umd'},
  { file: pkg.module, format: 'es' }
]

const plugins = [
  {
    resolveId (importee) {
      return importee === processShim ? importee : null
    },
    load (id) {
      return id === processShim ? 'export default { argv: [], env: {} }' : null
    }
  },
  replace({ 'process.env.NODE_ENV': JSON.stringify('production'), }),
  inject({ process: processShim, }),
  babel({
    babelrc: false,
    presets: [
      [ 'env', { modules: false } ],
      'stage-3',
      'react',
    ],
    plugins: [
      'external-helpers',
      'transform-class-properties',
      [ 'transform-react-remove-prop-types', {
        removeImport: true
      }]
    ]
  }),
  nodeResolve(),
  commonjs({ ignoreGlobal: true }),
  json()
]

export default {
  input: 'src/whirligig.js',
  name: 'react-whirligig',
  external: [ 'react', 'react-dom' ],
  exports: 'named',
  output,
  plugins,
  globals: { react: 'React', 'react-dom': 'ReactDOM' },
}

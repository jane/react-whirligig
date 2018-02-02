import nodeResolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import inject from 'rollup-plugin-inject'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import pkg from './package.json'

const processShim = '\0process-shim'

const plugins = [
  {
    resolveId (importee) {
      return importee === processShim ? importee : null
    },
    load (id) {
      return id === processShim ? 'export default { argv: [], env: {} }' : null
    }
  },
  replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  inject({ process: processShim }),
  babel({
    babelrc: false,
    presets: [
      'flow',
      ['env', {
        targets: ['>1%', 'last 3 versions', 'Firefox ESR', 'ie >= 11'],
        modules: false
      }],
      'stage-3',
      'react'
    ],
    plugins: [
      'external-helpers',
      'transform-class-properties'
    ]
  }),
  nodeResolve(),
  commonjs({ ignoreGlobal: true }),
  json()
]

const name = 'react-whirligig'
const globals = { react: 'React', 'react-dom': 'ReactDOM' }

const output = [
  { file: pkg.main, format: 'umd', name, globals, exports: 'named' },
  { file: pkg.module, format: 'es', name, globals, exports: 'named' }
]

export default {
  input: 'src/whirligig.js',
  external: [ 'react', 'react-dom' ],
  output,
  plugins
}

import nodeResolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import inject from 'rollup-plugin-inject'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

const processShim = '\0process-shim'

const plugins = [
  {
    resolveId(importee) {
      return importee === processShim ? importee : null
    },
    load(id) {
      return id === processShim ? 'export default { argv: [], env: {} }' : null
    },
  },
  replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  inject({ process: processShim }),
  babel({
    babelrc: false,
    presets: [
      [
        '@babel/preset-env',
        {
          targets: ['>1%', 'last 3 versions', 'Firefox ESR', 'ie >= 11'],
          modules: false,
        },
      ],
      '@babel/preset-react',
    ],
    plugins: ['@babel/plugin-proposal-class-properties'],
  }),
  nodeResolve(),
  commonjs({ ignoreGlobal: true }),
]

const name = 'react-whirligig'
const globals = { react: 'React', 'react-dom': 'ReactDOM' }

const output = [
  { file: pkg.main, format: 'umd', name, globals, exports: 'named' },
  { file: pkg.module, format: 'es', name, globals, exports: 'named' },
]

export default {
  input: 'src/whirligig.js',
  external: ['react', 'react-dom'],
  output,
  plugins,
}

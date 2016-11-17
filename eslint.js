module.exports = {
  root: true,

  parser: 'babel-eslint',

  // import plugin is temporarily disabled, scroll below to see why
  plugins: [/*'import', */ 'jsx-a11y', 'react'],

  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true
  },

  globals: {
    _jane: false,
    jnet: false,
    ja: false
  },

  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      generators: true,
      experimentalObjectRestSpread: true
    }
  },

  settings: {
    'import/ignore': [
      'node_modules',
      '\\.(json|css|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$',
    ],
    'import/extensions': ['.js'],
    'import/resolver': {
      node: {
        extensions: ['.js', '.json']
      }
    }
  },

  rules: {
    // http://eslint.org/docs/rules/
    'array-callback-return': 'warn',
    'arrow-parens': ['warn', 'always'],
    'arrow-spacing': ['warn', { 'before': true, 'after': true }],
    'block-spacing': ['warn', 'always'],
    'brace-style': ['warn', '1tbs', { 'allowSingleLine': true }],
    'camelcase': ['warn', { 'properties': 'never' }],
    'comma-dangle': ['error', 'never'],
    'comma-spacing': ['warn', { 'before': false, 'after': true }],
    'comma-style': ['warn', 'last'],
    'constructor-super': 'warn',
    'curly': ['warn', 'multi-line'],
    'default-case': ['warn', { commentPattern: '^no default$' }],
    'dot-location': ['warn', 'property'],
    'eol-last': 'error',
    eqeqeq: ['warn', 'allow-null'],
    'func-call-spacing': ['warn', 'never'],
    'generator-star-spacing': ['warn', { before: true, after: true }],
    'guard-for-in': 'warn',
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'jsx-quotes': ['warn', 'prefer-double'],
    'key-spacing': ['warn', { 'beforeColon': false, 'afterColon': true }],
    'keyword-spacing': ['warn', { 'before': true, 'after': true }],
    'max-len': ['warn', 120],
    'new-cap': ['error', { 'newIsCap': true, 'capIsNew': false }],
    'new-parens': 'warn',
    'no-array-constructor': 'warn',
    'no-caller': 'warn',
    'no-class-assign': 'warn',
    'no-cond-assign': ['warn', 'always'],
    'no-const-assign': 'warn',
    'no-constant-condition': ['warn', { 'checkLoops': false }],
    'no-control-regex': 'warn',
    'no-debugger': 'warn',
    'no-delete-var': 'warn',
    'no-dupe-args': 'warn',
    'no-dupe-class-members': 'warn',
    'no-dupe-keys': 'warn',
    'no-duplicate-case': 'warn',
    'no-duplicate-imports': 'error',
    'no-empty-character-class': 'warn',
    'no-empty-pattern': 'warn',
    'no-eval': 'error',
    'no-ex-assign': 'warn',
    'no-extend-native': 'error',
    'no-extra-bind': 'warn',
    'no-extra-label': 'warn',
    'no-extra-parens': ['warn', 'functions'],
    'no-fallthrough': 'warn',
    'no-func-assign': 'warn',
    'no-global-assign': 'error',
    'no-implied-eval': 'warn',
    'no-invalid-regexp': 'warn',
    'no-irregular-whitespace': 'warn',
    'no-iterator': 'warn',
    'no-label-var': 'warn',
    'no-labels': ['warn', { allowLoop: false, allowSwitch: false }],
    'no-lone-blocks': 'warn',
    'no-loop-func': 'warn',
    'no-mixed-operators': ['warn', {
      groups: [
        ['&', '|', '^', '~', '<<', '>>', '>>>'],
        ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
        ['&&', '||'],
        ['in', 'instanceof']
      ],
      allowSamePrecedence: false
    }],
    'no-mixed-spaces-and-tabs': 'error',
    'no-multi-str': 'warn',
    'no-multiple-empty-lines': ['warn', { 'max': 1 }],
    'no-native-reassign': 'warn',
    'no-negated-in-lhs': 'warn',
    'no-new-func': 'warn',
    'no-new-object': 'warn',
    'no-new-require': 'warn',
    'no-new-symbol': 'warn',
    'no-new-wrappers': 'warn',
    'no-obj-calls': 'warn',
    'no-octal': 'warn',
    'no-octal-escape': 'warn',
    'no-path-concat': 'warn',
    'no-proto': 'warn',
    'no-redeclare': 'warn',
    'no-regex-spaces': 'warn',
    'no-restricted-syntax': [
      'warn',
      'LabeledStatement',
      'WithStatement',
    ],
    'no-return-assign': ['warn', 'except-parens'],
    'no-script-url': 'warn',
    'no-self-assign': 'warn',
    'no-self-compare': 'warn',
    'no-sequences': 'warn',
    'no-shadow-restricted-names': 'warn',
    'no-sparse-arrays': 'warn',
    'no-template-curly-in-string': 'warn',
    'no-tabs': 'error',
    'no-this-before-super': 'warn',
    'no-throw-literal': 'warn',
    'no-trailing-spaces': 'warn',
    'no-undef': 'error',
    'no-undef-init': 'error',
    'no-unexpected-multiline': 'warn',
    'no-unneeded-ternary': ['warn', { 'defaultAssignment': false }],
    'no-unreachable': 'warn',
    'no-unsafe-finally': 'warn',
    'no-unsafe-negation': 'warn',
    'no-unused-expressions': ['warn', {
      'allowTernary': true,
      'allowShortCircuit': true
    }],
    'no-unused-labels': 'warn',
    'no-unused-vars': ['warn', {
      vars: 'local',
      varsIgnorePattern: '^_',
      args: 'none'
    }],
    'no-use-before-define': ['warn', 'nofunc'],
    'no-useless-call': 'warn',
    'no-useless-computed-key': 'warn',
    'no-useless-concat': 'warn',
    'no-useless-constructor': 'warn',
    'no-useless-escape': 'warn',
    'no-useless-rename': ['warn', {
      ignoreDestructuring: false,
      ignoreImport: false,
      ignoreExport: false,
    }],
    'no-var': 'warn',
    'no-with': 'error',
    'no-whitespace-before-property': 'warn',
    'object-curly-spacing': ['warn', 'always'],
    'object-property-newline': ['warn', {
      'allowMultiplePropertiesPerLine': true
    }],
    'operator-assignment': ['warn', 'always'],
    'operator-linebreak': ['warn', 'after', {
      'overrides': {
        '?': 'before',
        ':': 'before'
      }
    }],
    'padded-blocks': ['warn', 'never'],
    quotes: ['error', 'single', {
      'avoidEscape': true
    }],
    radix: 'warn',
    'require-yield': 'warn',
    'rest-spread-spacing': ['warn', 'never'],
    semi: ['warn', 'never'],
    'semi-spacing': ['warn', { 'before': false, 'after': true }],
    'space-before-blocks': ['warn', 'always'],
    'space-before-function-paren': ['warn', 'always'],
    'space-in-parens': ['warn', 'never'],
    'space-infix-ops': 'warn',
    'space-unary-ops': ['warn', { 'words': true, 'nonwords': false }],
    'spaced-comment': ['warn', 'always', {
      'line': {
        'markers': ['*package', '!', ',']
      },
      'block': {
        'balanced': true,
        'markers': ['*package', '!', ','],
        'exceptions': ['*']
      }
    }],
    strict: ['warn', 'never'],
    'template-curly-spacing': ['warn', 'never'],
    'unicode-bom': ['error', 'never'],
    'use-isnan': 'warn',
    'valid-typeof': 'warn',
    'wrap-iife': ['warn', 'any'],
    'yield-star-spacing': ['warn', 'both'],
    yoda: ['warn', 'never'],

    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/

    // TODO: import rules are temporarily disabled because they don't play well
    // with how eslint-loader only checks the file you change. So if module A
    // imports module B, and B is missing a default export, the linter will
    // record this as an issue in module A. Now if you fix module B, the linter
    // will not be aware that it needs to re-lint A as well, so the error
    // will stay until the next restart, which is really confusing.

    // This is probably fixable with a patch to eslint-loader.
    // When file A is saved, we want to invalidate all files that import it
    // *and* that currently have lint errors. This should fix the problem.

    // 'import/default': 'warn',
    // 'import/export': 'warn',
    // 'import/named': 'warn',
    // 'import/namespace': 'warn',
    // 'import/no-amd': 'warn',
    // 'import/no-duplicates': 'warn',
    // 'import/no-extraneous-dependencies': 'warn',
    // 'import/no-named-as-default': 'warn',
    // 'import/no-named-as-default-member': 'warn',
    // 'import/no-unresolved': ['warn', { commonjs: true }],

    // https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules
    'react/jsx-boolean-value': 'warn',
    'react/jsx-curly-spacing': ['warn', 'never'],
    'react/jsx-equals-spacing': ['warn', 'never'],
    'react/jsx-indent': ['warn', 2],
    'react/jsx-indent-props': ['warn', 2],
    'react/jsx-no-bind': 'warn',
    'react/no-did-update-set-state': 'warn',
    'react/jsx-no-duplicate-props': ['warn', { ignoreCase: true }],
    'react/jsx-no-undef': 'warn',
    'react/jsx-space-before-closing': 'warn',
    'react/jsx-pascal-case': ['warn', {
      allowAllCaps: true,
      ignore: []
    }],
    'react/jsx-uses-react': 'warn',
    'react/jsx-uses-vars': 'warn',
    'react/no-deprecated': 'warn',
    'react/no-direct-mutation-state': 'warn',
    'react/no-is-mounted': 'warn',
    'react/no-unknown-property': 'warn',
    'react/prop-types': 'warn',
    'react/require-render-return': 'warn',
    'react/self-closing-comp': 'warn',

    // https://github.com/evcohen/eslint-plugin-jsx-a11y/tree/master/docs/rules
    'jsx-a11y/aria-role': 'warn',
    'jsx-a11y/aria-unsupported-elements': 'warn',
    'jsx-a11y/heading-has-content': 'warn',
    'jsx-a11y/href-no-hash': 'warn',
    'jsx-a11y/img-has-alt': 'warn',
    'jsx-a11y/img-redundant-alt': 'warn',
    'jsx-a11y/no-access-key': 'warn'
  }
}

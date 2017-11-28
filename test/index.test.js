/* eslint-disable react/jsx-no-bind, flowtype/require-return-type */

const { jsdom } = require('jsdom/lib/old-api')

import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

global.document = jsdom('')
global.window = document.defaultView

Object.keys(global.document).reduce((global, property) => {
  if (global[property] === undefined) {
    global[property] = global.document.defaultView[property]
  }
  return global
})

global.navigator = {
  userAgent: 'node.js'
}

const { jsdom } = require('jsdom/lib/old-api')

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

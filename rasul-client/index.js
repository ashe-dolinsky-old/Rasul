const stackTrace = require('stack-trace')
const axios = require('axios')

const config = require('../config')
const url = `http://localhost:${config.port}/log`

const log = message => {
  const trace = stackTrace.get()
  const frame = trace[0]
  axios({
    method: 'post',
    url,
    data: {
      message,
      meta: {
        time: new Date(),
        stack: trace.filter(frame => {
          let type = frame.getTypeName()
          return !(type === 'global' || type === null || type === undefined)
        }).map(frame => ({
          fname: frame.getFileName(),
          line: frame.getLineNumber(),
          col: frame.getColumnNumber(),
          type: frame.getTypeName(),
          method: frame.getMethodName(),
          function: frame.getFunctionName(),
        }))
      }
    }
  })
}

log('test')

module.exports = log
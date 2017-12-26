const nodeYaml = require('node-yaml')
const request = require('request')
const stackTrace = require('stack-trace')

const config = nodeYaml.readSync('../config.yaml')
const uri = `http://localhost:${config.port}/log`

const log = message => {
  const trace = stackTrace.get()
  const frame = trace[0]
  request({
    method: 'POST',
    uri,
    json: {
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

module.exports = log
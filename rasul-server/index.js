const nodeYaml = require('node-yaml')
const express = require('express')
const bodyParser = require('body-parser')

const config = nodeYaml.readSync('../config.yaml')

const logChannel = 'log'

var app = express()
app.use(bodyParser.json())
app.use(express.json())
var server = require('http').Server(app)
var io = require('socket.io')(server)
server.listen(config.port);

app.get('/', (req, res) => {
  const uri = `http://localhost:${config.port}`
  res.send(`
    <script src="/socket.io/socket.io.js"></script>
    <script>
      var socket = io.connect('${uri}')
      socket.on('${logChannel}', function (msg) {
        console.log(msg)
      })
    </script>
  `)
})

let log = msg => {}

app.post('/log', (req, res) => {
  log(req.body)
  res.send('logged successful')
})

io.on('connection', socket => {
  log = msg => socket.emit(logChannel, msg)
  console.log('Rasul server started')
})

module.exports = msg => log(msg)
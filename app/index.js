/*
index - executable file
*/
// set env first
require('dotenv').config()

// run server
var Server = require('./server')
var server = new Server()
server.init()
server.app.listen()

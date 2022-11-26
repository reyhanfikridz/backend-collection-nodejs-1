/*
app - initialization of express application
*/
var express = require('express')
var multer = require('multer')

var app = express()
app.use(multer().none())
app.use('/api', require('./worker/router'))

// export express application
module.exports = app

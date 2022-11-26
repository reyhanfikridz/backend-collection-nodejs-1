/*
server - executeable file
*/
// set env first
require('dotenv').config()

// import all required module
var bole = require('bole')
bole.output({
  level: 'debug',
  stream: process.stdout
})

var app = require('./app')
var config = require('./config')
var pool = require('./pool')

// initialize db tables if not exists
var queryInitializeDBTables = `
  CREATE TABLE IF NOT EXISTS worker
  (
    id SERIAL PRIMARY KEY NOT NULL,
    full_name VARCHAR(50) NOT NULL,
    salary NUMERIC NOT NULL,
    joining_date TIMESTAMP NOT NULL,
    department VARCHAR(20) NOT NULL
  );
`
pool.query(queryInitializeDBTables, (error, results) => {
  // if initialize db tables failed, exit application
  if (error) {
    log.error("There's an error when initialize database => ", error)
    process.exit(1)
  }

  // if initialize db tables success, listen server
  var log = bole('server')
  app.listen(config.express.port, 
    config.express.ip, function (error) {
    if (error) {
      log.error('Unable to listen for connections', error)
      process.exit(1)
    }
    log.info('Server is listening on http://' +
      config.express.ip + ':' + config.express.port)    
  })
})

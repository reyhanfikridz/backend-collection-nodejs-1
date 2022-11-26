var config = require('./config')

// create db connection
var Pool = require('pg').Pool
var pool = new Pool(config.pg)

// export db connection
module.exports = pool

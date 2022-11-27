/*
migrations - containing executeable file for migrate database tables

note: migration checking tables first, it is exists or not
*/
// set env first
require('dotenv').config()

// import all required modules
var DB = require('./db')
var config = require('./config')

// check migrate development/production or migrate test
if (process.argv[2] === "test") {
  config.pg.database = process.env.POSTGRES_DATABASE_TEST
} else {
  config.pg.database = process.env.POSTGRES_DATABASE
}

// migrate database tables
var db = new DB(config.pg)
db.initTables()
  .then((error)=>{
    if (!error) {
      console.log(`Migrate database${(process.argv[2]) ? ' test ' : ' '}tables SUCCESS!`)
      process.exit(0)
    } else {
      console.log(`Migrate database${(process.argv[2]) ? ' test ' : ' '}tables FAILED! => ${error}`)
      process.exit(1)
    }
  })

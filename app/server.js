/*
server - containing class for server
*/
// import all required module
var App = require('./app')
var config = require('./config')
var DB = require('./db')
var Log = require('./log')

// set log for this file
var log = new Log('server', 'info')

// class Server
class Server
{
  // constructor
  constructor()
  {
    this.db = new DB(config.pg)
    this.app = new App(config.express, this.db)
  }

  // init DB connection and express app
  async init()
  {
    // init db tables
    let error = await this.db.initTables()

    //// if init db tables success, init express app middlewares and routers
    if (!error) {
      this.app.initMiddlewares()
      this.app.initRouters()

    //// if init db tables failed, log error and exit program
    } else {
      log.log.error("There's an error when initialize database => ", error)
      process.exit(1)
    }
  }
}

module.exports = Server

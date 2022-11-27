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
    // init db connection and express application
    this.db = new DB(config.pg)
    this.app = new App(config.express, this.db)
  }

  // init express app middlewares and routers
  init()
  {
    this.app.initMiddlewares()
    this.app.initRouters()
  }
}

module.exports = Server

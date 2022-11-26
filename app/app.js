/*
app - containing class for express application
*/
// import all required modules
var express = require('express')
var multer = require('multer')
var WorkerRouter = require('./worker/router')
var Log = require('./log')

// set log for this file
var log = new Log('app', 'info')

// class App
class App
{
  // constructor
  constructor(config, db)
  {
    this.app = express()
    this.config = config
    this.db = db
  }

  // init middlewares
  initMiddlewares()
  {
    // init middleware for express so it can use request type multiple/form-data
    this.app.use(multer().none())
  }

  // init routers
  initRouters()
  {
    // init router worker
    let workerRouter = new WorkerRouter(this.db)
    this.app.use('/api', workerRouter.router)
  }

  // activate listener
  listen()
  {
    this.app.listen(this.config.port, this.config.ip, (error) => {
      if (error) {
        log.log.error('Unable to listen for connections', error)
        process.exit(1)
      }
      log.log.info('Server is listening on http://' +
        this.config.ip + ':' + this.config.port)
    })
  }
}

// export express application
module.exports = App

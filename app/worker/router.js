/*
worker/router - initialization of worker router
*/
// import all required module
var bole = require('bole')
bole.output({
  level: 'error',
  stream: process.stdout
})
var express = require('express')

var workerModel = require('./model')
var log = bole('order/router')

// class WorkerRouter
class WorkerRouter
{
  // constructor
  constructor(db)
  {
    this.db = db
    this.router = express.Router()
    this.router.get('/workers/', this.getWorkersHandler)
    this.router.get('/workers/:id/', this.getWorkerHandler)
    this.router.post('/workers/', this.addWorkerHandler)
    this.router.put('/workers/:id/', this.replaceWorkerHandler)
    this.router.patch('/workers/:id/', this.updateWorkerHandler)
    this.router.delete('/workers/:id/', this.deleteWorkerHandler)
  }

  // handler for get all worker data (Method: GET)
  getWorkersHandler = async (req, res) => {
    try {
      let workers = await workerModel.getAll(this.db.pool)
      res.status(200).json({'data': workers})
    } catch (error) {
      log.error(error)
      res.status(500).json({'message': error})
    }
  }

  // handler for get one worker data by ID (Method: GET)
  getWorkerHandler = async (req, res) => {
    try {
      const id = parseInt(req.params['id'])
      let worker = await workerModel.getById(this.db.pool, id)
      res.status(200).json({'data': worker || {}})
    } catch (error) {
      log.error(error)
      res.status(500).json({'message': error})
    }
  }

  // handler for add new worker data (Method: POST)
  addWorkerHandler = async (req, res) => {
    try {
      let worker = await workerModel.insert(this.db.pool, req.body)
      res.status(201).json({
        'message': "Worker data added!",
        'added_data': worker || {}
      })
    } catch (error) {
      log.error(error)
      res.status(500).json({'message': error})
    }
  }

  // handler for replace existing worker data by ID (Method: PUT)
  replaceWorkerHandler = async (req, res) => {
    try {
      const id = parseInt(req.params['id'])
      let worker = await workerModel.updateAllFieldsById(this.db.pool, id, req.body)
      res.status(200).json({
        'message': "Worker data replaced!",
        'replaced_data': worker || {}
      })
    } catch (error) {
      log.error(error)
      res.status(500).json({'message': error})
    }
  }

  // handler for update existing worker data by ID (Method: PUT)
  updateWorkerHandler = async (req, res) => {
    try {
      const id = parseInt(req.params['id'])
      let worker = await workerModel.updateById(this.db.pool, id, req.body)
      res.status(200).json({
        'message': "Worker data updated!",
        'updated_data': worker || {}
      })
    } catch (error) {
      log.error(error)
      res.status(500).json({'message': error})
    }
  }

  // handler for delete existing worker data by ID (Method: DELETE)
  deleteWorkerHandler = async (req, res) => {
    try {
      const id = parseInt(req.params['id'])
      let successMessage = await workerModel.deleteById(this.db.pool, id)
      res.status(200).json({
        'message': successMessage,
      })
    } catch (error) {
      log.error(error)
      res.status(500).json({'message': error})
    }
  }
}

// export router
module.exports = WorkerRouter

/*
wroker/router - containing class for worker router
*/
// import all required module
var express = require('express')
var WorkerModel = require('./model')
var Log = require('./../log')

// set log for this file
var log = new Log('order/router', 'info')

// class WorkerRouter
class WorkerRouter
{
  // constructor
  constructor(db)
  {
    this.db = db
    this.workerModel = new WorkerModel(this.db.pool)

    this.router = express.Router()
    this.router.post('/workers/', this.addWorkerHandler)
    this.router.get('/workers/', this.getWorkersHandler)
    this.router.get('/workers/:id/', this.getWorkerHandler)
    this.router.put('/workers/:id/', this.replaceWorkerHandler)
    this.router.patch('/workers/:id/', this.updateWorkerHandler)
    this.router.delete('/workers/:id/', this.deleteWorkerHandler)
  }

  // handler for add new worker data (Method: POST)
  addWorkerHandler = async (req, res) => {
    try {
      let worker = await this.workerModel.insert(req.body)
      res.status(201).json({
        'message': "Worker data added!",
        'added_data': worker || {}
      })
    } catch (error) {
      log.log.error(error)
      res.status(500).json({'message': error})
    }
  }

  // handler for get all worker data (Method: GET)
  getWorkersHandler = async (req, res) => {
    try {
      let workers = await this.workerModel.getAll(req.query)
      res.status(200).json({'data': workers})
    } catch (error) {
      log.log.error(error)
      res.status(500).json({'message': error})
    }
  }

  // handler for get one worker data by ID (Method: GET)
  getWorkerHandler = async (req, res) => {
    try {
      const id = parseInt(req.params['id'])
      let worker = await this.workerModel.getById(id)
      res.status(200).json({'data': worker || {}})
    } catch (error) {
      log.log.error(error)
      res.status(500).json({'message': error})
    }
  }

  // handler for replace existing worker data by ID (Method: PUT)
  replaceWorkerHandler = async (req, res) => {
    try {
      const id = parseInt(req.params['id'])
      let worker = await this.workerModel.updateAllFieldsById(id, req.body)
      res.status(200).json({
        'message': "Worker data replaced!",
        'replaced_data': worker || {}
      })
    } catch (error) {
      log.log.error(error)
      res.status(500).json({'message': error})
    }
  }

  // handler for update existing worker data by ID (Method: PUT)
  updateWorkerHandler = async (req, res) => {
    try {
      const id = parseInt(req.params['id'])
      let worker = await this.workerModel.updateById(id, req.body)
      res.status(200).json({
        'message': "Worker data updated!",
        'updated_data': worker || {}
      })
    } catch (error) {
      log.log.error(error)
      res.status(500).json({'message': error})
    }
  }

  // handler for delete existing worker data by ID (Method: DELETE)
  deleteWorkerHandler = async (req, res) => {
    try {
      const id = parseInt(req.params['id'])
      let successMessage = await this.workerModel.deleteById(id)
      res.status(200).json({
        'message': successMessage,
      })
    } catch (error) {
      log.log.error(error)
      res.status(500).json({'message': error})
    }
  }
}

// export router
module.exports = WorkerRouter

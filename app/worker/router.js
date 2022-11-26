/*
worker/router - initialization of worker router
*/
// import all required module
var bole = require('bole')
bole.output({
  level: 'error',
  stream: process.stdout
})

var pool = require('./../pool')
var workerModel = require('./model')
var router = require('express').Router()
var log = bole('order/router')

// handler for get all worker data (Method: GET)
async function getWorkersHandler (req, res) {
  try {
    let workers = await workerModel.getAll(pool)
    res.status(200).json({'data': workers})
  } catch (error) {
    log.error(error)
    res.status(500).json({'message': error})
  }
}

// handler for get one worker data by ID (Method: GET)
async function getWorkerHandler (req, res) {
  try {
    const id = parseInt(req.params['id'])
    let worker = await workerModel.getById(pool, id)
    res.status(200).json({'data': worker || {}})
  } catch (error) {
    log.error(error)
    res.status(500).json({'message': error})
  }
}

// handler for add new worker data (Method: POST)
async function addWorkerHandler (req, res) {
  try {
    let worker = await workerModel.insert(pool, req.body)
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
async function replaceWorkerHandler (req, res) {
  try {
    const id = parseInt(req.params['id'])
    let worker = await workerModel.updateAllFieldsById(pool, id, req.body)
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
async function updateWorkerHandler (req, res) {
  try {
    const id = parseInt(req.params['id'])
    let worker = await workerModel.updateById(pool, id, req.body)
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
async function deleteWorkerHandler (req, res) {
  try {
    const id = parseInt(req.params['id'])
    let successMessage = await workerModel.deleteById(pool, id)
    res.status(200).json({
      'message': successMessage,
    })
  } catch (error) {
    log.error(error)
    res.status(500).json({'message': error})
  }
}

router.get('/workers/', getWorkersHandler)
router.get('/workers/:id/', getWorkerHandler)
router.post('/workers/', addWorkerHandler)
router.put('/workers/:id/', replaceWorkerHandler)
router.patch('/workers/:id/', updateWorkerHandler)
router.delete('/workers/:id/', deleteWorkerHandler)

// export router
module.exports = router

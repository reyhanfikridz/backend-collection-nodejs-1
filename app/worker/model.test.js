/*
testing for worker/model
*/
// set env first same as starting express server
require('dotenv').config()

// import all required module
var pool = require('./../pool')
var workerModel = require('./model.js')

// set things before running all test in this file
beforeAll(done => {
  // truncate table worker
  pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE", ()=>{
    done()
  })
})

// testing model insert worker data
describe('Test model insert worker data', () => {
  // testing success
  it('should not catch any error', async () => {
    let error = null
    try {
      // insert data
      let worker = await workerModel.insert(pool, {
        full_name: 'James Bond',
        salary: 100000000,
        joining_date: '2022-11-21 18:00',
        department: 'Spy',
      })
    } catch (err) {
      // catch error
      error = err
    } finally {
      // check expected result
      expect(error).toBeNull()

      // truncate table worker
      await pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE")
    }
  })

  // testing failed
  it('should catch an error because full_name typo', async () => {
    let error = null
    try {
      // insert data
      let worker = await workerModel.insert(pool, {
        full_nme: 'James Bond',
        salary: 100000000,
        joining_date: '2022-11-21 18:00',
        department: 'Spy',
      })
    } catch (err) {
      // catch error
      error = err
    } finally {
      // check expected result
      expect(error).not.toBeNull()

      // truncate table worker
      await pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE")
    }
  })
})

// testing model get worker data by ID
describe('Test model get worker data by ID', () => {
  // test success
  it('should return the right data', async () => {
    let error = null
    let insertedWorker = null
    let gettedWorker = null
    try {
      // insert data
      insertedWorker = await workerModel.insert(pool, {
        full_name: 'James Bond',
        salary: 100000000,
        joining_date: '2022-11-21 18:00',
        department: 'Spy',
      })

      // get data
      gettedWorker = await workerModel.getById(pool, insertedWorker.id)
    } catch (err) {
      // catch error
      error = err
    } finally {
      // check expected result
      expect(error).toBeNull()
      expect(gettedWorker).toEqual(insertedWorker)

      // truncate table worker
      await pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE")
    }
  })

  // test failed
  it('should catch an error because id not number', async () => {
    let error = null
    try {
      // insert data
      let insertedWorker = await workerModel.insert(pool, {
        full_name: 'James Bond',
        salary: 100000000,
        joining_date: '2022-11-21 18:00',
        department: 'Spy',
      })

      // get data
      gettedWorker = await workerModel.getById(pool, "x")
    } catch (err) {
      // catch error
      error = err
    } finally {
      // check expected result
      expect(error).not.toBeNull()

      // truncate table worker
      await pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE")
    }
  })
})

// testing model get all worker data
describe('Test model get all worker data', () => {
  // test success
  it('should return the right data', async () => {
    let error = null
    let insertedWorkers = []
    let gettedWorkers = []
    try {
      // insert data list
      let worker = await workerModel.insert(pool, {
        full_name: 'James Bond',
        salary: 100000000,
        joining_date: '2022-11-21 18:00',
        department: 'Spy',
      })
      insertedWorkers.push(worker)

      worker = await workerModel.insert(pool, {
        full_name: 'Michael Thomas',
        salary: 550000500.50,
        joining_date: '2019-11-11 10:00',
        department: 'Project Leader',
      })
      insertedWorkers.push(worker)

      worker = await workerModel.insert(pool, {
        full_name: 'William McWallen',
        salary: 20000000,
        joining_date: '2021-05-20 11:00',
        department: 'Engineer',
      })
      insertedWorkers.push(worker)

      // get data list
      gettedWorkers = await workerModel.getAll(pool)
    } catch (err) {
      error = err
    } finally {
      // check expected result
      expect(error).toBeNull()
      expect(gettedWorkers).toEqual(insertedWorkers)

      // truncate table worker
      await pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE")
    }
  })
})

// testing model update worker all fields by ID
describe('Test model update worker all fields by ID', () => {
  // test success
  it('should return the right data', async () => {
    let error = null
    let insertedWorker = null
    let updatedWorker = null
    let gettedWorker = null
    try {
      // insert data
      insertedWorker = await workerModel.insert(pool, {
        full_name: 'James Bond',
        salary: 100000000,
        joining_date: '2022-11-21 18:00',
        department: 'Spy',
      })

      // update all fields by ID
      updatedWorker = await workerModel.updateAllFieldsById(pool, insertedWorker.id, {
        full_name: 'John Wick',
        salary: 20000000,
        joining_date: '2016-10-20 09:00',
        department: 'Agent',
      })

      // get data
      gettedWorker = await workerModel.getById(pool, insertedWorker.id)
    } catch (err) {
      // catch error
      error = err
    } finally {
      // check expected result
      expect(error).toBeNull()
      expect(gettedWorker).toEqual(updatedWorker)

      // truncate table worker
      await pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE")
    }
  })

  // test failed
  it('should catch an error because id not number', async () => {
    let error = null
    try {
      // insert data
      let insertedWorker = await workerModel.insert(pool, {
        full_name: 'James Bond',
        salary: 100000000,
        joining_date: '2022-11-21 18:00',
        department: 'Spy',
      })

      // update all fields by ID
      updatedWorker = await workerModel.updateAllFieldsById(pool, "", {
        full_name: 'John Wick',
        salary: 20000000,
        joining_date: '2016-10-20 09:00',
        department: 'Agent',
      })
    } catch (err) {
      // catch error
      error = err
    } finally {
      // check expected result
      expect(error).not.toBeNull()

      // truncate table worker
      await pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE")
    }
  })
})

// testing model update worker minimal one field by ID
describe('Test model update worker minimal one field by ID', () => {
  // test success
  it('should return the right data', async () => {
    let error = null
    let insertedWorker = null
    let updatedWorker = [null, null, null, null]
    let gettedWorker = [null, null, null, null]
    try {
      // insert data
      insertedWorker = await workerModel.insert(pool, {
        full_name: 'James Bond',
        salary: 100000000,
        joining_date: '2022-11-21 18:00',
        department: 'Spy',
      })

      // update field full_name by ID
      updatedWorker[0] = await workerModel.updateById(pool, insertedWorker.id, {
        full_name: 'John Wick',
      })

      // get data after update field full_name
      gettedWorker[0] = await workerModel.getById(pool, insertedWorker.id)

      // update field salary by ID
      updatedWorker[1] = await workerModel.updateById(pool, insertedWorker.id, {
        salary: 20000000,
      })

      // get data after update field salary
      gettedWorker[1] = await workerModel.getById(pool, insertedWorker.id)

      // update field joining_date by ID
      updatedWorker[2] = await workerModel.updateById(pool, insertedWorker.id, {
        joining_date: "2016-01-01 10:00",
      })

      // get data after update field joining_date
      gettedWorker[2] = await workerModel.getById(pool, insertedWorker.id)

      // update field department by ID
      updatedWorker[3] = await workerModel.updateById(pool, insertedWorker.id, {
        department: "Agent",
      })

      // get data after update field department
      gettedWorker[3] = await workerModel.getById(pool, insertedWorker.id)
    } catch (err) {
      // catch error
      error = err
    } finally {
      // check expected result
      expect(error).toBeNull()
      for (let i = 0; i < updatedWorker.length; i++) {
        expect(gettedWorker[i]).toEqual(updatedWorker[i])
      }

      // truncate table worker
      await pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE")
    }
  })

  // test failed
  it('should catch an error because id not number', async () => {
    let error = null
    try {
      // insert data
      let insertedWorker = await workerModel.insert(pool, {
        full_name: 'James Bond',
        salary: 100000000,
        joining_date: '2022-11-21 18:00',
        department: 'Spy',
      })

      // update field full_name by ID
      updatedWorker = await workerModel.updateById(pool, "", {
        full_name: 'John Wick',
      })
    } catch (err) {
      // catch error
      error = err
    } finally {
      // check expected result
      expect(error).not.toBeNull()

      // truncate table worker
      await pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE")
    }
  })
})

// testing model delete worker by ID
describe('Test model delete worker by ID', () => {
  // test success
  it('should return the right data', async () => {
    let error = null
    let insertedWorkers = [null, null, null]
    let gettedWorkers = null
    try {
      // insert data list
      insertedWorkers[0] = await workerModel.insert(pool, {
        full_name: 'James Bond',
        salary: 100000000,
        joining_date: '2022-11-21 18:00',
        department: 'Spy',
      })

      insertedWorkers[1] = await workerModel.insert(pool, {
        full_name: 'John Wick',
        salary: 20000000,
        joining_date: '2016-10-20 09:00',
        department: 'Agent',
      })

      insertedWorkers[2] = await workerModel.insert(pool, {
        full_name: 'Michael Thomas',
        salary: 8000000,
        joining_date: '2018-09-10 12:00',
        department: 'Engineer',
      })

      // delete data by id
      await workerModel.deleteById(pool, insertedWorkers[1].id)

      // get all data
      gettedWorkers = await workerModel.getAll(pool)
    } catch (err) {
      // catch error
      error = err
    } finally {
      // check expected result
      expect(error).toBeNull()
      expect(gettedWorkers).toEqual([insertedWorkers[0], insertedWorkers[2]])

      // truncate table worker
      await pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE")
    }
  })

  // test failed
  it('should catch an error because id not number', async () => {
    let error = null
    try {
      // insert data
      let insertedWorker = await workerModel.insert(pool, {
        full_name: 'James Bond',
        salary: 100000000,
        joining_date: '2022-11-21 18:00',
        department: 'Spy',
      })

      // delete by ID
      await workerModel.deleteById(pool, "test")
    } catch (err) {
      // catch error
      error = err
    } finally {
      // check expected result
      expect(error).not.toBeNull()

      // truncate table worker
      await pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE")
    }
  })
})

// set things after running all test in this file
afterAll(done => {
  // truncate table worker and disconnect database
  pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE", ()=>{
    pool.end()
    done()
  })
})

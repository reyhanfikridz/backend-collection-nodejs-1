/*
worker/model test - containing class for testing worker model
*/
// set env first
require('dotenv').config()

// import all required module
var Server = require('./../server')
var WorkerModel = require('./model.js')

// class WorkerModelTest
class WorkerModelTest
{
  // constructor
  constructor()
  {
    this.server = new Server()
    this.server.init()

    this.workerModel = new WorkerModel(this.server.db.pool)
  }

  // run test
  run()
  {
    // run all test
    this.testInsert()
    this.testGet()
    this.testUpdate()
    this.testDelete()

    // close database connection after testing
    afterAll(async () => {
      await this.server.db.pool.end()
    })
  }

  // testing model insert
  testInsert()
  {
    // testing model insert worker data
    describe('Test model insert worker data', () => {
      // testing success
      it('should not catch any error', async () => {
        let error = null
        try {
          // insert data
          let worker = await this.workerModel.insert({
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
        }
      })

      // testing failed
      it('should catch an error because full_name typo', async () => {
        let error = null
        try {
          // insert data
          let worker = await this.workerModel.insert({
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
        }
      })
    })
  }

  // testing model get
  testGet()
  {
    // testing model get worker data by ID
    describe('Test model get worker data by ID', () => {
      // test success
      it('should return the right data', async () => {
        let error = null
        let insertedWorker = null
        let gettedWorker = null
        try {
          // insert data
          insertedWorker = await this.workerModel.insert({
            full_name: 'James Bond',
            salary: 100000000,
            joining_date: '2022-11-21 18:00',
            department: 'Spy',
          })

          // get data
          gettedWorker = await this.workerModel.getById(insertedWorker.id)
        } catch (err) {
          // catch error
          error = err
        } finally {
          // check expected result
          expect(error).toBeNull()
          expect(gettedWorker).toEqual(insertedWorker)
        }
      })

      // test failed
      it('should catch an error because id not number', async () => {
        let error = null
        try {
          // insert data
          let insertedWorker = await this.workerModel.insert({
            full_name: 'James Bond',
            salary: 100000000,
            joining_date: '2022-11-21 18:00',
            department: 'Spy',
          })

          // get data
          gettedWorker = await this.workerModel.getById("x")
        } catch (err) {
          // catch error
          error = err
        } finally {
          // check expected result
          expect(error).not.toBeNull()
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
          let worker = await this.workerModel.insert({
            full_name: 'James Bond',
            salary: 100000000,
            joining_date: '2022-11-21 18:00',
            department: 'Spy',
          })
          insertedWorkers.push(worker)

          worker = await this.workerModel.insert({
            full_name: 'Michael Thomas',
            salary: 550000500.50,
            joining_date: '2019-11-11 10:00',
            department: 'Project Leader',
          })
          insertedWorkers.push(worker)

          worker = await this.workerModel.insert({
            full_name: 'William McWallen',
            salary: 20000000,
            joining_date: '2021-05-20 11:00',
            department: 'Engineer',
          })
          insertedWorkers.push(worker)

          worker = await this.workerModel.insert({
            full_name: 'William Penz',
            salary: 22000000,
            joining_date: '2020-02-10 09:00',
            department: 'Engineer',
          })
          insertedWorkers.push(worker)

          // get data list with department 'Engineer'
          gettedWorkers = await this.workerModel.getAll({'department': 'Engineer'})
        } catch (err) {
          error = err
        } finally {
          // check expected result
          expect(error).toBeNull()
          for (let i = 0; i < gettedWorkers.length; i++) {
            expect(gettedWorkers[i]['department']).toEqual('Engineer')
          }
        }
      })
    })
  }

  // testing model update
  testUpdate()
  {
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
          insertedWorker = await this.workerModel.insert({
            full_name: 'James Bond',
            salary: 100000000,
            joining_date: '2022-11-21 18:00',
            department: 'Spy',
          })

          // update all fields by ID
          updatedWorker = await this.workerModel.updateAllFieldsById(insertedWorker.id, {
            full_name: 'John Wick',
            salary: 20000000,
            joining_date: '2016-10-20 09:00',
            department: 'Agent',
          })

          // get data
          gettedWorker = await this.workerModel.getById(insertedWorker.id)
        } catch (err) {
          // catch error
          error = err
        } finally {
          // check expected result
          expect(error).toBeNull()
          expect(gettedWorker).toEqual(updatedWorker)
        }
      })

      // test failed
      it('should catch an error because id not number', async () => {
        let error = null
        try {
          // insert data
          let insertedWorker = await this.workerModel.insert({
            full_name: 'James Bond',
            salary: 100000000,
            joining_date: '2022-11-21 18:00',
            department: 'Spy',
          })

          // update all fields by ID
          updatedWorker = await this.workerModel.updateAllFieldsById("", {
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
          insertedWorker = await this.workerModel.insert({
            full_name: 'James Bond',
            salary: 100000000,
            joining_date: '2022-11-21 18:00',
            department: 'Spy',
          })

          // update field full_name by ID
          updatedWorker[0] = await this.workerModel.updateById(insertedWorker.id, {
            full_name: 'John Wick',
          })

          // get data after update field full_name
          gettedWorker[0] = await this.workerModel.getById(insertedWorker.id)

          // update field salary by ID
          updatedWorker[1] = await this.workerModel.updateById(insertedWorker.id, {
            salary: 20000000,
          })

          // get data after update field salary
          gettedWorker[1] = await this.workerModel.getById(insertedWorker.id)

          // update field joining_date by ID
          updatedWorker[2] = await this.workerModel.updateById(insertedWorker.id, {
            joining_date: "2016-01-01 10:00",
          })

          // get data after update field joining_date
          gettedWorker[2] = await this.workerModel.getById(insertedWorker.id)

          // update field department by ID
          updatedWorker[3] = await this.workerModel.updateById(insertedWorker.id, {
            department: "Agent",
          })

          // get data after update field department
          gettedWorker[3] = await this.workerModel.getById(insertedWorker.id)

        } catch (err) {
          // catch error
          error = err
        } finally {
          // check expected result
          expect(error).toBeNull()
          for (let i = 0; i < updatedWorker.length; i++) {
            expect(gettedWorker[i]).toEqual(updatedWorker[i])
          }
        }
      })

      // test failed
      it('should catch an error because id not number', async () => {
        let error = null
        try {
          // insert data
          let insertedWorker = await this.workerModel.insert({
            full_name: 'James Bond',
            salary: 100000000,
            joining_date: '2022-11-21 18:00',
            department: 'Spy',
          })

          // update field full_name by ID
          updatedWorker = await this.workerModel.updateById("", {
            full_name: 'John Wick',
          })
        } catch (err) {
          // catch error
          error = err
        } finally {
          // check expected result
          expect(error).not.toBeNull()
        }
      })
    })
  }

  // testing model delete
  testDelete()
  {
    // testing model delete worker by ID
    describe('Test model delete worker by ID', () => {
      // test success
      it('should return the right data', async () => {
        let error = null
        let gettedWorker = {}
        try {
          // insert data
          let insertedWorker = await this.workerModel.insert({
            full_name: 'James Bond',
            salary: 100000000,
            joining_date: '2022-11-21 18:00',
            department: 'Spy',
          })

          // delete data by id
          await this.workerModel.deleteById(insertedWorker.id)

          // get data by id
          gettedWorker = await this.workerModel.getById(insertedWorker.id)
        } catch (err) {
          // catch error
          error = err
        } finally {
          // check expected result
          expect(error).toBeNull()
          expect(gettedWorker).toEqual(undefined)
        }
      })

      // test failed
      it('should catch an error because id not number', async () => {
        let error = null
        try {
          // insert data
          let insertedWorker = await this.workerModel.insert({
            full_name: 'James Bond',
            salary: 100000000,
            joining_date: '2022-11-21 18:00',
            department: 'Spy',
          })

          // delete by ID
          await this.workerModel.deleteById("test")

        } catch (err) {
          // catch error
          error = err
        } finally {
          // check expected result
          expect(error).not.toBeNull()
        }
      })
    })
  }
}

// run class WorkerModelTest
var workerModelTest = new WorkerModelTest()
workerModelTest.run()

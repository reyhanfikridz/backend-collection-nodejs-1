/*
worker/router test - containing class for testing worker router
*/
// set env first
require('dotenv').config()

// import all required module
var request = require('supertest')
var Server = require('./../server')

// class WorkerRouterTest
class WorkerRouterTest
{
  // constructor
  constructor()
  {
    this.server = new Server()
    this.server.init()
    this.testingApp = request(this.server.app.app)
  }

  // run test
  run()
  {
    // run all test
    this.testPost()
    this.testGet()
    this.testPut()
    this.testPatch()
    this.testDelete()

    // close database connection after testing
    afterAll(async () => {
      await this.server.db.pool.end()
    })
  }

  // testing API POST
  testPost()
  {
    // testing API add worker (POST /api/workers/)
    describe('Test API add worker (POST /api/workers/)', () => {
      // testing status 201
      it('should return status 201', async () => {
        // add data
        let response = await this.testingApp
          .post('/api/workers/')
          .field('full_name', 'James Bond')
          .field('salary', '100000000')
          .field('joining_date', '2022-11-21 18:00')
          .field('department', 'Spy')

        // check expected result
        expect(response.status).toEqual(201)
        expect(response.type).toEqual('application/json')
      })

      // testing status 500
      it('should return status 500', async () => {
        // add data
        let response = await this.testingApp
          .post('/api/workers/')
          .field('full_nme', 'James Bond')
          .field('salary', '100000000')
          .field('joining_date', '2022-11-21 18:00')
          .field('department', 'Spy')

        // check expected result
        expect(response.status).toEqual(500)
      })
    })
  }

  // testing API GET
  testGet()
  {
    // testing API get worker by ID (GET /api/workers/:id/)
    describe('Test API get worker by ID (GET /api/workers/:id/)', () => {
      // test success
      it('should return status 200 and return the right data', async () => {
        // add data
        let response = await this.testingApp
          .post('/api/workers/')
          .field('full_name', 'James Bond')
          .field('salary', '100000000')
          .field('joining_date', '2022-11-21 18:00')
          .field('department', 'Spy')

        let addedWorker = response.body.added_data

        // get data
        response = await this.testingApp
          .get(`/api/workers/${addedWorker.id}`)

        // check expected result
        expect(response.status).toEqual(200)
        expect(response.body.data).toEqual(addedWorker)
      })

      // test failed
      it('should return status 500 because id not number', async () => {
        // add data
        let response = await this.testingApp
          .post('/api/workers/')
          .field('full_name', 'James Bond')
          .field('salary', '100000000')
          .field('joining_date', '2022-11-21 18:00')
          .field('department', 'Spy')

        // get data
        response = await this.testingApp
          .get(`/api/workers/x/`)

        // check expected result
        expect(response.status).toEqual(500)
      })
    })

    // testing API get all worker (GET /api/workers/)
    describe('Test API get all worker (GET /api/workers/)', () => {
      // test success
      it('should return status 200 and return the right data', async () => {
        let addedWorkers = []

        // add data list
        let response = await this.testingApp
          .post('/api/workers/')
          .field('full_name', 'James Bond')
          .field('salary', '100000000')
          .field('joining_date', '2022-11-21 18:00')
          .field('department', 'Spy')

        addedWorkers.push(response.body.added_data)

        response = await this.testingApp
          .post('/api/workers/')
          .field('full_name', 'Michael Thomas')
          .field('salary', '550000500.50')
          .field('joining_date', '2019-11-11 10:00')
          .field('department', 'Project Leader')

        addedWorkers.push(response.body.added_data)

        response = await this.testingApp
          .post('/api/workers/')
          .field('full_name', 'William McWallen')
          .field('salary', '20000000')
          .field('joining_date', '2021-05-20 11:00')
          .field('department', 'Engineer')

        addedWorkers.push(response.body.added_data)

        response = await this.testingApp
          .post('/api/workers/')
          .field('full_name', 'William Penz')
          .field('salary', '22000000')
          .field('joining_date', '2020-02-10 09:00')
          .field('department', 'Engineer')

        addedWorkers.push(response.body.added_data)

        // get data list with department 'Engineer'
        response = await this.testingApp
          .get('/api/workers/?department=Engineer')
        let gettedWorkers = response.body.data

        // check expected result
        expect(response.status).toEqual(200)
        for (let i = 0; i < gettedWorkers.length; i++) {
          expect(gettedWorkers[i]['department']).toEqual('Engineer')
        }
      })
    })
  }

  // testing API PUT
  testPut()
  {
    // testing API replace worker (PUT /api/workers/:id/)
    describe('Test API replace worker (PUT /api/workers/:id/)', () => {
      // test success
      it('should return status 200 and return the right data', async () => {
        // add data
        let response = await this.testingApp
          .post('/api/workers/')
          .field('full_name', 'James Bond')
          .field('salary', '100000000')
          .field('joining_date', '2022-11-21 18:00')
          .field('department', 'Spy')

        let addedWorker = response.body.added_data

        // replace data
        response = await this.testingApp
          .put(`/api/workers/${addedWorker.id}`)
          .field('full_name', 'John Wick')
          .field('salary', '20000000')
          .field('joining_date', '2016-10-20 09:00')
          .field('department', 'Agent')

        let replacedWorker = response.body.replaced_data
        let replaceWorkerRespStatus = response.status

        // get data
        response = await this.testingApp
          .get(`/api/workers/${addedWorker.id}`)

        // check expected result
        expect(replaceWorkerRespStatus).toEqual(200)
        expect(response.body.data).toEqual(replacedWorker)
      })

      // test failed
      it('should return status 500 because id not number', async () => {
        // add data
        let response = await this.testingApp
          .post('/api/workers/')
          .field('full_name', 'James Bond')
          .field('salary', '100000000')
          .field('joining_date', '2022-11-21 18:00')
          .field('department', 'Spy')

        // replace data
        response = await this.testingApp
          .put(`/api/workers/-/`)
          .field('full_name', 'John Wick')
          .field('salary', '20000000')
          .field('joining_date', '2016-10-20 09:00')
          .field('department', 'Agent')

        // check expected result
        expect(response.status).toEqual(500)
      })
    })
  }

  // testing API PATCH
  testPatch()
  {
    // testing API update worker by ID (PATCH /api/workers/:id/)
    describe('Test API update worker by ID (PATCH /api/workers/:id/)', () => {
      // test success
      it('should return status 200 and return the right data', async () => {
        let updatedWorker = [null, null, null, null]
        let gettedWorker = [null, null, null, null]

        // add data
        let response = await this.testingApp
          .post('/api/workers/')
          .field('full_name', 'James Bond')
          .field('salary', '100000000')
          .field('joining_date', '2022-11-21 18:00')
          .field('department', 'Spy')

        let addedWorker = response.body.added_data

        // update field full_name by ID and check expected status result
        response = await this.testingApp
          .patch(`/api/workers/${addedWorker.id}}`)
          .field('full_name', 'John Wick')
          .expect(200)

        updatedWorker[0] = response.body.updated_data

        // get data after update field full_name
        response = await this.testingApp
          .get(`/api/workers/${addedWorker.id}}`)

        gettedWorker[0] = response.body.data

        // update field salary by ID and check expected status result
        response = await this.testingApp
          .patch(`/api/workers/${addedWorker.id}}`)
          .field('salary', '5500000.50')
          .expect(200)

        updatedWorker[1] = response.body.updated_data

        // get data after update field salary
        response = await this.testingApp
          .get(`/api/workers/${addedWorker.id}}`)

        gettedWorker[1] = response.body.data

        // update field joining_date by ID and check expected status result
        response = await this.testingApp
          .patch(`/api/workers/${addedWorker.id}}`)
          .field('joining_date', '2019-01-01 10:00')
          .expect(200)

        updatedWorker[2] = response.body.updated_data

        // get data after update field joining_date
        response = await this.testingApp
          .get(`/api/workers/${addedWorker.id}}`)

        gettedWorker[2] = response.body.data

        // update field department by ID and check expected status result
        response = await this.testingApp
          .patch(`/api/workers/${addedWorker.id}}`)
          .field('department', 'Agent')
          .expect(200)

        updatedWorker[3] = response.body.updated_data

        // get data after update field department
        response = await this.testingApp
          .get(`/api/workers/${addedWorker.id}}`)

        gettedWorker[3] = response.body.data

        // check expected updated data
        for (let i = 0; i < updatedWorker.length; i++) {
          expect(gettedWorker[i]).toEqual(updatedWorker[i])
        }
      })

      // test failed
      it('should return status 500 because id not number', async () => {
        // add data
        let response = await this.testingApp
          .post('/api/workers/')
          .field('full_name', 'James Bond')
          .field('salary', '100000000')
          .field('joining_date', '2022-11-21 18:00')
          .field('department', 'Spy')

        // update field full_name by ID and check expected status result
        response = await this.testingApp
          .patch(`/api/workers/test/`)
          .field('full_name', 'John Wick')
          .expect(500)
      })
    })
  }

  // testing API DELETE
  testDelete()
  {
    // testing API delete worker by ID (DELETE /api/workers/)
    describe('Test API delete worker by ID (DELETE /api/workers/)', () => {
      // test success
      it('should return status 200 and return the right data', async () => {
        // add data
        let response = await this.testingApp
          .post('/api/workers/')
          .field('full_name', 'James Bond')
          .field('salary', '100000000')
          .field('joining_date', '2022-11-21 18:00')
          .field('department', 'Spy')

        let addedWorker = response.body.added_data

        // delete data and check expected status
        await this.testingApp
          .delete(`/api/workers/${addedWorker.id}`)
          .expect(200)

        // get data
        response = await this.testingApp
          .get(`/api/workers/${addedWorker.id}/`)

        let gettedWorker = response.body.data

        // check expected list data after delete
        expect(gettedWorker).toEqual({})
      })

      // test failed
      it('should return status 500 because id not number', async () => {
        // add data
        let response = await this.testingApp
          .post('/api/workers/')
          .field('full_name', 'James Bond')
          .field('salary', '100000000')
          .field('joining_date', '2022-11-21 18:00')
          .field('department', 'Spy')

        // delete data by ID and check expected status result
        response = await this.testingApp
          .delete(`/api/workers/test/`)
          .expect(500)
      })
    })
  }
}

// run class WorkerRouterTest
var workerRouterTest = new WorkerRouterTest()
workerRouterTest.run()

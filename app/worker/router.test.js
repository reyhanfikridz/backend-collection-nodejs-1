/*
testing for worker/router
*/
// set env first same as starting express server
require('dotenv').config()

// import all required module
var app = require('./../app')
var pool = require('./../pool')
var request = require('supertest')

// set things before running all test in this file
beforeAll(done => {
  // truncate table worker
  pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE", ()=>{
    done()
  })
})

// testing API add worker (POST /api/workers/)
describe('Test API add worker (POST /api/workers/)', () => {
  // testing status 201
  it('should return status 201', async () => {
    // add data
    let response = await request(app)
      .post('/api/workers/')
      .field('full_name', 'James Bond')
      .field('salary', '100000000')
      .field('joining_date', '2022-11-21 18:00')
      .field('department', 'Spy')
    
    // check expected result
    expect(response.status).toEqual(201)
    expect(response.type).toEqual('application/json')

    // truncate table worker
    await pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE")
  })

  // testing status 500
  it('should return status 500', async () => {
    // add data
    let response = await request(app)
      .post('/api/workers/')
      .field('full_nme', 'James Bond')
      .field('salary', '100000000')
      .field('joining_date', '2022-11-21 18:00')
      .field('department', 'Spy')
    
    // check expected result
    expect(response.status).toEqual(500)
  })
})

// testing API get worker by ID (GET /api/workers/:id/)
describe('Test API get worker by ID (GET /api/workers/:id/)', () => {
  // test success
  it('should return status 200 and return the right data', async () => {
    // add data
    let response = await request(app)
      .post('/api/workers/')
      .field('full_name', 'James Bond')
      .field('salary', '100000000')
      .field('joining_date', '2022-11-21 18:00')
      .field('department', 'Spy')

    let addedWorker = response.body.added_data

    // get data
    response = await request(app)
      .get(`/api/workers/${addedWorker.id}`)

    // check expected result
    expect(response.status).toEqual(200)
    expect(response.body.data).toEqual(addedWorker)

    // truncate table worker
    await pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE")
  })

  // test failed
  it('should return status 500 because id not number', async () => {
    // add data
    let response = await request(app)
      .post('/api/workers/')
      .field('full_name', 'James Bond')
      .field('salary', '100000000')
      .field('joining_date', '2022-11-21 18:00')
      .field('department', 'Spy')

    // get data
    response = await request(app)
      .get(`/api/workers/x/`)

    // check expected result
    expect(response.status).toEqual(500)

    // truncate table worker
    await pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE")
  })
})

// testing API get all worker (GET /api/workers/)
describe('Test API get all worker (GET /api/workers/)', () => {
  // test success
  it('should return status 200 and return the right data', async () => {
    let addedWorkers = []

    // add data list
    let response = await request(app)
      .post('/api/workers/')
      .field('full_name', 'James Bond')
      .field('salary', '100000000')
      .field('joining_date', '2022-11-21 18:00')
      .field('department', 'Spy')

    addedWorkers.push(response.body.added_data)

    response = await request(app)
      .post('/api/workers/')
      .field('full_name', 'Michael Thomas')
      .field('salary', '550000500.50')
      .field('joining_date', '2019-11-11 10:00')
      .field('department', 'Project Leader')

    addedWorkers.push(response.body.added_data)

    response = await request(app)
      .post('/api/workers/')
      .field('full_name', 'William McWallen')
      .field('salary', '20000000')
      .field('joining_date', '2021-05-20 11:00')
      .field('department', 'Engineer')

    addedWorkers.push(response.body.added_data)

    // get data list
    response = await request(app)
      .get('/api/workers/')
    
    // check expected result
    expect(response.status).toEqual(200)
    expect(response.body.data).toEqual(addedWorkers)

    // truncate table worker
    await pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE")
  })
})

// testing API replace worker (PUT /api/workers/:id/)
describe('Test API replace worker (PUT /api/workers/:id/)', () => {
  // test success
  it('should return status 200 and return the right data', async () => {
    // add data
    let response = await request(app)
      .post('/api/workers/')
      .field('full_name', 'James Bond')
      .field('salary', '100000000')
      .field('joining_date', '2022-11-21 18:00')
      .field('department', 'Spy')

    let addedWorker = response.body.added_data

    // replace data
    response = await request(app)
      .put(`/api/workers/${addedWorker.id}`)
      .field('full_name', 'John Wick')
      .field('salary', '20000000')
      .field('joining_date', '2016-10-20 09:00')
      .field('department', 'Agent')

    let replacedWorker = response.body.replaced_data
    let replaceWorkerRespStatus = response.status
    
    // get data
    response = await request(app)
      .get(`/api/workers/${addedWorker.id}`)
    
    // check expected result
    expect(replaceWorkerRespStatus).toEqual(200)
    expect(response.body.data).toEqual(replacedWorker)

    // truncate table worker
    await pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE")
  })

  // test failed
  it('should return status 500 because id not number', async () => {
    // add data
    let response = await request(app)
      .post('/api/workers/')
      .field('full_name', 'James Bond')
      .field('salary', '100000000')
      .field('joining_date', '2022-11-21 18:00')
      .field('department', 'Spy')

    // replace data
    response = await request(app)
      .put(`/api/workers/-/`)
      .field('full_name', 'John Wick')
      .field('salary', '20000000')
      .field('joining_date', '2016-10-20 09:00')
      .field('department', 'Agent')
    
    // check expected result
    expect(response.status).toEqual(500)

    // truncate table worker
    await pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE")
  })
})

// testing API update worker by ID (PATCH /api/workers/:id/)
describe('Test API update worker by ID (PATCH /api/workers/:id/)', () => {
  // test success
  it('should return status 200 and return the right data', async () => {
    let updatedWorker = [null, null, null, null]
    let gettedWorker = [null, null, null, null]

    // add data
    let response = await request(app)
      .post('/api/workers/')
      .field('full_name', 'James Bond')
      .field('salary', '100000000')
      .field('joining_date', '2022-11-21 18:00')
      .field('department', 'Spy')
    
    addedWorker = response.body.added_data

    // update field full_name by ID and check expected status result
    response = await request(app)
      .patch(`/api/workers/${addedWorker.id}}`)
      .field('full_name', 'John Wick')
      .expect(200)

    updatedWorker[0] = response.body.updated_data

    // get data after update field full_name
    response = await request(app)
      .get(`/api/workers/${addedWorker.id}}`)
    
    gettedWorker[0] = response.body.data

    // update field salary by ID and check expected status result
    response = await request(app)
      .patch(`/api/workers/${addedWorker.id}}`)
      .field('salary', '5500000.50')
      .expect(200)

    updatedWorker[1] = response.body.updated_data

    // get data after update field salary
    response = await request(app)
      .get(`/api/workers/${addedWorker.id}}`)
    
    gettedWorker[1] = response.body.data

    // update field joining_date by ID and check expected status result
    response = await request(app)
      .patch(`/api/workers/${addedWorker.id}}`)
      .field('joining_date', '2019-01-01 10:00')
      .expect(200)

    updatedWorker[2] = response.body.updated_data

    // get data after update field joining_date
    response = await request(app)
      .get(`/api/workers/${addedWorker.id}}`)
    
    gettedWorker[2] = response.body.data

    // update field department by ID and check expected status result
    response = await request(app)
      .patch(`/api/workers/${addedWorker.id}}`)
      .field('department', 'Agent')
      .expect(200)

    updatedWorker[3] = response.body.updated_data

    // get data after update field department
    response = await request(app)
      .get(`/api/workers/${addedWorker.id}}`)
    
    gettedWorker[3] = response.body.data

    // check expected updated data
    for (let i = 0; i < updatedWorker.length; i++) {
      expect(gettedWorker[i]).toEqual(updatedWorker[i])
    }

    // truncate table worker
    await pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE")
  })

  // test failed
  it('should return status 500 because id not number', async () => {
    // add data
    let response = await request(app)
      .post('/api/workers/')
      .field('full_name', 'James Bond')
      .field('salary', '100000000')
      .field('joining_date', '2022-11-21 18:00')
      .field('department', 'Spy')
    
    addedWorker = response.body.added_data

    // update field full_name by ID and check expected status result
    response = await request(app)
      .patch(`/api/workers/test/`)
      .field('full_name', 'John Wick')
      .expect(500)

    // truncate table worker
    await pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE")
  })
})

// testing API delete worker by ID (DELETE /api/workers/)
describe('Test API delete worker by ID (DELETE /api/workers/)', () => {
  // test success
  it('should return status 200 and return the right data', async () => {
    let addedWorkers = []

    // add data list
    let response = await request(app)
      .post('/api/workers/')
      .field('full_name', 'James Bond')
      .field('salary', '100000000')
      .field('joining_date', '2022-11-21 18:00')
      .field('department', 'Spy')

    addedWorkers.push(response.body.added_data)

    response = await request(app)
      .post('/api/workers/')
      .field('full_name', 'Michael Thomas')
      .field('salary', '550000500.50')
      .field('joining_date', '2019-11-11 10:00')
      .field('department', 'Project Leader')

    addedWorkers.push(response.body.added_data)

    response = await request(app)
      .post('/api/workers/')
      .field('full_name', 'William McWallen')
      .field('salary', '20000000')
      .field('joining_date', '2021-05-20 11:00')
      .field('department', 'Engineer')

    addedWorkers.push(response.body.added_data)

    // delete data and check expected status
    await request(app)
      .delete(`/api/workers/${addedWorkers[1].id}`)
      .expect(200)

    // get data list
    response = await request(app)
      .get('/api/workers/')

    gettedWorkers = response.body.data

    // check expected list data after delete
    expect(gettedWorkers).toEqual([addedWorkers[0], addedWorkers[2]])

    // truncate table worker
    await pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE")
  })

  // test failed
  it('should return status 500 because id not number', async () => {
    // add data
    let response = await request(app)
      .post('/api/workers/')
      .field('full_name', 'James Bond')
      .field('salary', '100000000')
      .field('joining_date', '2022-11-21 18:00')
      .field('department', 'Spy')
    
    addedWorker = response.body.added_data

    // delete data by ID and check expected status result
    response = await request(app)
      .delete(`/api/workers/test/`)
      .expect(500)

    // truncate table worker
    await pool.query("TRUNCATE TABLE worker RESTART IDENTITY CASCADE")
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

/*
worker/model - CRUD for worker model
*/
// get all worker data
function getAll(pool) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM worker ORDER BY id ASC';
    pool.query(query, (error, results) => {
      if (error) {
        reject(`There's an error when get all worker data => ${error}`)
        return // this return important because reject not auto return
      }
      resolve(results.rows)
    })
  })
}

// get one worker data by ID
function getById(pool, id) {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM worker WHERE id = ${id}`;
    pool.query(query, (error, results) => {
      if (error) {
        reject(`There's an error when get one worker data by id => ${error}`)
        return // this return important because reject not auto return
      }
      resolve(results.rows[0])
    })
  })
}

// get one worker data by ID
function insert(pool, data) {
  return new Promise((resolve, reject) => {
    let query = `
      INSERT INTO worker (full_name, salary, joining_date, department) 
      VALUES ($1, $2, $3, $4) RETURNING id, full_name, salary, joining_date, department`;
    let queryData = [
      data['full_name'], data['salary'], 
      data['joining_date'], data['department']]
    pool.query(query, queryData, (error, results) => {
      if (error) {
        reject(`There's an error when inserting worker data => ${error}`)
        return // this return important because reject not auto return
      }
      resolve(results.rows[0])
    })
  })
}

// update worker data (all fields) by ID
function updateAllFieldsById(pool, id, data) {
  return new Promise((resolve, reject) => {
    let query = `
      UPDATE worker SET full_name = $1, salary = $2, joining_date = $3, department = $4
      WHERE id = $5 RETURNING id, full_name, salary, joining_date, department`;
    let queryData = [
      data['full_name'], data['salary'], 
      data['joining_date'], data['department'], id]
    pool.query(query, queryData, (error, results) => {
      if (error) {
        reject(`There's an error when replacing worker data by id => ${error}`)
        return // this return important because reject not auto return
      }
      resolve(results.rows[0])
    })
  })
}

// update worker data (minimum one field) by ID
function updateById(pool, id, data) {
  return new Promise((resolve, reject) => {
    let query = `UPDATE worker SET`
    let queryData = []
    if (data['full_name']) {
      query += ` full_name = $1`
      queryData.push(data['full_name'])

      if (data['salary']) {
        query += `, salary = $2`
        queryData.push(data['salary'])

        if (data['joining_date']) {
          query += `, joining_date = $3`
          queryData.push(data['joining_date'])

          if (data['department']) {
            query += `, department = $4`
            queryData.push(data['department'])
          }

        } else if (data['department']) {
          query += `, department = $3`
          queryData.push(data['department'])
        }

      } else if (data['joining_date']) {
        query += `, joining_date = $2`
        queryData.push(data['joining_date'])

        if (data['department']) {
          query += `, department = $3`
          queryData.push(data['department'])
        }

      } else if (data['department']) {
        query += `, department = $2`
        queryData.push(data['department'])
      }

    } else if (data['salary']) {
      query += ` salary = $1`
      queryData.push(data['salary'])

      if (data['joining_date']) {
        query += `, joining_date = $2`
        queryData.push(data['joining_date'])

        if (data['department']) {
          query += `, department = $3`
          queryData.push(data['department'])
        }

      } else if (data['department']) {
        query += `, department = $2`
        queryData.push(data['department'])
      }

    } else if (data['joining_date']) {
      query += ` joining_date = $1`
      queryData.push(data['joining_date'])
      if (data['department']) {
        query += `, department = $2`
        queryData.push(data['department'])
      }

    } else if (data['department']) {
      query += ` department = $1`
      queryData.push(data['department'])

    } else {
      reject(`Data for update empty`)
      return // this return important because reject not auto return
    }

    query += ` WHERE id = ${id} RETURNING id, full_name, salary, joining_date, department`
    
    pool.query(query, queryData, (error, results) => {
      if (error) {
        reject(`There's an error when replacing worker data by id => ${error}`)
        return // this return important because reject not auto return
      }
      resolve(results.rows[0])
    })
  })
}

// delete worker data by ID
function deleteById(pool, id) {
  return new Promise((resolve, reject) => {
    let query = `DELETE FROM worker WHERE id = ${id}`;
    pool.query(query, (error, results) => {
      if (error) {
        reject(`There's an error when deleting worker data by id => ${error}`)
        return // this return important because reject not auto return
      }
      resolve(`Worker data deleted successfully!`)
    })
  })
}

// export all model function
module.exports = {
  getAll, getById, insert, updateAllFieldsById, 
  updateById, deleteById
}

/*
DB - containing class for DB connection
*/
// import all required modules
var Pool = require('pg').Pool

// class DB connection
class DB
{
  // constructor
  constructor(config)
  {
    // create new db connection based on config
    this.pool = new Pool(config)
  }

  // init DB tables if not exists (return promise so use async/await to use it)
  async initTables()
  {
    // init query create tables
    var queryInitializeDBTables = `
      CREATE TABLE IF NOT EXISTS worker
      (
        id SERIAL PRIMARY KEY NOT NULL,
        full_name VARCHAR(50) NOT NULL,
        salary NUMERIC NOT NULL,
        joining_date TIMESTAMP NOT NULL,
        department VARCHAR(20) NOT NULL
      );
    `

    // create tables in db
    try {
      await this.pool.query(queryInitializeDBTables)
    } catch (err) {
      return err
    }

    return null
  }
}

// export db class
module.exports = DB

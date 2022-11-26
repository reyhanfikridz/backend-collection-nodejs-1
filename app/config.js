/*
config - containing all loaded configuration from environment variable
*/
var config = {
  express: {
    port: process.env.EXPRESS_PORT,
    ip: process.env.EXPRESS_IP,
  },
  pg: {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
  }
}

if (process.env.NODE_ENV === "test") {
  config.pg.database = process.env.POSTGRES_DATABASE_TEST
}

module.exports = config

/*
log - containing class for logging
*/
// import all required module
var bole = require('bole')
bole.output({
  level: 'info',
  stream: process.stdout
})

// class Log
class Log
{
  constructor(name, level)
  {
    this.log = bole(name)
  }
}

// export class Log
module.exports = Log

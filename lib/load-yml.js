'use strict'

const yaml = require('js-yaml')
const { readFileSync } = require('fs')

module.exports = path => {
  return yaml.safeLoad(readFileSync(path))
}

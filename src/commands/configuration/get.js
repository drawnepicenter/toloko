const themes = require('../../themes')
const tools = require('../../tools')

const chalk = require('chalk')
const dot = require('dot-prop')
const noon = require('noon')

const CFILE = `${process.env.HOME}/.toloko.noon`

exports.command = 'get <key>'
exports.aliases = ['g']
exports.desc = 'Retrieve a config value'
exports.builder = {}
exports.handler = (argv) => {
  const key = argv.key
  let value = null
  tools.checkConfig(CFILE)
  const config = noon.load(CFILE)
  const theme = themes.loadTheme(config.theme)
  if (config.verbose) themes.label(theme, 'down', 'Configuration')
  if (dot.has(config, key)) {
    value = /\./i.test(key) ? dot.get(config, key) : config[key]
  } else {
    throw new Error(`Option ${key} not found.`)
  }
  console.log(`Option ${chalk.white.bold(key)} is ${chalk.white.bold(value)}.`)
}

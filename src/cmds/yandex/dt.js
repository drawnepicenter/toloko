/* eslint max-len: 0, no-unused-vars: 0 */
const themes = require('../../themes')
const tools = require('../../tools')

const _ = require('lodash')
const chalk = require('chalk')
const fs = require('fs')
const http = require('good-guy-http')()
const noon = require('noon')

const CFILE = `${process.env.HOME}/.toloko.noon`

exports.command = 'detect <query>'
exports.aliases = ['dt']
exports.desc = 'Detect language'
exports.builder = {
  hint: {
    alias: 'h',
    desc: 'A comma-separated list of the most likely languages (optional)',
    default: '',
    type: 'string',
  },
}
exports.handler = (argv) => {
  tools.checkConfig(CFILE)
  const config = noon.load(CFILE)
  const theme = themes.loadTheme(config.theme)
  if (config.verbose) themes.label(theme, 'down', 'Yandex')
  const prefix = 'https://translate.yandex.net/api/v1.5/tr.json/detect?'
  const ucont = []
  ucont.push(`key=${process.env.YANDEX}`)
  ucont.push(`text=${argv.query}`)
  if (argv.h !== '') {
    ucont.push(`hint=${argv.h}`)
  }
  let url = `${prefix}${ucont.join('&')}`
  url = encodeURI(url)
  http({ url }, (error, response) => {
    if (!error && response.statusCode === 200) {
      const body = JSON.parse(response.body)
      themes.label(theme, 'right', 'Detected language', body.lang)
    } else {
      console.log(JSON.stringify(error, null, 2))
      throw new Error(error)
    }
  })
}

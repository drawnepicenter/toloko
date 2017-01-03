/* eslint no-unused-vars: 0 */
const themes = require('../../themes')
const tools = require('../../tools')

const _ = require('lodash')
const chalk = require('chalk')
const fs = require('fs')
const http = require('good-guy-http')()
const noon = require('noon')

const CFILE = `${process.env.HOME}/.toloko.noon`

exports.command = 'ls'
exports.desc = 'List supported languages'
exports.builder = {}
exports.handler = (argv) => {
  tools.checkConfig(CFILE)
  const config = noon.load(CFILE)
  const theme = themes.loadTheme(config.theme)
  if (config.verbose) themes.label(theme, 'down', 'Hablaa')
  let url = 'http://hablaa.com/hs/languages/'
  url = encodeURI(url)
  http({ url }, (error, response) => {
    if (!error && response.statusCode === 200) {
      const body = JSON.parse(response.body)
      for (let i = 0; i <= body.length - 1; i++) {
        if (i === 0) {
          themes.label(theme, 'right', body[i].lang_code, `${body[i].name} - Current site language`)
        } else {
          themes.label(theme, 'right', body[i].lang_code, body[i].name)
        }
      }
    } else {
      console.log(JSON.stringify(error, null, 2))
      throw new Error(error)
    }
  })
}

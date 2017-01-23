/* eslint max-len: 0, no-unused-vars: 0 */
const themes = require('../../themes')
const tools = require('../../tools')

const http = require('good-guy-http')()
const noon = require('noon')

const CFILE = `${process.env.HOME}/.toloko.noon`

exports.command = 'list'
exports.aliases = ['langs', 'ls']
exports.desc = 'List supported languages'
exports.builder = {
  lang: {
    alias: 'l',
    desc: '2-letter ISO 639-1 language code. If set, the response will contain a list of supported language codes and corresponding names in the given language',
    default: '',
    type: 'string'
  }
}
exports.handler = (argv) => {
  tools.checkConfig(CFILE)
  const config = noon.load(CFILE)
  const theme = themes.loadTheme(config.theme)
  if (config.verbose) themes.label(theme, 'down', 'Yandex')
  const prefix = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs?'
  const ucont = []
  ucont.push(`key=${process.env.YANDEX}`)
  if (argv.d !== '') {
    ucont.push(`ui=${argv.d}`)
  }
  let url = `${prefix}${ucont.join('&')}`
  url = encodeURI(url)
  http({ url }, (error, response) => {
    if (!error && response.statusCode === 200) {
      const body = JSON.parse(response.body)
      themes.label(theme, 'right', 'Supported translation directions')
      for (let i = 0; i <= body.dirs.length - 1; i++) {
        console.log(body.dirs[i])
      }
    } else {
      console.log(JSON.stringify(error, null, 2))
      throw new Error(error)
    }
  })
}

/* eslint max-len: 0, no-unused-vars: 0 */
const themes = require('../../themes')
const tools = require('../../tools')

const _ = require('lodash')
const http = require('good-guy-http')()
const noon = require('noon')

const CFILE = `${process.env.HOME}/.toloko.noon`

exports.command = 'translate <query>'
exports.aliases = ['trans', 'tr']
exports.desc = 'Translate a word'
exports.builder = {
  out: {
    alias: 'o',
    desc: 'Write cson, json, noon, plist, yaml, xml',
    default: '',
    type: 'string'
  },
  force: {
    alias: 'f',
    desc: 'Force overwriting outfile',
    default: false,
    type: 'boolean'
  },
  save: {
    alias: 'e',
    desc: 'Save flags to config file',
    default: false,
    type: 'boolean'
  },
  dir: {
    alias: 'd',
    desc: "Translation direction. A single 2-letter ISO 639-1 language code (e.g. 'ru') or 2 codes separated by a hyphen (e.g. 'en-ru')",
    default: '',
    type: 'string'
  }
}
exports.handler = (argv) => {
  tools.checkConfig(CFILE)
  let config = noon.load(CFILE)
  const userConfig = {
    dir: argv.d
  }
  if (config.merge) config = _.merge({}, config, userConfig)
  if (argv.e && config.merge) noon.save(CFILE, config)
  if (argv.e && !config.merge) throw new Error("Can't save user config, set option merge to true.")
  const theme = themes.loadTheme(config.theme)
  themes.label(theme, 'down', 'Powered by Yandex.Translate', 'http://translate.yandex.com/')
  const prefix = 'https://translate.yandex.net/api/v1.5/tr.json/translate?'
  const dcont = []
  dcont.push(argv.query)
  if (argv._.length > 1) {
    for (let i = 0; i <= argv._.length - 1; i++) {
      if (argv._[i] !== 'yx' && argv._[i] !== 'tr') dcont.push(argv._[i])
    }
  }
  let words = ''
  if (dcont.length > 1) {
    words = dcont.join('+')
  } else {
    words = dcont[0]
  }
  const ucont = []
  ucont.push(`key=${process.env.YANDEX}`)
  ucont.push(`text=${words}`)
  ucont.push(`lang=${argv.d}`)
  ucont.push('format=plain')
  let url = `${prefix}${ucont.join('&')}`
  url = encodeURI(url)
  const tofile = {
    type: 'yandex',
    function: 'translate',
    src: 'http://translate.yandex.com'
  }
  http({ url }, (error, response) => {
    if (!error && response.statusCode === 200) {
      const body = JSON.parse(response.body)
      themes.label(theme, 'right', 'Translation direction', body.lang)
      tofile.lang = body.lang
      for (let i = 0; i <= body.text.length - 1; i++) {
        themes.label(theme, 'right', 'Result', body.text[i])
        tofile[[`result${i}`]] = body.text[i]
      }
      if (argv.o) tools.outFile(argv.o, argv.f, tofile)
    } else {
      throw new Error(`HTTP ${error}`)
    }
  })
}

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
  source: {
    alias: 's',
    desc: '3-letter ISO 693-3 source language code (Required)',
    default: '',
    type: 'string'
  },
  target: {
    alias: 't',
    desc: '3-letter ISO 693-3 target language code (Required)',
    default: '',
    type: 'string'
  }
}
exports.handler = (argv) => {
  tools.checkConfig(CFILE)
  let config = noon.load(CFILE)
  const userConfig = {
    source: argv.s,
    target: argv.t
  }
  if (config.merge) config = _.merge({}, config, userConfig)
  if (argv.e && config.merge) noon.save(CFILE, config)
  if (argv.e && !config.merge) throw new Error("Can't save user config, set option merge to true.")
  const theme = themes.loadTheme(config.theme)
  if (config.verbose) themes.label(theme, 'down', 'Hablaa')
  const prefix = 'http://hablaa.com/hs/translation/'
  const dcont = []
  dcont.push(argv.query)
  if (argv._.length > 1) {
    for (let i = 0; i <= argv._.length - 1; i++) {
      if (argv._[i] !== 'ha' && argv._[i] !== 'tr') dcont.push(argv._[i])
    }
  }
  let words = ''
  if (dcont.length > 1) {
    words = dcont.join('+')
  } else {
    words = dcont[0]
  }
  let url = `${prefix}${words}/${argv.s}-${argv.t}/`
  url = encodeURI(url)
  const tofile = {
    type: 'hablaa',
    function: 'translate',
    src: 'http://hablaa.com'
  }
  http({ url }, (error, response) => {
    if (!error && response.statusCode === 200) {
      const body = JSON.parse(response.body)
      for (let i = 0; i <= body.length - 1; i++) {
        themes.label(theme, 'right', 'Text', body[i].text)
        themes.label(theme, 'right', 'Source', body[i].source)
        if (body[i].pos.code !== null && body[i].pos.title !== null) {
          themes.label(theme, 'right', 'Part of speech')
          themes.label(theme, 'right', 'Code', body[i].pos.code)
          themes.label(theme, 'right', 'Title', body[i].pos.title)
        }
        if (body[i].addinfo) {
          const ai = body[i].addinfo
          for (let j = 0; j <= ai.length - 1; j++) {
            themes.label(theme, 'right', 'Part of speech')
            themes.label(theme, 'right', 'Code', body[i].addinfo[j].code)
            themes.label(theme, 'right', 'Title', body[i].addinfo[j].title)
          }
        }
        tofile[[`result${i}`]] = body[i]
      }
      if (argv.o) tools.outFile(argv.o, argv.f, tofile)
    } else {
      console.log(JSON.stringify(error, null, 2))
      throw new Error(error)
    }
  })
}

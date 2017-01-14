/* eslint no-unused-vars: 0 */
const themes = require('../../themes')
const tools = require('../../tools')

const _ = require('lodash')
const chalk = require('chalk')
const fs = require('fs')
const http = require('good-guy-http')()
const noon = require('noon')

const CFILE = `${process.env.HOME}/.toloko.noon`

function labelWord(word, theme) {
  if (word.text) themes.label(theme, 'down', 'Text', word.text)
  if (word.language) themes.label(theme, 'down', 'Language', word.language)
}

exports.command = 'translate <query>'
exports.aliases = ['trans', 'tr']
exports.desc = 'Translate a word'
exports.builder = {
  out: {
    alias: 'o',
    desc: 'Write cson, json, noon, plist, yaml, xml',
    default: '',
    type: 'string',
  },
  force: {
    alias: 'f',
    desc: 'Force overwriting outfile',
    default: false,
    type: 'boolean',
  },
  save: {
    alias: 'e',
    desc: 'Save flags to config file',
    default: false,
    type: 'boolean',
  },
  source: {
    alias: 's',
    desc: '3-letter ISO 693-3 source language code (Required)',
    default: '',
    type: 'string',
  },
  target: {
    alias: 't',
    desc: '3-letter ISO 693-3 target language code (Required)',
    default: '',
    type: 'string',
  },
  author: {
    alias: 'a',
    desc: 'Show authors',
    default: false,
    type: 'boolean',
  },
}
exports.handler = (argv) => {
  tools.checkConfig(CFILE)
  let config = noon.load(CFILE)
  const userConfig = {
    source: argv.s,
    target: argv.t,
    author: argv.a,
  }
  if (config.merge) config = _.merge({}, config, userConfig)
  if (argv.e && config.merge) noon.save(CFILE, config)
  if (argv.e && !config.merge) throw new Error("Can't save user config, set option merge to true.")
  const theme = themes.loadTheme(config.theme)
  if (config.verbose) themes.label(theme, 'down', 'Glosbe')
  const prefix = 'https://glosbe.com/gapi/translate?'
  const dcont = []
  dcont.push(argv.query)
  if (argv._.length > 1) {
    _.each(argv._, (value) => {
      if (value !== 'gl' && value !== 'tr') dcont.push(value)
    })
  }
  let words = ''
  if (dcont.length > 1) {
    words = dcont.join('+')
  } else {
    words = dcont[0]
  }
  const ucont = []
  ucont.push(`from=${argv.s}`)
  ucont.push(`dest=${argv.t}`)
  ucont.push(`phrase=${words}`)
  ucont.push('format=json')
  ucont.push('pretty=true')
  let url = `${prefix}${ucont.join('&')}`
  url = encodeURI(url)
  const tofile = {
    type: 'glosbe',
    function: 'translate',
    src: 'http://glosbe.com',
  }
  http({ url }, (error, response) => {
    if (!error && response.statusCode === 200) {
      const body = JSON.parse(response.body)
      if (body.result === 'ok') {
        themes.label(theme, 'right', 'Phrase', body.phrase)
        tofile.phrase = body.phrase
        tofile.from = body.from
        tofile.dest = body.dest
        console.log(`${body.from} => ${body.dest}`)
        const tuc = body.tuc
        tofile.tuc = {}
        tofile.meanings = {}
        for (let i = 0; i <= tuc.length - 1; i++) {
          if (tuc[i].phrase) {
            tofile.tuc[[`phrase${i}`]] = tuc[i].phrase
            labelWord(tuc[i].phrase, theme)
          }
          if (tuc[i].meanings) {
            for (let j = 0; j <= tuc[i].meanings.length - 1; j++) {
              tofile.meanings[[`meaning${j}`]] = tuc[i].meanings[j]
              labelWord(tuc[i].meanings[j], theme)
            }
          }
        }
        if (argv.a) {
          themes.label(theme, 'right', 'Authors')
          const keys = _.keys(body.authors)
          tofile.authors = {}
          for (let k = 0; k <= keys.length - 1; k++) {
            const id = keys[k]
            const obj = body.authors[id]
            themes.label(theme, 'right', 'Name', obj.N)
            themes.label(theme, 'right', 'ID', obj.id)
            themes.label(theme, 'right', 'URI', obj.U)
            themes.label(theme, 'right', 'URL', obj.url)
            tofile.authors[[`author${k}`]] = obj
          }
        }
        if (argv.o) tools.outFile(argv.o, argv.f, tofile)
      }
    } else {
      throw new Error(`HTTP ${error}`)
    }
  })
}

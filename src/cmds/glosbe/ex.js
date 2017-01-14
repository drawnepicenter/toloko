/* eslint no-unused-vars: 0 */
const themes = require('../../themes')
const tools = require('../../tools')

const _ = require('lodash')
const chalk = require('chalk')
const fs = require('fs')
const http = require('good-guy-http')()
const noon = require('noon')

const CFILE = `${process.env.HOME}/.toloko.noon`

exports.command = 'example <query>'
exports.aliases = ['ex']
exports.desc = 'Fetches examples'
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
  page: {
    alias: 'p',
    desc: 'Page of results to be displayed (200 Max)',
    default: 1,
    type: 'number',
  },
  size: {
    alias: 'z',
    desc: 'Size of the result page (30 Max)',
    default: 1,
    type: 'number',
  },
}
exports.handler = (argv) => {
  tools.checkConfig(CFILE)
  let config = noon.load(CFILE)
  const userConfig = {
    source: argv.s,
    target: argv.t,
    page: argv.p,
    size: argv.z,
  }
  if (config.merge) config = _.merge({}, config, userConfig)
  if (argv.e && config.merge) noon.save(CFILE, config)
  if (argv.e && !config.merge) throw new Error("Can't save user config, set option merge to true.")
  const theme = themes.loadTheme(config.theme)
  if (config.verbose) themes.label(theme, 'down', 'Glosbe')
  const prefix = 'https://glosbe.com/gapi/tm?'
  const dcont = []
  dcont.push(argv.query)
  if (argv._.length > 1) {
    _.each(argv._, (value) => {
      if (value !== 'gl' && value !== 'ex') dcont.push(value)
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
  ucont.push(`page=${argv.p}`)
  ucont.push(`pageSize=${argv.z}`)
  ucont.push(`phrase=${words}`)
  ucont.push('format=json')
  ucont.push('pretty=true')
  let url = `${prefix}${ucont.join('&')}`
  url = encodeURI(url)
  const tofile = {
    type: 'glosbe',
    function: 'examples',
    src: 'http://glosbe.com',
  }
  http({ url }, (error, response) => {
    if (!error && response.statusCode === 200) {
      // console.log(response.body)
      const body = JSON.parse(response.body)
      if (body.result === 'ok') {
        console.log(`Found ${body.found} results. Page ${body.page}, size ${body.pageSize} items.`)
        tofile.examples = {}
        let i = 0
        _.map(body.examples, (value) => {
          themes.label(theme, 'right', 'Author', value.author)
          themes.label(theme, 'right', 'Example', value.first)
          themes.label(theme, 'right', 'Translation', value.second)
          tofile.examples[[`example${i}`]] = value
          i++
        })
      }
      if (argv.o) tools.outFile(argv.o, argv.f, tofile)
    } else {
      throw new Error(`HTTP ${error.statusCode}: ${error.reponse.body}`)
    }
  })
}

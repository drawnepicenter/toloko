const themes = require('../../themes')

const chalk = require('chalk')
const fs = require('fs')
const noon = require('noon')

const CFILE = `${process.env.HOME}/.toloko.noon`
const PKGDIR = `${process.env.NODE_PATH}/toloko/`

exports.command = 'init'
exports.aliases = ['i']
exports.desc = 'Initialize config file'
exports.builder = {
  force: {
    alias: 'f',
    desc: 'Force overwriting configuration file',
    default: false,
    type: 'boolean'
  }
}
exports.handler = (argv) => {
  let obj = null
  let configExists = null
  let dirExists = null
  try {
    fs.statSync('default.config.noon')
    configExists = true
  } catch (e) {
    if (e.code === 'ENOENT') configExists = false
  }
  if (configExists) {
    obj = noon.load('default.config.noon')
  } else {
    try {
      fs.statSync(PKGDIR)
      dirExists = true
    } catch (e) {
      if (e.code === 'ENOENT') {
        dirExists = false
      }
    }
    if (dirExists) {
      obj = noon.load(`${PKGDIR}default.config.noon`)
    } else {
      throw new Error('Package dir not found, set NODE_PATH per documentation.')
    }
  }
  let fileExists = null
  try {
    fs.statSync(CFILE)
    fileExists = true
  } catch (e) {
    if (e.code === 'ENOENT') {
      fileExists = false
    }
  }
  if (fileExists) {
    if (argv.f) {
      noon.save(CFILE, obj)
      console.log(`Overwrote ${chalk.white.bold(CFILE)}.`)
    } else {
      console.log(`Using configuration at ${chalk.white.bold(CFILE)}.`)
    }
  } else if (!fileExists) {
    noon.save(CFILE, obj)
    console.log(`Created ${chalk.white.bold(CFILE)}.`)
  }
  const config = noon.load(CFILE)
  const theme = themes.loadTheme(config.theme)
  if (argv.v) {
    themes.label(theme, 'down', 'Configuration')
    console.log('Your current configuration is:')
    console.log(noon.stringify(config, {
      indent: 2,
      align: true,
      maxalign: 32,
      sort: true,
      colors: true
    }))
    console.log('')
  }
}

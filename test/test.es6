/* eslint no-unused-vars:0,no-undef:0,no-useless-escape:0 */
const themes = require('../bin/themes')
const tools = require('../bin/tools')

const _ = require('lodash')
const chalk = require('chalk')
const child = require('child_process')
const expect = require('chai').expect
const fs = require('fs-extra')
const noon = require('noon')
const sinon = require('sinon')
const version = require('../package.json').version
const xml2js = require('xml2js')

const CFILE = `${process.env.HOME}/.toloko.noon`
const TFILE = `${process.cwd()}/test/test.config.noon`
const spy = sinon.spy(console, 'log')

describe('tools', () => {
  before((done) => {
    fs.mkdirpSync('test/output')
    fs.copySync(CFILE, 'test/output/saved.config.noon')
    done()
  })
  beforeEach((done) => {
    spy.reset()
    done()
  })
  after((done) => {
    fs.copySync('test/output/saved.config.noon', CFILE)
    fs.removeSync('test/output')
    done()
  })
  describe('check boolean', () => {
    it('coerces true', (done) => {
      expect(tools.checkBoolean('true')).to.be.true
      done()
    })
    it('coerces false', (done) => {
      expect(tools.checkBoolean('false')).to.be.false
      done()
    })
  })
  describe('check outfile', () => {
    it('json exists', (done) => {
      const obj = { foo: 'bar' }
      const obj2 = { bar: 'foo' }
      tools.outFile('test/output/test.json', false, obj)
      expect(spy.calledWith(tools.outFile('test/output/test.json', false, obj2))).to.match(/[a-z\/,\-\. ]*/mig)
      const actual = fs.readJsonSync('test/output/test.json')
      expect(actual).to.deep.equal(obj)
      fs.removeSync('test/output/test.json')
      done()
    })
    it("json doesn't exist", (done) => {
      const obj = { foo: 'bar' }
      expect(spy.calledWith(tools.outFile('test/output/test.json', false, obj))).to.match(/[a-z\/,\-\. ]*/mig)
      fs.removeSync('test/output/test.json')
      done()
    })
    it('xml exists', (done) => {
      const obj = { foo: 'bar' }
      tools.outFile('test/output/test.xml', false, obj)
      tools.outFile('test/output/test.xml', false, obj)
      done()
    })
    it('enforces supported formats', (done) => {
      const obj = { foo: 'bar' }
      try {
        tools.outFile('test/output/test.foo', false, obj)
      } catch (error) {
        console.log(error)
        done()
      }
    })
  })
  describe('check config', () => {
    it('config exists', (done) => {
      fs.copySync('test/output/saved.config.noon', CFILE)
      expect(tools.checkConfig(CFILE)).to.be.true
      done()
    })
    it("config doesn't exist", (done) => {
      fs.removeSync(CFILE)
      try {
        tools.checkConfig(CFILE)
      } catch (error) {
        console.log(error)
        done()
      }
    })
  })
  describe('array to string', () => {
    const array = ['enclosed string']
    const string = 'normal string'
    it('extracts string from array', (done) => {
      expect(tools.arrToStr(array)).to.equals('enclosed string')
      done()
    })
    it('returns string when not enclosed', (done) => {
      expect(tools.arrToStr(string)).to.equals('normal string')
      done()
    })
  })
})

describe('themes', () => {
  beforeEach(() => {
    spy.reset()
  })
  after(() => spy.restore())
  describe('get themes', () => {
    it('returns an array of theme names', (done) => {
      const list = themes.getThemes().sort()
      const obj = ['colonel', 'markup', 'square']
      expect(list).to.deep.equal(obj)
      done()
    })
  })
  describe('load theme', () => {
    it('returns a theme', (done) => {
      const theme = themes.loadTheme('square')
      const obj = {
        prefix: {
          str: '[',
          style: 'bold.green'
        },
        text: {
          style: 'bold.white'
        },
        content: {
          style: 'white'
        },
        suffix: {
          str: ']',
          style: 'bold.green'
        },
        connector: {
          str: '→',
          style: 'bold.cyan'
        }
      }
      expect(theme).to.deep.equal(obj)
      done()
    })
  })
  describe('labels', () => {
    const theme = themes.loadTheme('square')
    const text = 'label'
    it('labels right', (done) => {
      const content = 'right'
      expect(spy.calledWith(themes.label(theme, 'right', text, content))).to.be.true
      done()
    })
    it('labels down', (done) => {
      const content = 'down'
      expect(spy.calledWith(themes.label(theme, 'down', text, content))).to.be.true
      done()
    })
    it('labels without content', (done) => {
      expect(spy.calledWith(themes.label(theme, 'right', text))).to.be.true
      done()
    })
    it('enforces right or down', (done) => {
      try {
        themes.label(theme, 'err', 'label')
      } catch (error) {
        console.log(error)
        done()
      }
    })
  })
})

describe('config commands', () => {
  before((done) => {
    fs.mkdirpSync('test/output')
    fs.copySync(CFILE, 'test/output/saved.config.noon')
    done()
  })
  after((done) => {
    fs.copySync('test/output/saved.config.noon', CFILE)
    fs.removeSync('test/output')
    done()
  })
  describe('get', () => {
    it('shows value of option glosbe.translate.author', (done) => {
      child.exec(`node ${process.cwd()}/bin/toloko.js config get glosbe.translate.author > test/output/config-get.out`, (err) => {
        const stdout = fs.readFileSync('test/output/config-get.out', 'utf8')
        expect(stdout.replace(/(\r\n|\n|\r)\s?/gm, '\n')).to.match(/Option glosbe.translate.author is (true|false)\./mig)
        done(err)
      })
    })
  })
  describe('init', () => {
    before((done) => {
      fs.removeSync(CFILE)
      done()
    })
    it('creates the config file', (done) => {
      child.exec(`node ${process.cwd()}/bin/toloko.js config init > test/output/config-init.out`, (err) => {
        const stdout = fs.readFileSync('test/output/config-init.out', 'utf8')
        const config = noon.load(CFILE)
        const obj = {
          glosbe: {
            translate: {
              author: true
            },
            examples: {
              page: 1,
              size: 1
            }
          },
          merge: true,
          theme: 'square',
          usage: true,
          verbose: true
        }
        expect(stdout.replace(/(\r\n|\n|\r)\s?/gm, '\n')).to.match(/Created [a-z\/\.]*/mig)
        expect(config).to.deep.equal(obj)
        done(err)
      })
    })
    it('force overwrites existing and prints config', (done) => {
      child.exec(`node ${process.cwd()}/bin/toloko.js config init -f -v > test/output/config-init.out`, (err) => {
        const stdout = fs.readFileSync('test/output/config-init.out', 'utf8')
        expect(stdout.replace(/(\r\n|\n|\r)\s?/gm, '\n')).to.match(/[a-z0-9 \/\.\[\]:\-\s|]*/mig)
        done(err)
      })
    })
  })
  describe('set', () => {
    it('sets value of option glosbe.translate.author to false', (done) => {
      child.exec(`node ${process.cwd()}/bin/toloko.js config set glosbe.translate.author false > test/output/config-set.out`, (err) => {
        const stdout = fs.readFileSync('test/output/config-set.out', 'utf8')
        expect(stdout.replace(/(\r\n|\n|\r)\s?/gm, '\n')).to.match(/Set option glosbe.translate.author to (true|false)\./mig)
        done(err)
      })
    })
  })
})

describe('root commands', () => {
  before((done) => {
    fs.mkdirpSync('test/output')
    const obj = noon.load(TFILE)
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
      const config = noon.load(CFILE)
      fs.copySync(CFILE, 'test/output/saved.config.noon')
      noon.save(CFILE, obj)
    } else {
      noon.save(CFILE, obj)
    }
    done()
  })
  after((done) => {
    let fileExists = null
    try {
      fs.statSync('test/output/saved.config.noon')
      fileExists = true
    } catch (e) {
      if (e.code === 'ENOENT') {
        fileExists = false
      }
    }
    if (fileExists) {
      fs.removeSync(CFILE)
      fs.copySync('test/output/saved.config.noon', CFILE)
    } else {
      fs.removeSync(CFILE)
    }
    fs.removeSync('test/output')
    done()
  })
  describe('comp', () => {
    it('outputs shell completion script', (done) => {
      child.exec(`node ${__dirname}/../bin/toloko.js comp > test/output/comp.out`, (err) => {
        const stdout = fs.readFileSync('test/output/comp.out', 'utf8')
        expect(stdout.replace(/(\r\n|\n|\r)\s?/gm, '\n')).to.match(/[#\-a-z0-9\.\s:\/>~_\(\)\{\}\[\]="$@,;]*/mig)
        done(err)
      })
    })
  })
  describe('help', () => {
    it('shows usage', (done) => {
      child.exec(`node ${__dirname}/../bin/toloko.js --help > test/output/help.out`, (err) => {
        const stdout = fs.readFileSync('test/output/help.out', 'utf8')
        expect(stdout.replace(/(\r\n|\n|\r)\s?/gm, '\n')).to.match(/[_ \/\\']*Usage:\s[a-z\/\. <>\[\]]*\s*Commands:\s*[a-z \[:\]\s<>,]*Options:\s*[a-z\-, \[\]\s]*/mig)
        done(err)
      })
    })
  })
  describe('ls', () => {
    it('demonstrates installed themes', (done) => {
      child.exec(`node ${__dirname}/../bin/toloko.js ls > test/output/ls.out`, (err) => {
        const stdout = fs.readFileSync('test/output/ls.out', 'utf8')
        expect(stdout.replace(/(\r\n|\n|\r)\s?/gm, '\n')).to.match(/[a-z :|,.<>\-\[\]→]*/mig)
        done(err)
      })
    })
  })
  describe('version', () => {
    it('prints the version number', (done) => {
      child.exec(`node ${process.cwd()}/bin/toloko.js --version`, (err, stdout) => {
        expect(stdout).to.contain(version)
        done(err)
      })
    })
  })
})

describe('glosbe commands', () => {
  before((done) => {
    fs.mkdirpSync('test/output')
    done()
  })
  after((done) => {
    fs.removeSync('test/output')
    done()
  })
  describe('translate', () => {
    it('shows output', (done) => {
      child.exec(`node ${process.cwd()}/bin/toloko.js gl tr -s eng -t spa -o ${process.cwd()}/test/output/gl-tr.json hello > test/output/gl-tr.out`, (err) => {
        const stdout = fs.readFileSync('test/output/gl-tr.out', 'utf8')
        const obj = {
          'type': 'glosbe',
          'function': 'translate',
          'src': 'http://glosbe.com',
          'phrase': 'hello',
          'from': 'en',
          'dest': 'es',
          'tuc': {
            'phrase0': {
              'text': 'hola',
              'language': 'es'
            },
            'phrase1': {
              'text': 'aló',
              'language': 'es'
            },
            'phrase2': {
              'text': 'buenos días',
              'language': 'es'
            },
            'phrase3': {
              'text': 'dígame',
              'language': 'es'
            },
            'phrase4': {
              'text': 'bueno',
              'language': 'es'
            },
            'phrase5': {
              'text': 'diga',
              'language': 'es'
            },
            'phrase6': {
              'text': 'qué tal',
              'language': 'es'
            },
            'phrase7': {
              'text': 'oigo',
              'language': 'es'
            },
            'phrase8': {
              'text': 'buenas tardes',
              'language': 'es'
            },
            'phrase9': {
              'text': 'oiga',
              'language': 'es'
            },
            'phrase10': {
              'text': 'si',
              'language': 'es'
            },
            'phrase11': {
              'text': '¡Hola! ¿Hay alguien?',
              'language': 'es'
            },
            'phrase12': {
              'text': 'Hola',
              'language': 'es'
            },
            'phrase13': {
              'text': 'buenas noches',
              'language': 'es'
            },
            'phrase14': {
              'text': 'como estás',
              'language': 'es'
            },
            'phrase15': {
              'text': 'cómo estás',
              'language': 'es'
            },
            'phrase16': {
              'text': 'dime',
              'language': 'es'
            },
            'phrase17': {
              'text': 'eh',
              'language': 'es'
            },
            'phrase18': {
              'text': 'ola',
              'language': 'es'
            },
            'phrase19': {
              'text': 'oye',
              'language': 'es'
            }
          },
          'meanings': {
            'meaning0': {
              'language': 'en',
              'text': '<i>An expression of puzzlement or discovery.</i>'
            },
            'meaning1': {
              'language': 'en',
              'text': 'is anyone there?'
            },
            'meaning2': {
              'language': 'en',
              'text': 'saludo con la boca'
            },
            'meaning3': {
              'language': 'es',
              'text': 'saludo'
            },
            'meaning4': {
              'language': 'es',
              'text': 'Expresión de saludo utilizada entre dos o más personas de trato familiar.'
            },
            'meaning5': {
              'language': 'en',
              'text': 'Expression of greeting used by two or more people who meet each other.'
            }
          }
        }
        const json = fs.readJsonSync(`${process.cwd()}/test/output/gl-tr.json`)
        expect(stdout.replace(/(\r\n|\n|\r)\s?/gm, '\n')).to.match(/[a-z0-9 \[\]\(\)&,\.<>→\/;:!’áóéí?=\-]*/mig)
        expect(json).to.deep.equal(obj)
        done(err)
      })
    })
  })
  describe('examples', () => {
    it('shows output', (done) => {
      child.exec(`node ${process.cwd()}/bin/toloko.js gl ex -s eng -t spa -o ${process.cwd()}/test/output/gl-ex.json hello > test/output/gl-ex.out`, err => {
        const stdout = fs.readFileSync('test/output/gl-ex.out', 'utf8')
        const obj = {
          'type': 'glosbe',
          'function': 'examples',
          'src': 'http://glosbe.com',
          'examples': {
            'example0': {
              'author': 31,
              'first': "Pleased to meet you \\ xB# Hello, hello \\ xB# The promenaders greet you \\ xB# With merry quips, a song or two \\ xB# It' s always our endeavour \\ xB# To every year provide for you a show that' s clean and clever \\ xB# Hello, hello \\ xB# It' s Brighton air that braces \\ xB# Hello, hello \\ xB# What rows of smiling faces \\ xB# There' s lots of fun for everyone with a cheery cheerio... \\ xB#Didn' t you get my message?",
              'second': '¿ No te dieron mi recado?'
            }
          }
        }
        const json = fs.readJsonSync(`${process.cwd()}/test/output/gl-ex.json`)
        expect(stdout.replace(/(\r\n|\n|\r)\s?/gm, '\n')).to.match(/[a-z0-9 \s[\].,\\#'?¿→]*/mig)
        expect(json).to.deep.equal(obj)
        done(err)
      })
    })
  })
})

describe('hablaa commands', () => {
  before((done) => {
    fs.mkdirpSync('test/output')
    done()
  })
  after((done) => {
    fs.removeSync('test/output')
    done()
  })
  describe('translate', () => {
    it('shows output', (done) => {
      child.exec(`node ${process.cwd()}/bin/toloko.js ha tr -s eng -t spa -o ${process.cwd()}/test/output/ha-tr.json hello > ${process.cwd()}/test/output/ha-tr.out`, err => {
        const stdout = fs.readFileSync('test/output/ha-tr.out', 'utf8')
        const obj = {
          'type': 'hablaa',
          'function': 'translate',
          'src': 'http://hablaa.com',
          'result0': {
            'text': '¡Hola',
            'pos': {
              'code': null,
              'title': null
            },
            'source': 'hablaa'
          },
          'result1': {
            'text': 'hola! saludo',
            'pos': {
              'code': null,
              'title': null
            },
            'source': 'Hablaa.com'
          },
          'result2': {
            'text': '¡hola',
            'pos': {
              'code': null,
              'title': null
            },
            'source': 'Hablaa.com'
          }
        }
        const json = fs.readJsonSync(`${process.cwd()}/test/output/ha-tr.json`)
        expect(stdout.replace(/(\r\n|\n|\r)\s?/gm, '\n')).to.match(/[a-z\[\] \-\.→!¡]*/mig)
        expect(json).to.deep.equal(obj)
        done(err)
      })
    })
  })
  describe('list', () => {
    it('shows output', (done) => {
      child.exec(`node ${process.cwd()}/bin/toloko.js ha ls > ${process.cwd()}/test/output/ha-ls.out`, err => {
        const stdout = fs.readFileSync('test/output/ha-ls.out', 'utf8')
        expect(stdout.replace(/(\r\n|\n|\r)\s?/gm, '\n')).to.match(/[a-z\[\] →\-å]*/mig)
        done(err)
      })
    })
  })
})

describe('yandex commands', () => {
  before((done) => {
    fs.mkdirpSync('test/output')
    done()
  })
  after((done) => {
    fs.removeSync('test/output')
    done()
  })
  describe('translate', () => {
    it('shows output', (done) => {
      child.exec(`node ${process.cwd()}/bin/toloko.js yx tr -d en-ru -o ${process.cwd()}/test/output/yx-tr.json hello > ${process.cwd()}/test/output/yx-tr.out`, err => {
        const stdout = fs.readFileSync('test/output/yx-tr.out', 'utf8')
        const obj = {
          'type': 'yandex',
          'function': 'translate',
          'src': 'http://translate.yandex.com',
          'lang': 'en-ru',
          'result0': 'привет'
        }
        const json = fs.readJsonSync(`${process.cwd()}/test/output/yx-tr.json`)
        expect(stdout.replace(/(\r\n|\n|\r)\s?/gm, '\n')).to.match(/[a-z\[\] \-\.→!¡]*/mig)
        expect(json).to.deep.equal(obj)
        done(err)
      })
    })
  })
  describe('list', () => {
    it('shows output', (done) => {
      child.exec(`node ${process.cwd()}/bin/toloko.js yx ls > ${process.cwd()}/test/output/yx-ls.out`, err => {
        const stdout = fs.readFileSync('test/output/yx-ls.out', 'utf8')
        expect(stdout.replace(/(\r\n|\n|\r)\s?/gm, '\n')).to.match(/[a-z\[\] →\-å]*/mig)
        done(err)
      })
    })
  })
  describe('detect language', () => {
    it('shows output', (done) => {
      child.exec(`node ${process.cwd()}/bin/toloko.js yx dt привет > ${process.cwd()}/test/output/yx-dt.out`, err => {
        const stdout = fs.readFileSync('test/output/yx-dt.out', 'utf8')
        expect(stdout.replace(/(\r\n|\n|\r)\s?/gm, '\n')).to.match(/[\[\]a-z →]*/mig)
        done(err)
      })
    })
  })
})

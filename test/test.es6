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
          style: 'bold.green',
        },
        text: {
          style: 'bold.white',
        },
        content: {
          style: 'white',
        },
        suffix: {
          str: ']',
          style: 'bold.green',
        },
        connector: {
          str: '→',
          style: 'bold.cyan',
        },
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
              author: true,
            },
            examples: {
              page: 1,
              size: 1,
            },
          },
          merge: true,
          theme: 'square',
          usage: true,
          verbose: true,
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
        expect(stdout.replace(/(\r\n|\n|\r)\s?/gm, '\n')).to.match(/^[\s_\(\)\/\\`,]*\sUsage:\s[a-z \/\.<>\[\]]*\s*Commands:\s[a-z <>\s|]*Options:\s[ -a-z\s]*\[boolean\]\s*/mig)
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

describe('encyclopedia-of-life', () => {
  before((done) => {
    fs.mkdirpSync('test/output')
    done()
  })
  after((done) => {
    fs.removeSync('test/output')
    done()
  })
})

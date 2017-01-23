/* eslint no-unused-vars: 0 */
const themes = require('../themes')

exports.command = 'list'
exports.aliases = ['ls', 'themes']
exports.desc = 'Get a list of installed themes'
exports.builder = {}
exports.handler = (argv) => {
  const list = themes.getThemes()
  for (let i = 0; i <= list.length - 1; i++) {
    const sample = 'Morbi ornare pulvinar metus, non faucibus arcu ultricies non.'
    const currentTheme = themes.loadTheme(list[i])
    themes.label(currentTheme, 'down', list[i], sample)
  }
}

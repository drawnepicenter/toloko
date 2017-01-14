/* eslint no-unused-vars: 0 */
exports.command = 'yandex <command>'
exports.aliases = ['yx']
exports.desc = 'Yandex functions'
exports.builder = (yargs) => yargs.commandDir('yandex')
exports.handler = (argv) => {}

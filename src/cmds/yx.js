/* eslint no-unused-vars: 0 */
exports.command = 'yx <command>'
exports.desc = 'Yandex functions'
exports.builder = (yargs) => yargs.commandDir('yandex')
exports.handler = (argv) => {}

/* eslint no-unused-vars: 0 */
exports.command = 'glosbe <command>'
exports.aliases = ['gl']
exports.desc = 'Glosbe functions'
exports.builder = (yargs) => yargs.commandDir('glosbe')
exports.handler = (argv) => {}

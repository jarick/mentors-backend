
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const colors = require('colors/safe')
import fields from './fields'
const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('make:table', 'Generate table')
  .command('make:model', 'Generate model')
  .command('make:request', 'Generate request')
  .command('make:routes', 'Generate routes')
  .command('make', 'Generate all')
  .alias('t', 'table')
  .nargs('t', 1)
  .describe('t', 'Database table')
  .demand(1, ['t'])
  .alias('m', 'model')
  .nargs('m', 2)
  .describe('m', 'Model')
  .demand(2, ['m'])
  .alias('c', 'config')
  .nargs('c', 3)
  .describe('c', 'Config file')
  .default('c', 'config.js')
  .help('h')
  .alias('h', 'help')
  .argv

let config = argv.c
if (!config) {
  config = 'config.js'
}
config = path.join(path.dirname(path.dirname(__dirname)), config)
const model = argv.m
const table = argv.t
const cfg = require(config)

const render = (cfg, table, model, data) => {
  return (folder) => {
    ejs.renderFile(path.join(cfg.views, folder + '.ejs'), data, {}, (err, str) => {
      if (err) throw err;
      const file = path.join(cfg.path, folder, table + '.js')
      fs.writeFileSync(file, str)
      console.log(colors.green('Success'))
    })
  }
}
fields(cfg, table, model, (data) => {
  const tpl = render(cfg, table, model, data)
  switch (argv._[0]) {
    case 'make:table':
      tpl('tables')
      break
    case 'make:model':
      tpl('models')
      break
    case 'make:request':
      tpl('requests')
      break
    case 'make:routes':
      tpl('routes')
      break
    case 'make':
      tpl('tables')
      tpl('models')
      tpl('requests')
      tpl('routes')
      break
  }
})
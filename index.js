#!/usr/bin/env node

const cli = require('commander')
const pkg = require('./package.json')
const core = require('./core')

cli.version(pkg.version).usage('<command> [option] <addon ...>')

cli
  .command('add <addons...>')
  .description('install one or more addons locally')
  .alias('install')
  .action(aa => core.add(aa))

cli
  .command('rm <addon>')
  .description('remove an addon from local installation')
  .alias('delete')
  .action(key => core.rm(key))

cli
  .command('search <text>')
  .description('search addons whose name contain <text>')
  .action(text => core.search(text))

cli
  .command('ls')
  .description('list all installed addons')
  .alias('list')
  .action(core.ls)

cli
  .command('info <addon>')
  .description(
    'show info of an addon, the addon does not have to be an installed locally'
  )
  .action(ad => core.info(ad))

cli
  .command('update')
  .description('update all installed addons')
  .action(() => core.update())

cli
  .command('import')
  .description('import local addons')
  .action(() => core.pickup())

cli
  .command('switch')
  .alias('sw')
  .description('switch mode between retail and classic')
  .action(core.switch)

cli
  .command('restore [repo]')
  .description(
    'restore addons from github repo, only <org/repo> is required, not the full URL. (e.g. antiwinter/wowui)'
  )
  .option(
    '-f, --full',
    'not only restore addons, but also restore addons settings'
  )
  .action(repo => core.restore(repo))

cli.on('command:*', () => {
  cli.help()
})

if (process.argv.length < 3) return cli.help()

// do the job
core.checkUpdate(() => {
  core.updateSummary(() => {
    cli.parse(process.argv)
  })
})

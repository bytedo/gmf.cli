#!/usr/bin/env node

/**
 * 脚手架
 * @author yutent<yutent.io@gmail.com>
 * @date 2020/09/28 11:35:16
 */

const fs = require('iofs')
const chalk = require('chalk')
const path = require('path')

var pm2
var pkg = require('./package.json')
var { do_init } = require('./lib/init')
var { start, stop, restart, remove, status } = require('./lib/pm2')

var { arch, platform, version } = process
var os = { linux: 'Linux', darwin: 'MacOS', win: 'Windows' }
var cwd = process.cwd()
var args = process.argv.slice(2)
var action = args.shift()

try {
  pm2 = require('pm2/package.json')
} catch (error) {
  print('#'.repeat(64))
  console.log(chalk.red('脚手架使用pm2作为守护进程, 请先安装pm2'))
  console.log(chalk.green('npm i -g pm2'))
  print('#'.repeat(64))
  process.exit()
}

function print(...args) {
  args[0] = args[0].padEnd(20, ' ')
  if (args.length > 1) {
    args.splice(1, 0, '   -   ')
  }
  console.log.apply(null, args)
}

function logo() {
  return chalk.green.bold(`                 ____  
  __ _ _ __ ___ | ___| 
 / _\` | '_ \` _ \\|___ \\ 
| (_| | | | | | |___) |
 \\__, |_| |_| |_|____/ 
 |___/`)
}

function print_help() {
  print('='.repeat(64))
  print(`${logo()}                     v${pkg.version},    作者: 宇天`)
  print('-'.repeat(64))
  print('node版本:  ' + version)
  print('pm2 版本:  v' + pm2.version)
  print(`当前系统:  ${os[platform]}(${arch})`)
  print('当前路径:  ' + chalk.red.underline(cwd))
  print('='.repeat(64))
  print('用法: five-cli [command] args...')
  print('Commands:')
  print('  init', '初始化框架')
  print('  start [prod|dev]', '运行当前的应用(可指定运行环境)')
  print('  stop', '停止当前应用')
  print('  st|status', '查看当前应用状态')
  print('  r|restart', '重启当前应用')
  print('  del|delete', '删除当前应用')
  print('  -h', '查看帮助文档')
  print('  -v', '查看工具的版本')
  process.exit()
}

switch (action) {
  case 'init':
    do_init(cwd)
    break

  case 'start':
    start(cwd, args[0])
    break

  case 'stop':
    stop(cwd)
    break

  case 'st':
  case 'status':
    status(cwd)
    break

  case 'r':
  case 'restart':
    restart(cwd)
    break

  case 'del':
  case 'delete':
    remove(cwd)
    break

  case '-v':
    print(pkg.version)
    process.exit()
    break

  default:
    print_help()
    break
}

/**
 * 进程管理
 * @author yutent<yutent.io@gmail.com>
 * @date 2020/09/28 15:45:46
 */

const fs = require('iofs')
const path = require('path')
const os = require('os')
const chalk = require('chalk')

const { exec, read } = require('./tools')

var cpus = os.cpus()

exports.start = async function(dir, env) {
  var confFile = path.join(dir, 'app.yaml')
  var run_env = process.env.NODE_ENV || 'development'
  var name, cluster, instances

  if (env === 'prod') {
    run_env = 'production'
  }

  if (fs.exists(confFile)) {
    console.log(
      chalk.yellow('应用可能已经启动, 请确认是否在列表中, 以免重复启动!')
    )
    exec('pm2 ls')
    var act = await read(
      '请确认操作, 如已在列表中, 请回车或按Ctrl + C取消, 输入任意内容将会重新启动: '
    )
    if (act) {
      var data = fs.cat(confFile).toString()
      data = data.replace(/NODE_ENV: [a-z]+/, `NODE_ENV: ${run_env}`)
      fs.echo(data, confFile)
      exec('pm2 start app.yaml')
      console.log(chalk.blue('应用启动成功!!!'))
    }
    process.exit()
  }

  console.log('首次运行，请根据提示完成配置')

  // ---------------
  name = await read('(请输入应用唯一名称, 不能含中文): ')
  if (name === '') {
    console.log(chalk.yellow('没有输入, 自动使用随机名称'))
    name = 'five-demo-' + ~~(Math.random() * 99)
  }
  console.log(`当前应用名称为: ${name}`)

  // ---------------
  cluster = await read('(是否开启集群模式, 生产环境建议开启, y/n): ')
  if (cluster === '') {
    console.log(chalk.yellow('没有输入, 默认不开启集群模式'))
    cluster = 'fork'
  } else {
    if (cluster === 'y') {
      cluster = 'cluster'
    } else {
      cluster = 'fork'
    }
  }
  console.log(`当前运行模式为: ${cluster}`)

  // ---------------
  if (cluster === 'cluster') {
    instances = await read(`(请设置开启的线程数: 0-${cpus}, 0为自动): `)
    instances = +instances

    if (instances === 0) {
      instances = 'max'
    } else {
      if (instances > cpus) {
        instances = cpus
      } else if (instances < 0) {
        instances = 1
      }
    }
    instances = `instances: ${instances}`
  } else {
    instances = ''
  }

  fs.echo(
    `
script: node --experimental-json-modules ./app.js
cwd: ./
watch: true
name: ${name}
ignore_watch: [data, public, package.json, package-lock.json, node_modules, .git, .gitignore, app.yaml]
exec_mode: ${cluster}
${instances}
error_file: ./data/logs/error.log
out_file: ./data/logs/out.log
merge_logs: true
min_uptime: 60s
max_restarts: 1
max_memory_restart: 300M
env:
  NODE_ENV: ${run_env}
  
  `,
    confFile
  )

  console.log(chalk.blue('配置完成, 启动中...'))
  exec('pm2 start app.yaml')
  console.log(chalk.blue('应用成功启动, 打开浏览器体验一下吧.'))
  process.exit()
}

exports.stop = async function(dir) {
  var confFile = path.join(dir, 'app.yaml')
  if (fs.exists(confFile)) {
    var confirm = await read('(你确定要停止应用吗? y/n): ')
    if (confirm === 'y') {
      exec('pm2 stop app.yaml')
      console.log(chalk.blue('应用已经停止.'))
    }
  } else {
    console.log(chalk.yellow('应用尚未配置启动...'))
  }
  process.exit()
}

exports.restart = async function(dir) {
  var confFile = path.join(dir, 'app.yaml')
  if (fs.exists(confFile)) {
    var confirm = await read('(你确定要重启应用吗? y/n): ')
    if (confirm === 'y') {
      exec('pm2 restart app.yaml')
      console.log(chalk.blue('应用已经重启.'))
    }
  } else {
    console.log(chalk.yellow('应用尚未配置启动...'))
  }
  process.exit()
}

exports.remove = async function(dir) {
  var confFile = path.join(dir, 'app.yaml')
  if (fs.exists(confFile)) {
    console.log(chalk.yellow('你确定要删除应用吗? '))
    console.log(
      chalk.yellow('(该操作只是从守护进程列表中移除当前应用,不会删除任何文件)')
    )
    var confirm = await read('(请确认操作 y/n): ')
    if (confirm === 'y') {
      exec('pm2 delete app.yaml')
      console.log(chalk.blue('应用已经删除.'))
    }
  } else {
    console.log(chalk.yellow('应用尚未配置启动...'))
  }
  process.exit()
}

exports.status = async function(dir) {
  var confFile = path.join(dir, 'app.yaml')
  if (fs.exists(confFile)) {
    exec('pm2 status app.yaml')
  } else {
    console.log(chalk.yellow('应用尚未配置启动...'))
  }
  process.exit()
}

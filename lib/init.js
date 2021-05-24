/**
 * 初始化项目
 * @author yutent<yutent.io@gmail.com>
 * @date 2020/09/28 15:45:46
 */

const fs = require('iofs')
const path = require('path')
const chalk = require('chalk')

const { exec, read } = require('./tools')
const { start } = require('./pm2')

function encode(obj) {
  return JSON.stringify(obj, null, 2)
}

exports.do_init = async function(dir) {
  var files = fs.ls(dir)
  if (files && files.length) {
    console.log(chalk.red('当前目录非空, 初始化失败...'))
    process.exit()
  }

  console.log(chalk.green('初始化目录...'))
  fs.mkdir(path.join(dir, 'apps'))
  fs.mkdir(path.join(dir, 'models'))
  fs.mkdir(path.join(dir, 'config'))
  fs.mkdir(path.join(dir, 'data'))
  fs.mkdir(path.join(dir, 'public'))
  fs.mkdir(path.join(dir, 'views'))

  fs.echo(
    encode({
      name: 'fivejs-instance',
      type: 'module',
      main: 'app.js'
    }),
    path.join(dir, 'package.json')
  )

  // git忽略配置
  fs.echo(
    `
.Spotlight-V100
.Trashes
.DS_Store
.AppleDouble
.LSOverride
._*
.idea
.vscode

node_modules/
data/logs
public/upload/
package-lock.json
app.yaml
`,
    path.join(dir, '.gitignore')
  )

  // 应用控制器
  fs.echo(
    `

import Controller from '@gm5/controller'

// import Model from '../models/index.js'

// 所有的应用, 都要继承Controller
// 以获取跟框架交互的能力
export default class Index extends Controller  {
  

  // 这个main方法是可选的, 如果有定义, 会自动先调用
  // 可以在这里做任何需要预处理的事, 支持async/await
  __main__(){
    // this.model = new Model(this.ctx.ins('mysql'))
  }

  async indexAction(){
    this.response.end('It works!')
  }
}
  `,
    path.join(dir, 'apps/index.js')
  )

  // 数据模型
  fs.echo(
    `
// 数据模型|存储交互
export default class Index {
  
  constructor(conn){
    // this.db = conn.emit(false, 'test')
  }

  list(){
    // return this.db.table('user').withFields(['id', 'name']).getAll()
  }
}
  `,
    path.join(dir, 'models/index.js')
  )

  // 入口js
  fs.echo(
    `
import Five from '@gm5/core'

const app = new Five()

// 可开启session支持
// app.set({ session: { enabled: true, type: 'redis' } })

// 可开启模板引擎的支持
// app.set({ views: { enabled: true, dir: './views' } })

// 预加载应用, 这一步是必须的, 且需要在listen方法前调用
app.preload('./apps/')

// 中间件示例
// app.use((req, res, next) => {
//   if (req.method !== 'GET') {
//     res.error('', 401)
//   }
//   next()
// })

// 安装拓展包, 可以应用中通过 this.context.$$log调用到, 
// 在中间件, 或后面的其他拓展包中, 可以直接 this.$$log 调用 
// app.install({
//   name: 'log', 
//   install: function() {
//     return new Logs('run_time.log', './data/logs/')
//   }
// })

app.listen(3000)


  `,
    path.join(dir, 'app.js')
  )

  console.log(chalk.green('目录初始化完成!'))

  var confirm = await read('是否立即安装依赖? y/n: ')
  if (confirm === 'y') {
    console.log(chalk.green('依赖安装中...'))
    exec('npm i @gm5/core')
    console.log(chalk.blue('依赖安装完成 ^_^'))
  }

  confirm = await read('是否立即运行? y/n: ')

  if (confirm === 'y') {
    start(dir)
  } else {
    process.exit()
  }
}

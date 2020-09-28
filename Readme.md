# Five.js框架控制台工具
> 一键安装、管理Five.js框架的脚本工具。
>> 仅支持Linux/MacOS

## 安装
> 需要全局安装
```bash
npm i five-cli -g
```

## 用法
> 用法: `five-cli [command] args...`

+ Commands:
  * init <ver>       -    初始化一个版本(最低3.0.0),不指定则为最新版
  * start [prod|dev] -    运行当前的应用(可指定以开发环境还是生产环境启动)
  * stop             -    停止当前应用
  * st|status        -    查看当前应用状态
  * r|restart        -    重启当前应用
  * del|delete       -    删除当前应用
  * -h               -    查看帮助文档
  * -v               -    查看工具的版本


## 更新日志


### v0.4.1
* 优化项目构建
* 支持指令简写
* 优化启动逻辑


### v0.2.0
* 从 v0.2版开始, 将只支持 linux/macos, 且框架自动为最新的3.x。
* [优化] 优化five-cli start [dev|prod] 指令


### v0.1.2
* 下载地址改用github
* 兼容windows
* 优化操作提示
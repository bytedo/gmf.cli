const child = require('child_process')
const readline = require('readline')

exports.exec = function(cmd) {
  return child.execSync(cmd, {
    stdio: [process.stdin, process.stdout, process.stdout]
  })
}

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

exports.read = function(msg) {
  return new Promise(r => {
    rl.question(msg, _ => {
      r(_.trim())
      rl.pause()
    })
  })
}

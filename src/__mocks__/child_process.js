// Mock de child_process para testing
const EventEmitter = require('events')

class MockChildProcess extends EventEmitter {
  constructor() {
    super()
    this.stdout = new EventEmitter()
    this.stderr = new EventEmitter()
    this.killed = false
  }

  kill(signal) {
    this.killed = true
    this.emit('close', signal === 'SIGKILL' ? -1 : 0)
  }
}

const spawn = jest.fn((command, args, options) => {
  const mockProcess = new MockChildProcess()
  
  // Simular comportamiento asíncrono
  setTimeout(() => {
    if (command === 'git' && args.includes('status')) {
      mockProcess.stdout.emit('data', Buffer.from(''))
      mockProcess.emit('close', 0)
    } else if (command === 'git' && args.includes('branch')) {
      mockProcess.stdout.emit('data', Buffer.from('main\n'))
      mockProcess.emit('close', 0)
    } else if (command === 'npm' && args.includes('run')) {
      mockProcess.stdout.emit('data', Buffer.from('Build successful\n'))
      mockProcess.emit('close', 0)
    } else if (command === 'vercel' || command === 'netlify') {
      mockProcess.stdout.emit('data', Buffer.from('Deployment successful\n'))
      mockProcess.stdout.emit('data', Buffer.from('https://test-deployment.vercel.app\n'))
      mockProcess.emit('close', 0)
    } else {
      mockProcess.stdout.emit('data', Buffer.from('Command executed successfully\n'))
      mockProcess.emit('close', 0)
    }
  }, 100)
  
  return mockProcess
})

const exec = jest.fn((command, options, callback) => {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  
  setTimeout(() => {
    if (command.includes('git status --porcelain')) {
      callback(null, { stdout: '', stderr: '' })
    } else if (command.includes('git branch --show-current')) {
      callback(null, { stdout: 'main', stderr: '' })
    } else if (command.includes('npm ls')) {
      callback(null, { stdout: 'All dependencies installed', stderr: '' })
    } else {
      callback(null, { stdout: 'Command executed', stderr: '' })
    }
  }, 100)
})

module.exports = {
  spawn,
  exec,
  ChildProcess: MockChildProcess,
}

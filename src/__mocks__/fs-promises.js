// Mock de fs/promises para testing

const readdir = jest.fn(async (path) => {
  if (path.includes('node_modules')) {
    return ['package1', 'package2', 'package3']
  }
  if (path.includes('.next')) {
    return ['build-manifest.json', 'static']
  }
  return ['vercel.json', 'package.json', 'src']
})

const readFile = jest.fn(async (path, encoding) => {
  if (path.includes('package.json')) {
    return JSON.stringify({
      name: 'test-project',
      scripts: {
        build: 'next build',
        deploy: 'vercel --prod'
      }
    })
  }
  if (path.includes('build-manifest.json')) {
    return JSON.stringify({
      pages: {
        '/': ['static/chunks/main.js'],
        '/_app': ['static/chunks/app.js']
      }
    })
  }
  return 'file content'
})

const access = jest.fn(async (path) => {
  if (path.includes('node_modules') || path.includes('package-lock.json')) {
    return Promise.resolve()
  }
  if (path.includes('nonexistent')) {
    throw new Error('File not found')
  }
  return Promise.resolve()
})

const stat = jest.fn(async (path) => {
  return {
    size: Math.floor(Math.random() * 1000000) + 1000,
    isDirectory: () => path.includes('directory'),
    isFile: () => !path.includes('directory')
  }
})

const writeFile = jest.fn(async (path, data) => {
  return Promise.resolve()
})

module.exports = {
  readdir,
  readFile,
  access,
  stat,
  writeFile,
}

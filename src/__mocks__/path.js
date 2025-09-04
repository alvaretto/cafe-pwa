// Mock de path para testing

const join = jest.fn((...paths) => {
  return paths.join('/')
})

const resolve = jest.fn((...paths) => {
  return '/' + paths.join('/')
})

const relative = jest.fn((from, to) => {
  return to.replace(from, '').replace(/^\//, '')
})

const extname = jest.fn((path) => {
  const parts = path.split('.')
  return parts.length > 1 ? '.' + parts[parts.length - 1] : ''
})

const basename = jest.fn((path, ext) => {
  const name = path.split('/').pop() || ''
  if (ext && name.endsWith(ext)) {
    return name.slice(0, -ext.length)
  }
  return name
})

const dirname = jest.fn((path) => {
  const parts = path.split('/')
  parts.pop()
  return parts.join('/') || '/'
})

module.exports = {
  join,
  resolve,
  relative,
  extname,
  basename,
  dirname,
  sep: '/',
  delimiter: ':',
}

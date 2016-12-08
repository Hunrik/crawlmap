const get = require('simple-get')
const zlib = require('zlib')

exports.Request = (options) => {
  if (!options || !options.url) throw new Error('Invalid parameters')
  if (!/^https?:\/\//i.test(options.url)) {
    options.url = 'http://' + options.url
  }
  return new Promise((resolve, reject) => {
    get(options, (err, res) => {
      if (err) return reject(err)
      if (res.statusCode === 404) return reject('404')
      if (/.gz$/.test(options.url)) {
        const unzip = zlib.createUnzip()
        res.pipe(unzip)
        let data = ''
        unzip.on('data', function (chunk) {
          data += chunk.toString('utf8')
        })
        unzip.on('end', function () {
          return resolve(data)
        })
      } else {
        let data = ''
        res.on('data', function (chunk) {
          data += chunk.toString('utf8')
        })
        res.on('end', function () {
          return resolve(data)
        })
      }
    })
  })
}
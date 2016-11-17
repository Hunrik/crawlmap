const url = require('url')

module.exports = class Sitemapper {
  constructor (options) {
    if (!options) throw new Error('Called without options')
    if (!options.url) throw new Error('Missing parameter')
    this.url = url.parse(options.url)
  }
}


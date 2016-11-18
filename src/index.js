const url = require('url')
const { Request } = require('./utils')
const Promise = require('bluebird')
const xml2js = Promise.promisifyAll(require('xml2js'))

module.exports = class Sitemapper {
  constructor (options) {
    if (!options) throw new Error('Called without options')
    if (!options.url) throw new Error('Missing parameter')
    this.url = url.parse(options.url)
    this.sitemaps = [].concat(options.sitemap)
    this.urls = []
    this.rateLimit = options.rateLimit || 300
    this.afterCheck = options.afterCheck || null
  }
  async crawl () {
    while (this.sitemaps.length > 0) {
      console.log('Sitemaps length', this.sitemaps.length)
      console.log('URLS length', this.urls.length)
      await this.parseSitemapXML()
    }
    let urls = [ ...new Set(this.urls) ]
    return 'urls'
    // this.parseSitemapXML()
  }
  parseRobots () {
    return Promise.coroutine(function * () {
      const domain = this.url.domain
      let options = {
        url: domain + '/robots.txt'
      }
      const resp = yield Request(options)
      console.log(resp)
    })
  }
  async parseSitemapXML () {
    try {
      let url = this.sitemaps.pop()
      if (!url) return
      let resp = await Request({url})
      resp = resp.replace(/<image:.*>.*>/g, '')
      await Promise.delay(this.rateLimit)
      const xml = await xml2js.parseStringAsync(resp, {trim: true, normalize: true})
      return this.processSitemap(xml)
    } catch (e) {
      console.log(e)
    }
  }
  processSitemap (sitemap) {
    if (sitemap.sitemapindex) {
      sitemap.sitemapindex.sitemap.map((elem, i) => {
        const map = elem.loc[0]
        this.sitemaps.push(map)
      })
    } else {
      if(!sitemap.urlset.url) return console.log(sitemap.urlset)
      sitemap.urlset.url.map((url) => {
        this.urls.push(url.loc)
        if (this.afterCheck) this.afterCheck(url.loc)
      })
    }
  }
}


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
    this.crawlFromSitemap = options.crawlFromSitemap || false
  }
  async crawl () {
    if (this.crawlFromSitemap) {
      return await this.parseRobots()
    }
    while (this.sitemaps.length > 0) {
      await this.parseSitemapXML()
    }
    let urls = [ ...new Set(this.urls) ]
    return urls
  }
  async parseRobots () {
    try {
      const domain = this.url.hostname
      let options = {
        url: domain + '/robots.txt'
      }
      const resp = await Request(options)
      let robots = {}
      resp.split('\n')
      .filter((line) => line !== '' && line[0] !== '#')
      .map((line) => {
        let parsed = line.split(': ')
        if (!robots[parsed[0]]) return robots[parsed[0]] = parsed[1]
        if (typeof robots[parsed[0]] === 'object') return robots[parsed[0]].push(parsed[1])
        if (typeof robots[parsed[0]] !== 'object') return robots[parsed[0]] = [robots[parsed[0]]].concat([parsed[1]])
      })
      return robots
    } catch (e) {
      return Promise.reject(e)
    }
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
      if (!sitemap.urlset.url) return console.log(sitemap.urlset)
      sitemap.urlset.url.map((url) => {
        this.urls.push(url.loc)
        if (this.afterCheck) this.afterCheck(url.loc)
      })
    }
  }
}


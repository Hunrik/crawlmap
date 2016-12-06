const url = require('url')
const { Request } = require('./utils')
const Promise = require('bluebird')

module.exports = class Sitemapper {
  constructor (options) {
    if (!options) throw new Error('Called without options')
    if (!options.url && !options.sitemap) throw new Error('Missing parameter')
    this.url = options.url
    this.sitemaps = [].concat(options.sitemap)
    this.urls = []
    this.rateLimit = options.rateLimit || 300
    this.afterCheck = options.afterCheck || null
    this.crawlFromSitemap = options.crawlFromSitemap || false
  }
  async crawl () {
    try {
      /* if (this.url) {
        return await this.parseRobots()
      } */
      while (this.sitemaps.length > 0) {
        await this.parseSitemapXML()
      }
      let urls = [ ...new Set(this.urls) ]
      console.log('Total urls', urls.length)
      return urls
    } catch (e) {
      throw new Error(e)
    }
  }
  async parseRobots () {
    try {
      const domain = url.parse(this.url).hostname
      let options = {
        url: domain + '/robots.txt'
      }
      const resp = await Request(options)
      let robots = {}
      resp.split('\n')
      .filter((line) => line !== '' && line[0] !== '#')
      .map((line) => {
        let parsed = line.split(': ')
        if (!robots[parsed[0]]) {
          robots[parsed[0]] = parsed[1]
          return
        }
        if (typeof robots[parsed[0]] === 'object') return robots[parsed[0]].push(parsed[1])
        if (typeof robots[parsed[0]] !== 'object') {
          robots[parsed[0]] = [robots[parsed[0]]].concat([parsed[1]])
          return
        }
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
      const resp = await Request({url})
      await Promise.delay(this.rateLimit)
      const [sitemaps] = resp.match(/<sitemapindex(.*?)>[\w\W]*?<\/sitemapindex>/g) || ['']
      const [urls] = resp.match(/<urlset(.*?)>[\w\W]*?<\/urlset>/g) || ['']
      if (sitemaps) {
        sitemaps.match(/<loc>[\w\W]*?<\/loc>/g).map(val => {
          let url = val.replace(/<\/?loc>/g, '')
          url = url.replace(/\s/g, '')
          this.sitemaps.push(url)
          return
        })
      }
      if (urls) {
        urls.match(/<loc>[\w\W]*?<\/loc>/g).map(val => {
          let url = val.replace(/<\/?loc>/g, '')
          url = url.replace(/\s/g, '')
          this.urls.push(url)
          return
        })
      }
    } catch (e) {
      throw Error(e)
    }
  }
}


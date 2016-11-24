const Sitemapper = require('./src/index.js')

const data = {
  url: 'http://mall.hu',
  sitemap: 'http://www.emag.hu/sitemaps/sitemap-index.xml',
  crawlFromSitemap: 'true'
}
const req = new Sitemapper(data)

req.crawl().then(console.log)

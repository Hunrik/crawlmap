const Sitemapper = require('./src/index.js')

const data = {
  url: 'http://index.hu',
  sitemap: 'http://www.emag.hu/sitemaps/sitemap-index.xml'
}
const req = new Sitemapper(data)

req.crawl().then(console.log)

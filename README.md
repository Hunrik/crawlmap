# crawlmap
Tool for mapping a site for crawlers

## Example

```
const Sitemapper = require('./src/index.js')

const data = {
  url: 'http://example.com', // This one is required for a later plan. Forgot turn it off.
  sitemap: 'https://www.google.com/sitemap.xml' // This is the sitemap.xml url
}
const req = new Sitemapper(data)

req.crawl().then(console.log) //witht the .crawl function you can start the crawling process. It returns a promise.
```

## Usage


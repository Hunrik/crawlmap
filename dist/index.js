const url = require('url');
const { Request } = require('./utils');
const Promise = require('bluebird');
module.exports = class Sitemapper {
  constructor(options) {
    if (!options) throw new Error('Called without options');
    if (!options.url) throw new Error('Missing parameter');
    this.url = url.parse(options.url);
  }
  crawl() {}
  parseRobots() {
    return Promise.coroutine(function* () {
      const domain = this.url.domain;
      let options = {
        url: domain + '/robots.txt'
      };
      const resp = yield Request(options);
      console.log(resp);
    });
  }
};
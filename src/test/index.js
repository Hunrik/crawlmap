/* global describe, it, beforeEach */
var chai = require('chai')
var expect = chai.expect // we are using the "expect" style of Chai
var Mapper = require('../index.js')
require('./utils.js')
let mapper
describe('Mapper class invocation tests', function () {
  it('Should throw error if called without params', () => {
    expect(() => new Mapper()).to.throw(Error)
  })
  it('Should throw error if called without url', () => {
    expect(() => new Mapper({something: 'Else'})).to.throw(Error)
  })
  it('Should have property url', () => {
    mapper = new Mapper({url: 'emag.hu'})
    expect(mapper).to.have.property('url')
  })
  it('Should have function crawl', () => {
    mapper = new Mapper({url: 'emag.hu'})
    expect(mapper).to.have.property('crawl')
    expect(mapper.crawl).to.be.a('Function')
  })
  it('Should have function parseRobots', () => {
    mapper = new Mapper({url: 'emag.hu'})
    expect(mapper).to.have.property('parseRobots')
    expect(mapper.parseRobots).to.be.a('Function')
  })
})
describe('Function tests', function () {
  beforeEach(() => {
    mapper = new Mapper({url: 'emag.hu'})
  })
  it('Crawl should not throw Error', () => {
    expect(() => mapper.crawl()).to.not.throw(Error)
  })
})
describe('Test parseRobots', function () {
  it('parseRobots should not throw Error', () => {
    expect(() => mapper.parseRobots()).to.not.throw(Error)
  })
  it('parseRobots should not throw Error', () => {
    let robots = mapper.parseRobots()
    console.log(typeof robots)
    expect(robots).to.be.a('Promise')
  })
})


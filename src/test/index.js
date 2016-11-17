/* global describe, it */
var chai = require('chai')
var expect = chai.expect // we are using the "expect" style of Chai
var Mapper = require('../index.js')

describe('Mapper', function () {
  it('Should throw error if called without params', () => {
    expect(() => new Mapper()).to.throw(Error)
  })
  it('Should throw error if called without url', () => {
    expect(() => new Mapper({something: 'Else'})).to.throw(Error)
  })
  it('Shoudld have property url', () => {
    const mapper = new Mapper({url: 'emag.hu'})
    expect(mapper).to.have.property('url')
  })
})

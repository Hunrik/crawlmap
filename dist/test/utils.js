/* global describe, it, beforeEach */
const chai = require('chai');
const expect = chai.expect; // we are using the "expect" style of Chai
const { Request } = require('../utils.js');

const params = {
  url: 'index.hu'
};
describe('Request testing', function () {
  it('Should throw an error if called without parameters', () => {
    expect(() => Request()).to.throw(Error);
  });
  it('Should not throw error if called with parameters', () => {
    expect(() => Request(params)).to.not.throw(Error);
  });
  it('Should be a promise', () => {
    let request = Request(params);
    expect(request).to.be.a('Promise');
  });
  it('Should have status code', () => {
    Request(params).then(resp => {
      expect(resp).to.have.property('statusCode');
    });
  });
  it('Should have data', () => {
    Request(params).then(resp => {
      expect(resp).to.have.property('data');
    });
  });
});
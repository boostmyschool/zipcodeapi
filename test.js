require('isomorphic-fetch');
const fetchMock = require('fetch-mock');
const { expect } = require('chai');
const zipCodeApi = require('./');

describe('zipCodeApi', function () {
  describe('#init', function () {
    it('complains when an apiKey is not given', function () {
      expect(zipCodeApi.init).to.throw('Must set a client key, api key, and domain');
    });
  });

  describe('#lookupZipCode', function () {
    let mock;

    beforeEach(function () {
      zipCodeApi.init({
        // Can use real key and comment out mock to test actual API
        // apiKey: 'fake-key',
        // clientKey: 'fake-key',
        // domain: 'www.zipcodeapi.com',

        apiKey: 'ADD_REAL_KEY',
        clientKey: 'ADD_REAL_KEY',
        domain: 'www.zipcodeapi.com',
        // domain: 'localhost',
        // domain: '162.245.142.87',
      });

      // mock = fetchMock.mock((url, opts) => {
      //   return url.startsWith('https://www.zipcodeapi.com/rest/fake-key/info.json/90210')
      // }, {
      //   city: 'Beverly Hills',
      //   state: 'CA',
      // });
    });

    // afterEach(function () {
    //   mock.restore();
    // });

    it('returns city and state', function () {
      return zipCodeApi.lookupZipCode(90210)
        .then(function (res) {
          expect(res.city).to.equal('Beverly Hills');
          expect(res.state).to.equal('CA');
        });
    });
  });
});

require('isomorphic-fetch');
const fetchMock = require('fetch-mock');
const { expect } = require('chai');
const zipCodeApi = require('./');

describe('zipCodeApi', function () {
  describe('#init', function () {
    it('complains when an apiKey is not given', function () {
      expect(zipCodeApi.init).to.throw('Must set an API key');
    });
  });

  describe('#lookupZipCode', function () {
    let mock;

    beforeEach(function () {
      zipCodeApi.init({
        // Can use real key and comment out mock to test actual API
        apiKey: 'fake-key',
      });

      mock = fetchMock.mock('http://www.zipcodeapi.com/rest/fake-key/info.json/90210/radians', {
        city: 'Beverly Hills',
        state: 'CA',
      });
    });

    afterEach(function () {
      mock.restore();
    });

    it('returns city and state', function () {
      return zipCodeApi.lookupZipCode(90210)
        .then(function (res) {
          expect(res.city).to.equal('Beverly Hills');
          expect(res.state).to.equal('CA');
        });
    });
  });
});

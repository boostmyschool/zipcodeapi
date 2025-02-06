require('isomorphic-fetch');
const fetchMock = require('fetch-mock');
const { expect } = require('chai');
const zipCodeApi = require('./');

describe('zipCodeApi', function () {
  describe('#init', function () {
    it('complains when a client key is not given', function () {
      expect(zipCodeApi.init).to.throw('Must set a client key');
    });
  });

  describe('#lookupZipCode', function () {
    let mock;

    beforeEach(function () {
      zipCodeApi.init({
        // Can use real keys and comment out mock to test actual API by logging out the 
        // genereated url and calling it through codepen using the domain cdpn.io
        // https://codepen.io/caitlinface/pen/bNbPRwV?editors=1011
        apiKey: 'fake-key',
        clientKey: 'fake-key',
        domain: 'fake-domain',
      });

      mock = fetchMock.mock((url, opts) => {
        return url.startsWith('https://www.zipcodeapi.com/rest/fake-key/info.json/90210')
      }, {
        city: 'Beverly Hills',
        state: 'CA',
      });
    });

    after(function () {
      mock.restore();
    });

    it('returns city and state', function () {
      return zipCodeApi.lookupZipCode('90210')
        .then(function (res) {
          expect(res.city).to.equal('Beverly Hills');
          expect(res.state).to.equal('CA');
        });
    });
  });

  describe('when only clientKey is provided', function () {
    beforeEach(function () {
      zipCodeApi.init({
        clientKey: 'fake-key',
      });
    });

    it('generates the url without the authHash', function () {
      expect(zipCodeApi.makeRestUrl('90210')).to
        .equal('https://www.zipcodeapi.com/rest/fake-key/info.json/90210/radians');
    });
  });

  describe('when clientKey, apiKey, and domain are provided', function () {
    beforeEach(function () {
      zipCodeApi.init({
        apiKey: 'fake-key',
        clientKey: 'fake-key',
        domain: 'fake-domain',
      });
    });

    it('generates the url with the authHash', function () {
      expect(zipCodeApi.makeRestUrl('90210')).to
        .include('https://www.zipcodeapi.com/rest/fake-key/info.json/90210/radians?authHash=');
    });
  });
});

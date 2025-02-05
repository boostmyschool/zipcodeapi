const sha1 = require('js-sha1');

function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res;
  }

  const err = new Error(res.statusText);
  err.res = res;
  throw err;
}

function ZipCodeApi() {
}

ZipCodeApi.prototype.init = function(options) {
  options = options || {};
  const clientKey = options.clientKey;
  const apiKey = options.apiKey;
  const domain = options.domain;
  if (!clientKey || !apiKey || !domain) {
    throw new Error('Must set a client key, api key, and domain');
  }

  this.clientKey = clientKey;
  this.apiKey = apiKey;
  this.domain = domain;
};

ZipCodeApi.prototype.makeRestUrl = function(suffix) {
  if (!this.clientKey || !this.apiKey || !this.domain) {
    throw new Error('Must set a client key, api key, and domain');
  }

  const salt = Array.from({ length: 16 }, () => (Math.random() * 36 | 0).toString(36)).join('');
  const currentTime = Math.floor(Date.now() / 1000);
  const sigPrefix = `${currentTime}-6-${salt}`;
  const sigBase = `${sigPrefix}-${this.domain.toLowerCase()}-${this.apiKey}`;
  const hash = sha1(sigBase);
  const authHash = `${sigPrefix}-${hash}`;
  const endpoint = `https://www.zipcodeapi.com/rest/${this.clientKey}${suffix}?authHash=${authHash}`;

  return endpoint;
};

ZipCodeApi.prototype.lookupZipCode = function (zipCode) {
  return fetch(this.makeRestUrl('/info.json/' + zipCode + '/radians'), {
    headers: {
      Accept: 'application/json',
    },
    timeout: 3000,
  }).then(checkStatus)
    .then(function (res) {
      return res.json();
    });
};

const zipCodeApi = new ZipCodeApi();

module.exports = zipCodeApi;

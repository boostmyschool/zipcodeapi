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

  if (!clientKey || !apiKey) {
    throw new Error('Must set a client and api key');
  }

  this.clientKey = clientKey;
  this.apiKey = apiKey;
};

ZipCodeApi.prototype.makeRestUrl = function(suffix) {
  if (!this.clientKey) {
    throw new Error('Must set an API key');
  }

  const salt = 'asdjklfas234r3512kldjfklas'
  const currentTime = Math.floor(Date.now() / 1000);
  const sigPrefix = currentTime + '-1-' + salt;
  const sigBase = sigPrefix + '-localhost-' + this.apiKey;
  const authHash = sigPrefix + '-' + 1234; // TODO need to change this to an sha1 of sigBase

  return 'https://www.zipcodeapi.com/rest/' + this.clientKey + suffix + '?authHash=' + authHash;
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

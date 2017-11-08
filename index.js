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
  const apiKey = options.apiKey;

  if (!apiKey) {
    throw new Error('Must set an API key');
  }

  this.apiKey = apiKey;
};

ZipCodeApi.prototype.makeRestUrl = function(suffix) {
  if (!this.apiKey) {
    throw new Error('Must set an API key');
  }

  return 'http://www.zipcodeapi.com/rest/' + this.apiKey + suffix;
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

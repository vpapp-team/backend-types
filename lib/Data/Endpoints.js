const UTIL = require('backend-util').inputValidation;

class Endpoints {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = Endpoints.validate(data);
    if (error) throw new TypeError(`invalid params provided for "Endpoints": "${error}"`);

    this.version = data.version;
    this.platform = data.platform;
    this.apiVersion = data.apiVersion;
    this.isRecommended = data.isRecommended;
    this.isOutdated = data.isOutdated;
    this.devVersion = data.devVersion;
  }

  _castObject(data) {
    return {
      version: data[0],
      platform: data[1],
      apiVersion: data[2],
      isRecommended: data[3],
      isOutdated: data[4],
      devVersion: data[5],
    };
  }

  simplify(simplifyNested = true) {
    return [
      simplifyNested ? this.version.simplify() : this.version,
      this.platform,
      simplifyNested ? this.apiVersion.simplify() : this.apiVersion,
      this.isRecommended,
      this.isOutdated,
      this.devVersion,
    ];
  }

  isPlatform(platform) {
    if (typeof platform === 'string') {
      return Endpoints.PLATFORMS.indexOf(platform.trim().toLowerCase()) === this.platform;
    } else if (typeof platform === 'number') {
      return platform === this.platform;
    } else {
      throw new TypeError('only support string or number for isPlatform');
    }
  }

  toSQL() {
    return {
      version: this.version.simplify(),
      platform: Endpoints.PLATFORMS[this.platform],
      apiVersion: this.apiVersion.simplify(),
      isRecommended: this.isRecommended,
      isOutdated: this.isOutdated,
      devVersion: this.devVersion,
    };
  }
}

Endpoints.PLATFORMS = 'ios,android,backend'.split(',');

Endpoints.validate = data => {
  if (typeof data !== 'object') return 'data not an object';
  try {
    data.version = UTIL.validateVersion(data.version);
    data.platform = UTIL.validateInStringArray(data.platform, 'platform', Endpoints.PLATFORMS, true);
    data.apiVersion = UTIL.validateVersion(data.apiVersion, 'apiVersion');
    data.isRecommended = UTIL.validateBoolean(data.isRecommended, 'isRecommended');
    data.isOutdated = UTIL.validateBoolean(data.isOutdated, 'isOutdated');
    data.devVersion = UTIL.validateBoolean(data.devVersion, 'devVersion');
  } catch (e) {
    if (e.name !== 'TypeError') throw e;
    return e.message;
  }
  return null;
};

module.exports = Endpoints;

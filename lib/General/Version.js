const VERSION_REGEXP = /^v([0-9a-f]{1,2}.){2}[0-9a-f]{1,2}$/i;

class Version {
  constructor(data) {
    let error = this.validate(data);
    if (error) throw new TypeError(`invalid params provided for "Version": "${error}"`);

    this.parts = data.substr(1).split('.');
    this.major = parseInt(this.parts[0], 16);
    this.minor = parseInt(this.parts[1], 16);
    this.patch = parseInt(this.parts[2], 16);
  }

  validate(data) {
    data = data && data.trim ? data.trim() : data;
    if (typeof data !== 'string') return 'data not a string';
    if (!data.match(VERSION_REGEXP)) return 'data format not known/supported';
    return null;
  }

  simplify() {
    return `v${this.major.toString(16)}.${this.minor.toString(16)}.${this.patch.toString(16)}`;
  }

  equals(item) {
    if (!(item instanceof Version)) return false;

    return this.major === item.major &&
      this.minor === item.minor &&
      this.patch === item.patch;
  }
}

module.exports = Version;

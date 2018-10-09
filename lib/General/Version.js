const VERSION_REGEXP = /^v([0-9a-f]{1,2}\.){2}[0-9a-f]{1,2}$/i;

class Version {
  constructor(data) {
    const error = Version.validate(data);
    if (error) throw new TypeError(`invalid params provided for "Version": "${error}"`);

    const parts = data.trim().substr(1).split('.');
    this.major = parseInt(parts[0], 16);
    this.minor = parseInt(parts[1], 16);
    this.patch = parseInt(parts[2], 16);
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

Version.validate = data => {
  if (typeof data !== 'string') return 'data not a string';
  if (!data.trim().match(VERSION_REGEXP)) return 'data format not known/supported';
  return null;
};

module.exports = Version;

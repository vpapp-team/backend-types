const UUID_REGEXP = /^[a-z0-9.\-_+]+@[a-z0-9.\-_+]+$/i;

const UTIL = require('backend-util');

class UUID {
  constructor(data) {
    const error = this.validate(data);
    if (error) throw new TypeError(`invalid params provided for "UUID": "${error}"`);

    const parts = data.trim().split('@');
    this.id = parts[0];
    this.issuer = parts[1];
    this.resolvedId = this.issuer === host ? UTIL.snowflake.undo(this.id, 64) : null;
  }

  validate(data) {
    if (typeof data !== 'string') return 'data not a string';
    if (!data.trim().match(UUID_REGEXP)) return 'data format not known/supported';
    return null;
  }

  simplify() {
    return `${this.id}@${this.issuer}`;
  }

  equals(item) {
    if (!(item instanceof UUID)) return false;
    return this.id === item.id &&
      this.issuer === item.issuer;
  }
}
UUID.new = () => new UUID(`${UTIL.snowflake.next().base64}@${host}`);

module.exports = UUID;

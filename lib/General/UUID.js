const UUID_REGEXP = /^[a-z0-9.\-_+]+@[a-z0-9.\-_+]+$/i;

class UUID {
  constructor(data) {
    let error = this.validate(data);
    if (error) throw new TypeError(`invalid params provided for "UUID": "${error}"`);

    this.id = data.split('@')[0];
    this.issuer = data.split('@')[1];
    this.resolvedId = this.issuer === process.config.host ? process.snowflake.undo(this.id, 64) : null;
  }

  validate(data) {
    data = data && data.trim ? data.trim() : data;
    if (typeof data !== 'string') return 'data not a string';
    if (!data.match(UUID_REGEXP)) return 'data format not known/supported';
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
UUID.new = () => new UUID(`${process.snowflake.next().base64}@${process.config.host}`);

module.exports = UUID;

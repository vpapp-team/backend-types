class Menu {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = this.validate(data);
    if (error) throw new TypeError(`invalid params provided for "Menu": "${error}"`);

    const CONST_UUID = process.types.get('General').get('UUID');
    const CONST_Time = process.types.get('General').get('Time');

    this.uuid = data.uuid instanceof CONST_UUID ? data.uuid : new CONST_UUID(data.uuid);
    this.day = data.day instanceof CONST_Time ? data.day : new CONST_Time(data.day);
    this.default = data.default;
    this.vegetarian = data.vegetarian || null;
    this.desert = data.desert || null;
    this.evening = data.evening || null;
  }

  _castObject(data) {
    return {
      uuid: data[0],
      day: data[1],
      default: data[2],
      vegetarian: data[3],
      desert: data[4],
      evening: data[5],
    };
  }

  validate(data) {
    if (typeof data !== 'object') return 'data not an object';
    data.default = data.default && data.default.trim ? data.default.trim() : data.default;
    if (!data.default || typeof data.default !== 'string') return 'default not a valid string';
    data.vegetarian = data.vegetarian && data.vegetarian.trim ? data.vegetarian.trim() : data.vegetarian;
    if (typeof data.vegetarian !== 'string' && data.vegetarian) return 'vegetarian not a string nor null';
    data.desert = data.desert && data.desert.trim ? data.desert.trim() : data.desert;
    if (typeof data.desert !== 'string' && data.desert) return 'desert not a string nor null';
    data.evening = data.evening && data.evening.trim ? data.evening.trim() : data.evening;
    if (typeof data.evening !== 'string' && data.evening) return 'evening not a string nor null';
    return null;
  }

  simplify(simplifyNested = true) {
    return [
      simplifyNested ? this.uuid.simplify() : this.uuid,
      simplifyNested ? this.day.simplify() : this.day,
      this.default,
      this.vegetarian,
      this.desert,
      this.evening,
    ];
  }

  equals(item, ignoreUUID = false) {
    if (!(item instanceof Menu)) return false;
    if (!ignoreUUID) return this.uuid.equals(item.uuid);

    return this.day.equals(item.day) &&
      this.default === item.default &&
      this.vegetarian === item.vegetarian &&
      this.desert === item.desert &&
      this.evening === item.evening;
  }

  toSQL() {
    return {
      uuid: this.uuid.simplify(),
      day: this.day.simplify(),
      default: this.default,
      vegetarian: this.vegetarian,
      desert: this.desert,
      evening: this.evening,
    };
  }
}

module.exports = Menu;

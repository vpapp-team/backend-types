const UTIL = require('backend-util').inputValidation;

class Menu {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = Menu.validate(data);
    if (error) throw new TypeError(`invalid params provided for "Menu": "${error}"`);

    this.uuid = data.uuid;
    this.day = data.day;
    this.default = data.default;
    this.vegetarian = data.vegetarian;
    this.desert = data.desert;
    this.evening = data.evening;
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

Menu.validate = data => {
  if (typeof data !== 'object') return 'data not an object';
  try {
    data.uuid = UTIL.validateUUID(data.uuid);
    data.day = UTIL.validateTime(data.day, 'day');
    data.default = UTIL.validateString(data.default, 'default');
    data.vegetarian = UTIL.validateNullable(data.vegetarian, 'vegetarian', UTIL.validateString);
    data.desert = UTIL.validateNullable(data.desert, 'desert', UTIL.validateString);
    data.evening = UTIL.validateNullable(data.evening, 'evening', UTIL.validateString);
  } catch (e) {
    if (e.name !== 'TypeError') throw e;
    return e.message;
  }
  return null;
};

module.exports = Menu;

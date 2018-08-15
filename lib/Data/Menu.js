const CONST_UUID = require('../General/UUID');
const CONST_Time = require('../General/Time');

class Menu {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = this.validate(data);
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

  validate(data) {
    if (typeof data !== 'object') return 'data not an object';
    try {
      data.uuid = Menu.validateUUID(data.uuid);
      data.day = Menu.validateDay(data.day);
      data.default = Menu.validateDefault(data.default);
      data.vegetarian = Menu.validateVegetarian(data.vegetarian);
      data.desert = Menu.validateDesert(data.desert);
      data.evening = Menu.validateEvening(data.evening);
    } catch (e) {
      return e.message;
    }
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
Menu.validateUUID = dataUUID => {
  if (dataUUID instanceof CONST_UUID) return dataUUID;
  try {
    return new CONST_UUID(dataUUID);
  } catch (e) {
    throw new TypeError(`uuid invalid: ${e.message}`);
  }
};
Menu.validateDay = dataDay => {
  if (dataDay instanceof CONST_Time) return dataDay;
  try {
    return new CONST_Time(dataDay);
  } catch (e) {
    throw new TypeError(`day invalid: ${e.message}`);
  }
};
Menu.validateDefault = dataDefault => {
  if (typeof dataDefault === 'string') dataDefault = dataDefault.trim();
  if (!dataDefault || typeof dataDefault !== 'string') throw new TypeError('default not a valid string');
  return dataDefault;
};
Menu.validateVegetarian = dataVegetarian => {
  if (typeof dataVegetarian === 'string') dataVegetarian = dataVegetarian.trim();
  if (typeof dataVegetarian !== 'string' && dataVegetarian) throw new TypeError('vegetarian not a string nor null');
  return dataVegetarian || null;
};
Menu.validateDesert = dataDesert => {
  if (typeof dataDesert === 'string') dataDesert = dataDesert.trim();
  if (typeof dataDesert !== 'string' && dataDesert) throw new TypeError('desert not a string nor null');
  return dataDesert || null;
};
Menu.validateEvening = dataEvening => {
  if (typeof dataEvening === 'string') dataEvening = dataEvening.trim();
  if (typeof dataEvening !== 'string' && dataEvening) throw new TypeError('evening not a string nor null');
  return dataEvening || null;
};

module.exports = Menu;

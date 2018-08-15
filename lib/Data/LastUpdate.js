const CONST_Time = require('../General/Time');

class LastUpdate {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = this.validate(data);
    if (error) throw new TypeError(`invalid params provided for "LastUpdate": "${error}"`);

    this.lastUpdate = data.lastUpdate;
    this.category = data.category;
  }

  _castObject(data) {
    return {
      category: data[0],
      lastUpdate: data[1],
    };
  }

  validate(data) {
    if (typeof data !== 'object') return 'data not an object';
    try {
      data.category = LastUpdate.validateCategory(data.category);
      data.lastUpdate = LastUpdate.validateLastUpdate(data.lastUpdate);
    } catch (e) {
      return e.message;
    }
    return null;
  }

  isCategory(category) {
    if (typeof category === 'string') {
      return LastUpdate.CATEGORIES.indexOf(category.trim()) === this.category;
    } else if (typeof category === 'number') {
      return category === this.category;
    } else {
      throw new TypeError('only support string or number for isCategory');
    }
  }

  toSQL() {
    return {
      category: LastUpdate.CATEGORIES[this.category],
      lastUpdate: this.lastUpdate.simplify(),
    };
  }

  simplify(simplifyNested = true) {
    return [
      this.category,
      simplifyNested ? this.lastUpdate.simplify() : this.lastUpdate,
    ];
  }
}
LastUpdate.validateCategory = dataCategory => {
  if (typeof dataCategory === 'string') dataCategory = LastUpdate.CATEGORIES.indexOf(dataCategory.trim().toLowerCase());
  if (typeof dataCategory !== 'number') throw new TypeError('category not a number');
  if (dataCategory < 0 || dataCategory >= LastUpdate.CATEGORIES.length || Math.floor(dataCategory) !== dataCategory) {
    throw new TypeError('category out of range');
  }
  return dataCategory;
};
LastUpdate.validateLastUpdate = dataLastUpdate => {
  if (dataLastUpdate instanceof CONST_Time) return dataLastUpdate;
  try {
    return new CONST_Time(dataLastUpdate);
  } catch (e) {
    throw new TypeError(`lastUpdate invalid: ${e.message}`);
  }
};

LastUpdate.CATEGORIES = 'timetables,rooms,teachers,menu,stand-in,calendar,lessonranges,version'.split(',');
module.exports = LastUpdate;

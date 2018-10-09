const UTIL = require('backend-util').inputValidation;

class LastUpdate {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = LastUpdate.validate(data);
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

LastUpdate.CATEGORIES = 'timetables,rooms,teachers,menu,stand-in,calendar,lessonranges,endpoint-versions'.split(',');
LastUpdate.HIDDEN_CATEGORIES = 'lessonranges,endpoint-versions'.split(',');
LastUpdate.PUBLIC_UPDATES = LastUpdate.CATEGORIES.filter(a => !LastUpdate.HIDDEN_CATEGORIES.includes(a));


LastUpdate.validate = data => {
  if (typeof data !== 'object') return 'data not an object';
  try {
    data.category = UTIL.validateInStringArray(data.category, 'category', LastUpdate.validateCategory, true);
    data.lastUpdate = UTIL.validateTime(data.lastUpdate, 'lastUpdate');
  } catch (e) {
    if (e.name !== 'TypeError') throw e;
    return e.message;
  }
  return null;
};

module.exports = LastUpdate;

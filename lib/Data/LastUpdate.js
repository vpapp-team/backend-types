const CATEGORIES = 'timetables,rooms,teachers,menu,stand-in,calendar,lessonranges,version'.split(',');

class LastUpdate {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = this.validate(data);
    if (error) throw new TypeError(`invalid params provided for "LastUpdate": "${error}"`);

    const CONST_Time = process.types.get('General').get('Time');

    this.category = data.category;
    this.lastUpdate = data.lastUpdate instanceof CONST_Time ? data.lastUpdate : new CONST_Time(data.lastUpdate);
  }

  _castObject(data) {
    return {
      category: data[0],
      lastUpdate: data[1],
    };
  }

  validate(data) {
    if (typeof data !== 'object') return 'data not an object';
    if (typeof data.category === 'string') data.category = CATEGORIES.indexOf(data.category.toLowerCase());
    if (typeof data.category !== 'number') return 'category not a number';
    if (data.category < 0 || data.category >= CATEGORIES.length || Math.floor(data.category) !== data.category) return 'category out of range';
    return null;
  }

  isCategory(category) {
    if (typeof category === 'string') {
      return CATEGORIES.indexOf(category) === this.category;
    } else if (typeof category === 'number') {
      return category === this.category;
    } else {
      throw new TypeError('only support string or number for isCategory');
    }
  }

  toSQL() {
    return {
      category: CATEGORIES[this.category],
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
LastUpdate.CATEGORIES = CATEGORIES;

module.exports = LastUpdate;

const TIME_REGEXP = /^DT?[0-9]+$/i;

class Time {
  constructor(data) {
    let error = this.validate(data);
    if (error) throw new TypeError(`invalid params provided for "Time": "${error}"`);

    this.rawNumber = 0;
    this.hasTime = false;

    if (typeof data === 'string') this._buildFromString(data);
    else this._buildFromObject(data);
  }

  validate(data) {
    if (typeof data === 'string') {
      data = data && data.trim ? data.trim() : data;
      if (!data.match(TIME_REGEXP)) return 'invalid string format';
      return null;
    } else if (typeof data === 'object') {
      if (!data.hasOwnProperty('year')) return 'missing year property';
      if (isNaN(data.year)) return 'year not a number';
      if (!data.hasOwnProperty('month')) return 'missing month property';
      if (isNaN(data.month)) return 'month not a number';
      if (!data.hasOwnProperty('day')) return 'missing day property';
      if (isNaN(data.day)) return 'day not a number';
      return null;
    }
    return `unknown type "${typeof data}"`;
  }

  _buildFromString(data) {
    this.hasTime = data.toLowerCase().includes('t');
    this.rawNumber = Number(data.substr(this.hasTime ? 2 : 1));
  }

  _buildFromObject(obj) {
    const rawDate = new Date(0);
    rawDate.setFullYear(Number(obj.year));
    // January = 0
    rawDate.setMonth(Number(obj.month));
    rawDate.setDate(Number(obj.day));
    // Needed since we may get problems with timezones
    rawDate.setHours(12);
    // 86400000 = 24 * 60 * 60 * 1000
    this.rawNumber = Math.floor(rawDate.getTime() / 86400000);
  }

  getDayInWeek(targetDayNr) {
    // TargetDayNr = Number representing the day starting at sunday = 0
    const thisDate = new Date(this.hasTime ? this.rawNumber : this.rawNumber * 86400000);
    const dayNr = (thisDate.getDay() + 6) % 7;
    thisDate.setDate(thisDate.getDate() - dayNr + 3);
    // Needed since we may get problems with timezones
    thisDate.setHours(12);

    // Store the millisecond value of the target date
    const firstThursday = thisDate.valueOf();

    // 86400000 = 24 * 60 * 60 * 1000
    const targetDay = firstThursday + ((targetDayNr - 4) * 86400000);
    return new Time(`D${Math.floor(targetDay / 86400000)}`);
  }

  getWeek() {
    // 86400000 = 24 * 60 * 60 * 1000
    const thisDate = new Date(this.hasTime ? this.rawNumber : this.rawNumber * 86400000);
    // Create a copy of the date object
    const target = new Date(thisDate.valueOf());

    // ISO week date weeks start on monday
    // so correct the day number
    const dayNr = (thisDate.getDay() + 6) % 7;

    // ISO 8601 states that week 1 is the week
    // with the first thursday of that year.
    // Set the target date to the thursday in the target week
    target.setDate(target.getDate() - dayNr + 3);

    // Store the millisecond value of the target date
    const firstThursday = target.valueOf();

    // Set the target to the first thursday of the year
    // First set the target to january first
    target.setMonth(0, 1);
    // Not a thursday? Correct the date to the next thursday
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + (((4 - target.getDay()) + 7) % 7));
    }

    // The weeknumber is the number of weeks between the
    // first thursday of the year and the thursday in the target week
    // 604800000 = 7 * 24 * 60 * 60 * 1000
    return 1 + Math.ceil((firstThursday - target) / 604800000);
  }

  offset(days = 0, milliseconds = 0, clone = true) {
    let newRawNumber = this.rawNumber;
    if (this.hasTime) {
      newRawNumber += milliseconds;
      // 86400000 = 24 * 60 * 60 * 1000
      newRawNumber += days * 86400000;
    } else { newRawNumber += days; }
    if (clone) return new Time(`D${this.hasTime ? 'T' : ''}${newRawNumber}`);
    else this.rawNumber = newRawNumber;
    return this;
  }

  simplify() {
    return `D${this.hasTime ? 'T' : ''}${this.rawNumber}`;
  }

  toUnix() {
    // 86400000 = 24 * 60 * 60 * 1000
    return this.hasTime ? this.rawNumber : this.rawNumber * 86400000;
  }

  equals(item) {
    if (!(item instanceof Time)) return false;
    return this.hasTime === item.hasTime &&
      this.rawNumber === item.rawNumber;
  }
}
Time.now = (hasTime = true) => new Time(`D${hasTime ? 'T' : ''}${hasTime ? Date.now() : Math.floor(Date.now() / 24 / 60 / 60 / 1000)}`); // eslint-disable-line max-len

module.exports = Time;

const TIME_REGEXP = /^DT?[0-9]+$/i;

const DAY_MILISEC = 24 * 60 * 60 * 1000;
const WEEK_MILISEC = 7 * DAY_MILISEC;

class Time {
  constructor(data) {
    let parsed = this.validate(data);
    if (typeof parsed === 'string') throw new TypeError(`invalid params provided for "Time": "${parsed}"`);

    this.rawNumber = parsed.rawNumber;
    this.hasTime = parsed.hasTime;

    if (typeof data === 'string') this._buildFromString(data);
    else this._buildFromObject(data);
  }

  validate(data) {
    if (typeof data === 'string') {
      return this._buildFromString(data.trim());
    } else if (typeof data === 'object') {
      return this._buildFromObject(data);
    }
    return `unknown type "${typeof data}"`;
  }

  _buildFromString(data) {
    if (!data.match(TIME_REGEXP)) return 'invalid string format';
    const hasTime = data.toLowerCase().includes('t');
    return {
      rawNumber: Number(data.substr(hasTime ? 2 : 1)),
      hasTime,
    };
  }

  _buildFromObject(obj) {
    const rawDate = new Date(0);

    if (!obj.hasOwnProperty('year')) return 'missing year property';
    if (isNaN(obj.year)) return 'year not a number';
    rawDate.setUTCFullYear(Number(obj.year));

    if (!obj.hasOwnProperty('month')) return 'missing month property';
    if (isNaN(obj.month)) return 'month not a number';
    // January = 0
    rawDate.setUTCMonth(Number(obj.month));

    if (!obj.hasOwnProperty('day')) return 'missing day property';
    if (isNaN(obj.day)) return 'day not a number';
    rawDate.setUTCDate(Number(obj.day));
    return {
      hasTime: false,
      rawNumber: Math.floor(rawDate.getTime() / DAY_MILISEC),
    };
  }

  getDayInWeek(targetDayNr) {
    // TargetDayNr = Number representing the day starting at sunday = 0
    const thisDate = new Date(this.hasTime ? this.rawNumber : this.rawNumber * DAY_MILISEC);
    const dayNr = (thisDate.getDay() + 6) % 7;
    thisDate.setDate(thisDate.getDate() - dayNr + 3);
    // Needed since we may get problems with timezones
    thisDate.setHours(12);

    // Store the millisecond value of the target date
    const firstThursday = thisDate.valueOf();

    const targetDay = firstThursday + ((targetDayNr - 4) * DAY_MILISEC);
    return new Time(`D${Math.floor(targetDay / DAY_MILISEC)}`);
  }

  getWeek() {
    const thisDate = new Date(this.hasTime ? this.rawNumber : this.rawNumber * DAY_MILISEC);
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
    return 1 + Math.ceil((firstThursday - target) / WEEK_MILISEC);
  }

  offset(days = 0, milliseconds = 0, clone = true) {
    let newRawNumber = this.rawNumber;
    if (this.hasTime) {
      newRawNumber += milliseconds;
      newRawNumber += days * DAY_MILISEC;
    } else { newRawNumber += days; }
    if (clone) return new Time(`D${this.hasTime ? 'T' : ''}${newRawNumber}`);
    else this.rawNumber = newRawNumber;
    return this;
  }

  simplify() {
    return `D${this.hasTime ? 'T' : ''}${this.rawNumber}`;
  }

  toUnix() {
    return this.hasTime ? this.rawNumber : this.rawNumber * DAY_MILISEC;
  }

  equals(item) {
    if (!(item instanceof Time)) throw new TypeError('expecting object of instance time');
    return this.hasTime === item.hasTime &&
      this.rawNumber === item.rawNumber;
  }
}
Time.now = (hasTime = true) => new Time(`D${hasTime ? 'T' : ''}${hasTime ? Date.now() : Math.floor(Date.now() / DAY_MILISEC)}`); // eslint-disable-line max-len

module.exports = Time;

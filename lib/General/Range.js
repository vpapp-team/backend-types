const FROM_TO_REGEXP = /^(DT?)[0-9]+-(\1[0-9]+)?$|^-(DT?)[0-9]+$/i;
const AROUND_REGEXP = /^(DT?)[0-9]+\+-\1[0-9]+$/i;

const DAY_MILISEC = 24 * 60 * 60 * 1000;

const CONST_Time = require('../General/Time');

class Range {
  constructor(data) {
    const error = Range.validate(data);
    if (error) throw new TypeError(`invalid params provided for "Range": "${error}"`);

    data = data.trim();
    this.hasTime = data.toLowerCase().includes('t');
    this.isAround = !!data.match(AROUND_REGEXP);
    const parts = data.split(/\+?-/).map(a => a.substr(this.hasTime ? 2 : 1));
    const first = Number(parts[0]);
    const second = Number(parts[1]);
    this.start = this.isAround ? first - second : parts[0] ? first : -Infinity;
    this.end = this.isAround ? first + second : parts[1] ? second : Infinity;
  }

  simplify() {
    const hasTime = this.hasTime ? 'T' : '';
    const start = this.start === -Infinity ? '' : `D${hasTime}${this.start}`;
    const end = this.end === Infinity ? '' : `D${hasTime}${this.end}`;
    return `${start}-${end}`;
  }

  isIn(time) {
    if (!(time instanceof CONST_Time)) throw new TypeError('expecting object of instance time');
    if (this.hasTime === time.hasTime) {
      // Both datetime or both date
      return time.rawNumber.betweenNum(this.start, this.end, undefined, true);
    } else {
      if (time.hasTime) time.rawNumber.betweenNum(this.start, this.end, undefined, true);
      // +1 since we want to include events on "this.end" date
      return (time.rawNumber * DAY_MILISEC).betweenNum(this.start * DAY_MILISEC,
        (this.end + 1) * DAY_MILISEC,
        undefined,
        true
      );
    }
  }

  isBefore(time) {
    if (!(time instanceof CONST_Time)) throw new TypeError('expecting object of instance time');
    if (this.hasTime === time.hasTime) {
      return time.rawNumber < this.start;
    } else {
      return (time.hasTime ? time.rawNumber : (time.rawNumber + 1) * DAY_MILISEC
      ) < (
        this.hasTime ? this.start : this.start * DAY_MILISEC);
    }
  }

  isAfter(time) {
    if (!(time instanceof CONST_Time)) throw new TypeError('expecting object of instance time');
    if (this.hasTime === time.hasTime) {
      return time.rawNumber > this.end;
    } else {
      return (time.hasTime ? time.rawNumber : time.rawNumber * DAY_MILISEC
      ) > (
        this.hasTime ? this.end : (this.end + 1) * DAY_MILISEC);
    }
  }
}

Range.validate = data => {
  if (typeof data !== 'string') return 'data not a string';
  data = data.trim();
  if (!data.match(AROUND_REGEXP) && !data.match(FROM_TO_REGEXP)) return 'data format not known/supported';
  return null;
};

module.exports = Range;

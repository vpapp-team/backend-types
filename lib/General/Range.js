const FROM_TO_REGEXP = /^(DT?)[0-9]+-(\1[0-9]+)?$|^-(DT?)[0-9]+$/i;
const AROUND_REGEXP = /^(DT?)[0-9]+\+-\1[0-9]+$/i;

class Range {
  constructor(data) {
    let error = this.validate(data);
    if (error) throw new TypeError(`invalid params provided for "Range": "${error}"`);

    this.string = data;
    this.hasTime = data.toLowerCase().includes('t');
    this.isAround = !!data.match(AROUND_REGEXP);
    let parts = data.split(/\+?-/);
    const first = Number(parts[0].substr(this.hasTime ? 2 : 1));
    const second = Number(parts[1].substr(this.hasTime ? 2 : 1));
    this.start = this.isAround ? first - second : parts[0] ? first : -Infinity;
    this.end = this.isAround ? first + second : parts[1] ? second : Infinity;
  }

  validate(data) {
    data = data && data.trim ? data.trim() : data;
    if (typeof data !== 'string') return 'data not a string';
    if (!data.match(AROUND_REGEXP) && !data.match(FROM_TO_REGEXP)) return 'data format not known/supported';
    return null;
  }

  simplify() {
    return `${this.start === -Infinity ? '' : `D${this.hasTime ? 'T' : ''}${this.start}`}-${this.end === Infinity ? '' : `D${this.hasTime ? 'T' : ''}${this.end}`}`; // eslint-disable-line max-len
  }

  isIn(time) {
    if (!(time instanceof process.types.get('General').get('Time'))) {
      throw new TypeError('expecting object of instance time');
    }
    if (this.hasTime === time.hasTime) {
      // Both datetime or both date
      return process.util.betweenNum(time.rawNumber, this.start, this.end, undefined, true);
    } else {
      return process.util.betweenNum(
        time.hasTime ? time.rawNumber : time.rawNumber * (24 * 60 * 60 * 1000),
        this.hasTime ? this.start : this.start * (24 * 60 * 60 * 1000),
        this.hasTime ? this.end : (this.end + 1) * (24 * 60 * 60 * 1000),
        undefined,
        true
      );
    }
  }

  isBefore(time) {
    if (!(time instanceof process.types.get('General').get('Time'))) {
      throw new TypeError('expecting object of instance time');
    }
    if (this.hasTime === time.hasTime) {
      return time.rawNumber < this.start;
    } else {
      return (time.hasTime ? time.rawNumber : (time.rawNumber + 1) * (24 * 60 * 60 * 1000)
      ) < (
        this.hasTime ? this.start : this.start * (24 * 60 * 60 * 1000));
    }
  }

  isAfter(time) {
    if (!(time instanceof process.types.get('General').get('Time'))) {
      throw new TypeError('expecting object of instance time');
    }
    if (this.hasTime === time.hasTime) {
      return time.rawNumber > this.end;
    } else {
      return (time.hasTime ? time.rawNumber : time.rawNumber * (24 * 60 * 60 * 1000)
      ) > (
        this.hasTime ? this.end : (this.end + 1) * (24 * 60 * 60 * 1000));
    }
  }
}

module.exports = Range;

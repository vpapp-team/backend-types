const RANGE_REGEXP = /^([0-9]{1,2}:[0-9]{1,2})?-[0-9]{1,2}:[0-9]{1,2}$|^[0-9]{1,2}:[0-9]{1,2}-$/;
const RANGE_PART = /^[0-9]{1,2}:[0-9]{1,2}$/;

const CONST_LessonDiscrim = require('../General/LessonDiscriminator');

class LessonRange {
  constructor(data) {
    const error = this.validate(data);
    if (error) throw new TypeError(`invalid params provided for "LessonRange": "${error}"`);

    this.discriminator = data.discriminator;
    this.time = data.time;
  }

  validate(data) {
    if (typeof data !== 'object') return 'data not an object';
    try {
      data.discriminator = LessonRange.validateDiscriminator(data.discriminator);
      data.time = LessonRange.validateTime(data.discriminator);
    } catch (e) {
      return e.message;
    }
    return null;
  }

  simplify(simplifyNested = true) {
    return {
      discriminator: simplifyNested ? this.discriminator.simplify() : this.discriminator,
      time: `${this.time.start ? this.time.start : ''}-${this.time.end ? this.time.end : ''}`,
    };
  }
}
LessonRange.validateDiscriminator = dataDiscrim => {
  if (dataDiscrim instanceof CONST_LessonDiscrim) return dataDiscrim;
  try {
    return new CONST_LessonDiscrim(dataDiscrim);
  } catch (e) {
    throw new TypeError(`discriminator invalid: ${e.message}`);
  }
};
LessonRange.validateTime = dataTime => {
  if (typeof dataTime === 'string') {
    dataTime = dataTime.trim();
    if (!dataTime.match(RANGE_REGEXP)) throw new TypeError('time string has wrong format');
    const parts = dataTime.split('-');
    return {
      start: parts[0] || null,
      end: parts[1] || null,
    };
  } else if (typeof dataTime === 'object') {
    if (typeof dataTime.start !== 'string') throw new TypeError('time.start not a string');
    if (dataTime.start && !dataTime.start.match(RANGE_PART)) throw new TypeError('time has invalid start');
    if (typeof dataTime.end !== 'string') throw new TypeError('time.end not a string');
    if (dataTime.end && !dataTime.end.match(RANGE_PART)) throw new TypeError('time has invalid end');
    return {
      start: dataTime.start || null,
      end: dataTime.end || null,
    };
  } else {
    throw new TypeError('time not string nor object');
  }
};

module.exports = LessonRange;

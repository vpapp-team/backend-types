const UTIL = require('backend-util');

class LessonRange {
  constructor(data) {
    const error = LessonRange.validate(data);
    if (error) throw new TypeError(`invalid params provided for "LessonRange": "${error}"`);

    this.discriminator = data.discriminator;
    this.time = data.time;
  }

  simplify(simplifyNested = true) {
    return {
      discriminator: simplifyNested ? this.discriminator.simplify() : this.discriminator,
      time: `${this.time.start ? this.time.start : ''}-${this.time.end ? this.time.end : ''}`,
    };
  }
}

LessonRange.validate = data => {
  if (typeof data !== 'object') return 'data not an object';
  try {
    data.discriminator = UTIL.validateLesson(data.discriminator, 'discriminator');
    data.time = UTIL.validateLessonRangesTime(data.time);
  } catch (e) {
    if (e.name !== 'TypeError') throw e;
    return e.message;
  }
  return null;
};

module.exports = LessonRange;

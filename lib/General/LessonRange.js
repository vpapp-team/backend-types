const RANGE_REGEXP = /^([0-9]{1,2}:[0-9]{1,2})?-[0-9]{1,2}:[0-9]{1,2}|[0-9]{1,2}:[0-9]{1,2}-$/;

class LessonRange {
  constructor(data) {
    let error = this.validate(data);
    if (error) throw new TypeError(`invalid params provided for "LessonRange": "${error}"`);

    const CONST_LessonDiscrim = process.types.get('General').get('LessonDiscriminator');

    if (data.discriminator instanceof CONST_LessonDiscrim) this.discriminator = data.discriminator;
    else this.discriminator = new CONST_LessonDiscrim(data.discriminator);

    this.time = {
      start: data.time.split('-')[0] || null,
      end: data.time.split('-')[1] || null,
    };
  }

  validate(data) {
    if (typeof data !== 'object') return 'data not an object';
    data.time = data.time && data.time.trim ? data.time.trim() : data.time;
    if (typeof data.time !== 'string') return 'time not a string';
    if (!data.time.match(RANGE_REGEXP)) return 'time wrong format';
    return null;
  }

  simplify(simplifyNested = true) {
    return {
      discriminator: simplifyNested ? this.discriminator.simplify() : this.discriminator,
      time: `${this.time.start ? this.time.start : ''}-${this.time.end ? this.time.end : ''}`,
    };
  }
}
LessonRange.verifyDiscriminator = dataDiscrim => {
  const CONST_LessonDiscrim = process.types.get('General').get('LessonDiscriminator');
  try {
    let discriminator = dataDiscrim instanceof CONST_LessonDiscrim ? dataDiscrim : new CONST_LessonDiscrim(dataDiscrim);
    return discriminator.simplify();
  } catch (e) {
    throw e;
  }
};
LessonRange.validateTime = dataTime => {
  dataTime = dataTime && dataTime.trim ? dataTime.trim() : dataTime;
  if (typeof dataTime !== 'string') throw new TypeError('time not a string');
  if (!dataTime.match(RANGE_REGEXP)) throw new TypeError('time wrong format');
  let time = {
    start: dataTime.split('-')[0] || null,
    end: dataTime.split('-')[1] || null,
  };
  return `${time.start ? time.start : ''}-${time.end ? time.end : ''}`;
};

module.exports = LessonRange;

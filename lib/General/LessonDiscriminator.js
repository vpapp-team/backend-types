const REGULAR_REGEXP = /^[0-9]{1,2}(\s*-\s*[0-9]{1,2})?$/;
const BETWEEN_REGEXP = /^(([0-9]{1,2}\/)?\/[0-9]{1,2}|[0-9]{1,2}\/)$/;

class LessonDiscriminator {
  constructor(data) {
    let error = this.validate(data);
    if (error) throw new TypeError(`invalid params provided for "LessonDiscriminator": "${error}"`);

    this.string = data.replace(/\s+/g, '');
    this.isRegular = !!data.match(REGULAR_REGEXP);
  }

  validate(data) {
    data = data && data.trim ? data.trim() : data;
    if (typeof data !== 'string') return 'data not a string';
    if (!data.match(REGULAR_REGEXP) && !data.match(BETWEEN_REGEXP)) return 'data format not known/supported';
    return null;
  }

  simplify() {
    return this.string;
  }

  equals(item) {
    if (!(item instanceof LessonDiscriminator)) return false;
    return this.string === item.string;
  }
}

module.exports = LessonDiscriminator;

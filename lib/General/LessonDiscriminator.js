const REGULAR_REGEXP = /^[0-9]{1,2}(\s*-\s*[0-9]{1,2})?$/;
const BETWEEN_REGEXP = /^(([0-9]{1,2}\/)?\/[0-9]{1,2}|[0-9]{1,2}\/)$/;

class LessonDiscriminator {
  constructor(data) {
    const error = LessonDiscriminator.validate(data);
    if (error) throw new TypeError(`invalid params provided for "LessonDiscriminator": "${error}"`);

    this.string = data.replace(/\s+/g, '');
    this.isRegular = !!this.string.match(REGULAR_REGEXP);
  }

  simplify() {
    return this.string;
  }

  equals(item) {
    if (!(item instanceof LessonDiscriminator)) return false;
    return this.string === item.string;
  }
}

LessonDiscriminator.validate = data => {
  if (typeof data !== 'string') return 'data not a string';
  data = data.trim();
  if (!data.match(REGULAR_REGEXP) && !data.match(BETWEEN_REGEXP)) return 'data format not known/supported';
  return null;
};

module.exports = LessonDiscriminator;

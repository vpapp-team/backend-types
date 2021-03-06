const REGULAR_REGEXP = /^([5-9]|10)[a-d]+|11|12$/i;

class ClassDiscriminator {
  constructor(data) {
    if (!ClassDiscriminator.validate(data)) {
      throw new TypeError(`invalid params provided for "ClassDiscriminator": "data not a valid string"`);
    }

    this.string = data.trim();
    this.regular = !!data.match(REGULAR_REGEXP);
  }

  simplify() {
    return this.string;
  }

  equals(item) {
    if (!(item instanceof ClassDiscriminator)) return false;
    return this.string === item.string;
  }
}

ClassDiscriminator.validate = data => {
  data = typeof data === 'string' ? data.trim() : data;
  return !!data && typeof data === 'string';
};

module.exports = ClassDiscriminator;

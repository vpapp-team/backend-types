const TYPES = 'class,teacher,room'.split(',');

class Timetable {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = this.validate(data);
    if (error) throw new TypeError(`invalid params provided for "Timetable": "${error}"`);

    const CONST_UUID = process.types.get('General').get('UUID');
    const CONST_ClassDiscrim = process.types.get('General').get('ClassDiscriminator');
    const CONST_Time = process.types.get('General').get('Time');
    const CONST_Lesson = process.types.get('Data').get('Lesson');

    this.uuid = data.uuid instanceof CONST_UUID ? data.uuid : new CONST_UUID(data.uuid);
    this.type = data.type;
    if (data.type === 0) {
      this.master = data.master instanceof CONST_ClassDiscrim ? data.master : new CONST_ClassDiscrim(data.master);
    } else { this.master = data.master; }
    this.activation = data.activation instanceof CONST_Time ? data.activation : new CONST_Time(data.activation);
    this.lessons = data.lessons.map(a => a instanceof CONST_Lesson ? a : new CONST_Lesson(a));
  }

  _castObject(data) {
    return {
      uuid: data[0],
      type: data[1],
      master: data[2],
      activation: data[3],
      lessons: data[4],
    };
  }

  validate(data) {
    if (typeof data !== 'object') return 'data not an object';
    if (typeof data.type === 'string') data.type = TYPES.indexOf(data.type.toLowerCase());
    if (typeof data.type !== 'number') return 'type not a number';
    if (data.type < 0 || data.type >= TYPES.length || Math.floor(data.type) !== data.type) return 'type out of range';
    if (data.type === 1 || data.type === 2) {
      data.master = data.master && data.master.trim ? data.master.trim() : data.master;
      if (!data.master || typeof data.master !== 'string') return `master not a string with type ${data.type}`;
    }
    if (data.content && typeof data.content === 'string') {
      try {
        data.lessons = JSON.parse(data.content)
          .map(a => new (process.types.get('Data').get('Lesson'))(a, a.masterUUID || data.uuid));
      } catch (e) {
        return 'failed to cast to array';
      }
    }
    if (!Array.isArray(data.lessons)) return 'lessons not an array';
    return null;
  }

  simplify(simplifyNested = true) {
    return [
      simplifyNested ? this.uuid.simplify() : this.uuid,
      this.type,
      this.type === 0 && simplifyNested ? this.master.simplify() : this.master,
      simplifyNested ? this.activation.simplify() : this.activation,
      simplifyNested ? this.lessons.map(a => a.simplify()) : this.lessons,
    ];
  }

  equals(item, ignoreUUID = false) {
    if (!(item instanceof Timetable)) return false;
    if (!ignoreUUID) return this.uuid.equals(item.uuid);

    return this.type === item.type &&
      (this.type === 0 ? this.master.equals(item.master) : this.master === item.master) &&
      this.activation.equals(item.activation) &&
      this.lessons.length === item.lessons.length &&
      !this.lessons.some((lesson, index) => !lesson.equals(item.lessons[index], true));
  }

  toSQL() {
    return {
      uuid: this.uuid.simplify(),
      type: TYPES[this.type],
      master: this.type === 0 ? this.master.simplify() : this.master,
      activation: this.activation.simplify(),
      content: JSON.stringify(this.lessons.map(l => l.toSQL())),
    };
  }
}

module.exports = Timetable;

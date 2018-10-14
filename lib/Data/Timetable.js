const UTIL = require('backend-util').inputValidation;

class Timetable {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = Timetable.validate(data);
    if (error) throw new TypeError(`invalid params provided for "Timetable": "${error}"`);

    this.uuid = data.uuid;
    this.type = data.type;
    this.master = data.master;
    this.activation = data.activation;
    this.lessons = data.lessons;
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
      type: Timetable.TYPES[this.type],
      master: this.type === 0 ? this.master.simplify() : this.master,
      activation: this.activation.simplify(),
      content: JSON.stringify(this.lessons.map(l => l.toSQL())),
    };
  }

  sameMaster(secondTable) {
    if (!(secondTable instanceof Timetable)) return false;
    if (this.type !== secondTable.type) return false;
    return (this.type === 0 ? this.master.simplify() : this.master) ===
      (secondTable.type === 0 ? secondTable.master.simplify() : secondTable.master);
  }
}

Timetable.TYPES = 'class,teacher,room'.split(',');

Timetable.validate = data => {
  if (typeof data !== 'object') return 'data not an object';
  try {
    data.uuid = UTIL.validateUUID(data.uuid);
    data.type = UTIL.validateInStringArray(data.type, Timetable.TYPES, 'type', true);
    if (Timetable.TYPES[data.type] === 'class') data.master = UTIL.validateClass(data.master, 'master');
    else data.master = UTIL.validateString(data.master, 'master');
    data.activation = UTIL.validateTime(data.activation, 'activation');
    data.lessons = UTIL.validateTimetablesLessons(data.content, data.lessons, data.uuid);
  } catch (e) {
    if (e.name !== 'TypeError') throw e;
    return e.message;
  }
  return null;
};

module.exports = Timetable;

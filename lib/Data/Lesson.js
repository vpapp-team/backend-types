const WEEKDAYS = 'monday,tuesday,wednesday,thursday,friday'.split(',');
const REGULARITY = 'always,uneven,even'.split(',');

class Lesson {
  constructor(data, masterUUID) {
    if (Array.isArray(data)) data = this._castObject(data);
    if (masterUUID) data.masterUUID = masterUUID;
    let error = this.validate(data);
    if (error) throw new TypeError(`invalid params provided for "Lesson": "${error}"`);

    const CONST_UUID = process.types.get('General').get('UUID');
    const CONST_LessonDiscrim = process.types.get('General').get('LessonDiscriminator');
    const CONST_ClassDiscrim = process.types.get('General').get('ClassDiscriminator');

    this.masterUUID = data.masterUUID instanceof CONST_UUID ? data.masterUUID : new CONST_UUID(data.masterUUID);
    this.weekday = data.weekday;
    this.lesson = data.lesson instanceof CONST_LessonDiscrim ? data.lesson : new CONST_LessonDiscrim(data.lesson);
    this.room = data.room || null;
    this.teacher = data.teacher;
    this.subject = data.subject;
    this.class = data.class instanceof CONST_ClassDiscrim ? data.class : new CONST_ClassDiscrim(data.class);
    this.length = data.length;
    this.regularity = data.regularity;
  }

  _castObject(data) {
    return {
      masterUUID: data[0],
      weekday: data[1],
      lesson: data[2],
      room: data[3],
      teacher: data[4],
      subject: data[5],
      class: data[6],
      length: data[7],
      regularity: data[8],
    };
  }

  validate(data) {
    if (typeof data !== 'object') return 'data not an object';
    if (typeof data.weekday !== 'number') return 'weekday not a number';
    if (data.weekday < 0 || data.weekday >= WEEKDAYS.length || Math.floor(data.weekday) !== data.weekday) return 'weeekday out of bounds';
    data.room = data.room && data.room.trim ? data.room.trim() : data.room;
    if (typeof data.room !== 'string' && data.room) return 'room not a string nor null';
    data.teacher = data.teacher && data.teacher.trim ? data.teacher.trim() : data.teacher;
    if (!data.teacher || typeof data.teacher !== 'string') return 'teacher not a valid string';
    data.subject = data.subject && data.subject.trim ? data.subject.trim() : data.subject;
    if (!data.subject || typeof data.subject !== 'string') return 'subject not a valid string';
    if (typeof data.length !== 'number') return 'length not a number';
    if (data.length < 0 || Math.floor(data.length) !== data.length) return 'length out of bounds';
    if (typeof data.regularity !== 'number') return 'regularity not a number';
    if (data.regularity < 0 || data.regularity >= REGULARITY.length || Math.floor(data.regularity) !== data.regularity) return 'regularity out of bounds';
    return null;
  }

  simplify(simplifyNested = true) {
    return [
      simplifyNested ? this.masterUUID.simplify() : this.masterUUID,
      this.weekday,
      simplifyNested ? this.lesson.simplify() : this.lesson,
      this.room,
      this.teacher,
      this.subject,
      simplifyNested ? this.class.simplify() : this.class,
      this.length,
      this.regularity,
    ];
  }

  equals(item, ignoreUUID = false) {
    if (!(item instanceof Lesson)) return false;
    if (!ignoreUUID) return this.masterUUID.equals(item.masterUUID);

    return this.weekday === item.weekday &&
      this.lesson.equals(item.lesson) &&
      this.room === item.room &&
      this.teacher === item.teacher &&
      this.subject === item.subject &&
      this.class.equals(item.class) &&
      this.length === item.length &&
      this.regularity === item.regularity;
  }

  toSQL() {
    return [
      null,
      this.weekday,
      this.lesson.simplify(),
      this.room,
      this.teacher,
      this.subject,
      this.class.simplify(),
      this.length,
      this.regularity,
    ];
  }
}

module.exports = Lesson;

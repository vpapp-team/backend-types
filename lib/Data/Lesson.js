const UTIL = require('backend-util').inputValidation;

class Lesson {
  constructor(data, masterUUID) {
    if (Array.isArray(data)) data = this._castObject(data);
    if (masterUUID !== undefined) throw new Error('Lesson#constructor masterUUID depreciated');
    let error = Lesson.validate(data);
    if (error) throw new TypeError(`invalid params provided for "Lesson": "${error}"`);

    this.masterUUID = data.masterUUID;
    this.weekday = data.weekday;
    this.lesson = data.lesson;
    this.room = data.room;
    this.teacher = data.teacher;
    this.subject = data.subject;
    this.class = data.class;
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

  equals(item, ignoreUUID) {
    if (!(item instanceof Lesson)) return false;
    if(ignoreUUID !== undefined) throw new Error('Lesson#equals ignoreUUID depreciated');

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
      this.masterUUID.simplify(),
      // Weekday regularity => stay as int, since we cant use an enum in db
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

Lesson.WEEKDAYS = 'monday,tuesday,wednesday,thursday,friday'.split(',');
Lesson.REGULARITY = 'always,uneven,even'.split(',');

Lesson.validate = data => {
  if (typeof data !== 'object') return 'data not an object';
  try {
    data.masterUUID = UTIL.validateUUID(data.masterUUID, 'masterUUID');
    data.weekday = UTIL.validateInStringArray(data.weekday, 'weekday', Lesson.WEEKDAYS, true);
    data.lesson = UTIL.validateLessonDiscrim(data.lesson);
    data.room = UTIL.validateNullable(data.room, 'room', UTIL.validateString);
    data.teacher = UTIL.validateString(data.teacher, 'teacher');
    data.subject = UTIL.validateString(data.subject, 'subject');
    data.class = UTIL.validateClassDiscrim(data.class);
    data.length = UTIL.validateInteger(data.length, 'length');
    data.regularity = UTIL.validateInStringArray(data.regularity, 'regularity', Lesson.REGULARITY, true);
  } catch (e) {
    if (e.name !== 'TypeError') throw e;
    return e.message;
  }
  return null;
};

module.exports = Lesson;

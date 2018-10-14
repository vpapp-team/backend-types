const UTIL = require('backend-util').inputValidation;

class StandIn {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = StandIn.validate(data);
    if (error) throw new TypeError(`invalid params provided for "StandIn": "${error}"`);

    this.uuid = data.uuid;
    this.type = data.type;
    this.subtype = data.subtype;
    this.day = data.day;
    this.message = data.message;

    if (this.type === 0) {
      this.teacher = data.teacher;
      this.subject = data.subject;
      this.lesson = data.lesson;
      this.class = data.class;
      this.room = data.room;
      this.originalTeacher = data.originalTeacher;
      this.originalSubject = data.originalSubject;
      this.eliminated = data.eliminated;
    }
  }

  _castObject(data) {
    return {
      uuid: data[0],
      type: data[1],
      subtype: data[2],
      day: data[3],
      message: data[4],
      teacher: data[5],
      subject: data[6],
      lesson: data[7],
      class: data[8],
      room: data[9],
      originalTeacher: data[10],
      originalSubject: data[11],
      eliminated: data[12],
    };
  }

  simplify(simplifyNested = true) {
    if (this.type === 1) {
      return [
        simplifyNested ? this.uuid.simplify() : this.uuid,
        this.type,
        this.subtype,
        simplifyNested ? this.day.simplify() : this.day,
        this.message,
      ];
    } else {
      return [
        simplifyNested ? this.uuid.simplify() : this.uuid,
        this.type,
        null,
        simplifyNested ? this.day.simplify() : this.day,
        this.message,
        this.teacher,
        this.subject,
        this.lesson && simplifyNested ? this.lesson.simplify() : this.lesson,
        this.class && simplifyNested ? this.class.simplify() : this.class,
        this.room,
        this.originalTeacher,
        this.originalSubject,
        this.eliminated,
      ];
    }
  }

  equals(item, ignoreUUID = false) {
    if (!(item instanceof StandIn)) return false;
    if (!ignoreUUID) return this.uuid.equals(item.uuid);

    return this.type === item.type &&
      this.subtype === item.subtype &&
      this.day.equals(item.day) &&
      this.message === item.message &&
      this.teacher === item.teacher &&
      this.subject === item.subject &&
      (this.lesson ? this.lesson.equals(item.lesson) : this.lesson === item.lesson) &&
      (this.class ? this.class.equals(item.class) : this.class === item.class) &&
      this.room === item.room &&
      this.originalTeacher === item.originalTeacher &&
      this.originalSubject === item.originalSubject &&
      this.eliminated === item.eliminated;
  }

  toSQL() {
    if (this.type === 1) {
      return {
        uuid: this.uuid.simplify(),
        type: StandIn.TYPES[this.type],
        subtype: StandIn.SUBTYPES[this.subtype],
        day: this.day.simplify(),
        message: this.message,
      };
    } else {
      return {
        uuid: this.uuid.simplify(),
        type: StandIn.TYPES[this.type],
        day: this.day.simplify(),
        message: this.message,
        teacher: this.teacher,
        subject: this.subject,
        lesson: this.lesson ? this.lesson.simplify() : null,
        class: this.class ? this.class.simplify() : null,
        room: this.room,
        originalTeacher: this.originalTeacher,
        originalSubject: this.originalSubject,
        eliminated: this.eliminated,
      };
    }
  }
}

StandIn.TYPES = 'default,motd'.split(',');
StandIn.SUBTYPES = 'other,absentclasses,absentteachers'.split(',');

StandIn.validate = data => {
  if (typeof data !== 'object') return 'data not an object';
  try {
    data.uuid = UTIL.validateUUID(data.uuid);
    data.type = UTIL.validateInStringArray(data.type, 'type', StandIn.TYPES, true);
    data.day = UTIL.validateTime(data.day, 'day');

    if (data.type === 1) {
      data.subtype = UTIL.validateInStringArray(data.subtype, 'type', StandIn.SUBTYPES, true);
      data.message = UTIL.validateString(data.message, 'message');
    } else {
      data.subtype = null;
      data.message = UTIL.validateNullable(data.message, 'message', UTIL.validateString);
      data.teacher = UTIL.validateNullable(data.teacher, 'teacher', UTIL.validateString);
      data.subject = UTIL.validateNullable(data.subject, 'subject', UTIL.validateString);
      data.lesson = UTIL.validateNullable(data.lesson, 'lesson', UTIL.validateLesson);
      data.class = UTIL.validateNullable(data.class, 'class', UTIL.validateClass);
      data.room = UTIL.validateNullable(data.room, 'room', UTIL.validateString);
      data.originalTeacher = UTIL.validateNullable(data.originalTeacher, 'originalTeacher', UTIL.validateString);
      data.originalSubject = UTIL.validateNullable(data.originalSubject, 'originalSubject', UTIL.validateString);
      data.eliminated = UTIL.validateBoolean(data.eliminated, 'eliminated');
    }
  } catch (e) {
    if (e.name !== 'TypeError') throw e;
    return e.message;
  }
  return null;
};

module.exports = StandIn;

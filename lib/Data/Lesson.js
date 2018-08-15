const CONST_UUID = require('../General/UUID');
const CONST_LessonDiscrim = require('../General/LessonDiscriminator');
const CONST_ClassDiscrim = require('../General/ClassDiscriminator');

class Lesson {
  constructor(data, masterUUID) {
    if (Array.isArray(data)) data = this._castObject(data);
    if (masterUUID) data.masterUUID = masterUUID;
    let error = this.validate(data);
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

  validate(data) {
    if (typeof data !== 'object') return 'data not an object';
    try {
      data.masterUUID = Lesson.validateMasterUUID(data.masterUUID);
      data.weekday = Lesson.validateWeekday(data.weekday);
      data.lesson = Lesson.validateLesson(data.lesson);
      data.room = Lesson.validateRoom(data.room);
      data.teacher = Lesson.validateTeacher(data.teacher);
      data.subject = Lesson.validateSubject(data.subject);
      data.class = Lesson.validateClass(data.class);
      data.length = Lesson.validateLength(data.length);
      data.regularity = Lesson.validateRegularity(data.regularity);
    } catch (e) {
      return e.message;
    }
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
Lesson.validateMasterUUID = dataMasterUUID => {
  if (dataMasterUUID instanceof CONST_UUID) return dataMasterUUID;
  try {
    return new CONST_UUID(dataMasterUUID);
  } catch (e) {
    throw new TypeError(`masterUUID invalid: ${e.message}`);
  }
};
Lesson.validateWeekday = dataWeekday => {
  if (typeof dataWeekday !== 'number') throw new TypeError('weekday not a number');
  if (dataWeekday < 0 || dataWeekday >= Lesson.WEEKDAYS.length || Math.floor(dataWeekday) !== dataWeekday) {
    throw new TypeError('weeekday out of bounds');
  }
  return dataWeekday;
};
Lesson.validateLesson = dataLesson => {
  if (dataLesson instanceof CONST_LessonDiscrim) return dataLesson;
  try {
    return new CONST_LessonDiscrim(dataLesson);
  } catch (e) {
    throw new TypeError(`lesson invalid: ${e.message}`);
  }
};
Lesson.validateRoom = dataRoom => {
  if (typeof dataRoom === 'string') dataRoom = dataRoom.trim();
  if (typeof dataRoom !== 'string' && dataRoom) return 'room not a string nor null';
  return dataRoom || null;
};
Lesson.validateTeacher = dataTeacher => {
  if (typeof dataTeacher === 'string') dataTeacher = dataTeacher.trim();
  if (!dataTeacher || typeof dataTeacher !== 'string') throw new TypeError('teacher not a valid string');
  return dataTeacher;
};
Lesson.validateSubject = dataSubject => {
  if (typeof dataSubject === 'string') dataSubject = dataSubject.trim();
  if (!dataSubject || typeof dataSubject !== 'string') throw new TypeError('subject not a valid string');
  return dataSubject;
};
Lesson.validateClass = dataClass => {
  if (dataClass instanceof CONST_ClassDiscrim) return dataClass;
  try {
    return new CONST_ClassDiscrim(dataClass);
  } catch (e) {
    throw new TypeError(`class invalid: ${e.message}`);
  }
};
Lesson.validateLength = dataLength => {
  if (typeof dataLength !== 'number') throw new TypeError('length not a number');
  if (dataLength < 0 || Math.floor(dataLength) !== dataLength) throw new TypeError('length out of bounds');
  return dataLength;
};
Lesson.validateRegularity = dataRegularity => {
  if (typeof dataRegularity !== 'number') throw new TypeError('regularity not a number');
  if (dataRegularity < 0 ||
    dataRegularity >= Lesson.REGULARITY.length ||
    Math.floor(dataRegularity) !== dataRegularity) {
    throw new TypeError('regularity out of bounds');
  }
  return dataRegularity;
};

Lesson.WEEKDAYS = 'monday,tuesday,wednesday,thursday,friday'.split(',');
Lesson.REGULARITY = 'always,uneven,even'.split(',');
module.exports = Lesson;

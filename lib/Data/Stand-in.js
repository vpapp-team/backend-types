const TYPES = 'default,motd'.split(',');
const SUBTYPES = 'other,absentclasses,absentteachers'.split(',');

class StandIn {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = this.validate(data);
    if (error) throw new TypeError(`invalid params provided for "StandIn": "${error}"`);

    const CONST_UUID = process.types.get('General').get('UUID');
    const CONST_Time = process.types.get('General').get('Time');
    const CONST_LessonDiscrim = process.types.get('General').get('LessonDiscriminator');
    const CONST_ClassDiscrim = process.types.get('General').get('ClassDiscriminator');

    this.uuid = data.uuid instanceof CONST_UUID ? data.uuid : new CONST_UUID(data.uuid);
    this.type = data.type;
    this.subtype = this.type === 1 ? data.subtype : null;
    this.day = data.day instanceof CONST_Time ? data.day : new CONST_Time(data.day);
    this.message = this.type === 1 || data.message ? data.message : null;

    this.teacher = this.subject = this.lesson = this.class = this.room = this.originalTeacher = this.originalSubject = this.eliminated = null; // eslint-disable-line max-len
    if (this.type === 0) {
      if (data.teacher) this.teacher = data.teacher;
      if (data.subject) this.subject = data.subject;
      if (data.lesson instanceof CONST_LessonDiscrim) this.lesson = data.lesson;
      else this.lesson = new CONST_LessonDiscrim(data.lesson);
      if (data.class instanceof CONST_ClassDiscrim) this.class = data.class;
      else this.class = new CONST_ClassDiscrim(data.class);
      if (data.room) this.room = data.room;
      if (data.originalTeacher) this.originalTeacher = data.originalTeacher;
      if (data.originalSubject) this.originalSubject = data.originalSubject;
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

  validate(data) {
    if (typeof data !== 'object') return 'data not an object';
    if (typeof data.type === 'string') data.type = TYPES.indexOf(data.type.toLowerCase());
    if (typeof data.type !== 'number') return 'type not a number';
    if (data.type < 0 || data.type >= TYPES.length || Math.floor(data.type) !== data.type) return 'type out of bounds';

    if (data.type === 1) {
      if (typeof data.subtype === 'string') data.subtype = SUBTYPES.indexOf(data.subtype.toLowerCase());
      if (typeof data.subtype !== 'number') return 'subtype not a number';
      if (data.subtype < 0 || data.subtype >= SUBTYPES.length || Math.floor(data.subtype) !== data.subtype) return 'subtype out of bounds';
      data.message = data.message && data.message.trim ? data.message.trim() : data.message;
      if (!data.message || typeof data.message !== 'string') return 'message not a valid string';
    } else {
      data.message = data.message && data.message.trim ? data.message.trim() : data.message;
      if (typeof data.message !== 'string' && data.message) return 'message not a string nor null';
      data.teacher = data.teacher && data.teacher.trim ? data.teacher.trim() : data.teacher;
      if (typeof data.teacher !== 'string' && data.teacher) return 'teacher not a string nor null';
      data.subject = data.subject && data.subject.trim ? data.subject.trim() : data.subject;
      if (typeof data.subject !== 'string' && data.subject) return 'subject not a string nor null';
      data.room = data.room && data.room.trim ? data.room.trim() : data.room;
      if (typeof data.room !== 'string' && data.room) return 'room not a string nor null';
      data.originalTeacher = data.originalTeacher && data.originalTeacher.trim ? data.originalTeacher.trim() : data.originalTeacher;
      if (typeof data.originalTeacher !== 'string' && data.originalTeacher) return 'originalTeacher not a string nor null';
      data.originalSubject = data.originalSubject && data.originalSubject.trim ? data.originalSubject.trim() : data.originalSubject;
      if (typeof data.originalSubject !== 'string' && data.originalSubject) return 'originalSubject not a string nor null';
      if (typeof data.eliminated === 'number') data.eliminated = data.eliminated === 1;
      if (typeof data.eliminated !== 'boolean') return 'eliminated not a boolean';
    }
    return null;
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
      (this.type === 0 ? this.lesson ? this.lesson.equals(item.lesson) : this.lesson === item.lesson : true) &&
      (this.type === 0 ? this.class ? this.class.equals(item.class) : this.class === item.class : true) &&
      this.room === item.room &&
      this.originalTeacher === item.originalTeacher &&
      this.originalSubject === item.originalSubject &&
      this.eliminated === item.eliminated;
  }

  toSQL() {
    if (this.type === 1) {
      return {
        uuid: this.uuid.simplify(),
        type: TYPES[this.type],
        subtype: SUBTYPES[this.subtype],
        day: this.day.simplify(),
        message: this.message,
      };
    } else {
      return {
        uuid: this.uuid.simplify(),
        type: TYPES[this.type],
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

module.exports = StandIn;

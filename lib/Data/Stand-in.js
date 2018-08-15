const CONST_UUID = require('../General/UUID');
const CONST_Time = require('../General/Time');
const CONST_LessonDiscrim = require('../General/LessonDiscriminator');
const CONST_ClassDiscrim = require('../General/ClassDiscriminator');

class StandIn {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = this.validate(data);
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

  validate(data) {
    if (typeof data !== 'object') return 'data not an object';
    try {
      data.uuid = StandIn.validateUUID(data.uuid);
      data.type = StandIn.validateType(data.type);
      data.day = StandIn.validateDay(data.day);
      data.message = StandIn.validateMessage(data.type, data.message);

      if (data.type === 1) {
        data.subtype = StandIn.validateSubtype(data.subtype);
      } else {
        data.subtype = null;
        data.teacher = StandIn.validateTeacher(data.teacher);
        data.subject = StandIn.validateSubject(data.subject);
        data.lesson = StandIn.validateLesson(data.lesson);
        data.class = StandIn.validateClass(data.class);
        data.room = StandIn.validateRoom(data.room);
        data.originalTeacher = StandIn.validateOriginalTeacher(data.originalTeacher);
        data.originalSubject = StandIn.validateOriginalSubject(data.originalSubject);
        data.eliminated = StandIn.validateEliminated(data.eliminated);
      }
    } catch (e) {
      return e.message;
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
      // TODO: check wether the outside inline if is needed
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
StandIn.validateUUID = dataUUID => {
  if (dataUUID instanceof CONST_UUID) return dataUUID;
  try {
    return new CONST_UUID(dataUUID);
  } catch (e) {
    throw new TypeError(`uuid invalid: ${e.message}`);
  }
};
StandIn.validateType = dataType => {
  if (typeof dataType === 'string') dataType = StandIn.TYPES.indexOf(dataType.trim().toLowerCase());
  if (typeof dataType !== 'number') throw new TypeError('type not a number');
  if (dataType < 0 || dataType >= StandIn.TYPES.length || Math.floor(dataType) !== dataType) {
    throw new TypeError('type out of bounds');
  }
  return dataType;
};
StandIn.validateSubtype = dataSubtype => {
  if (typeof dataSubtype === 'string') dataSubtype = StandIn.SUBTYPES.indexOf(dataSubtype.trim().toLowerCase());
  if (typeof dataSubtype !== 'number') throw new TypeError('subtype not a number');
  if (dataSubtype < 0 || dataSubtype >= StandIn.SUBTYPES.length || Math.floor(dataSubtype) !== dataSubtype) {
    throw new TypeError('subtype out of bounds');
  }
  return dataSubtype;
};
StandIn.validateDay = dataDay => {
  if (dataDay instanceof CONST_Time) return dataDay;
  try {
    return new CONST_Time(dataDay);
  } catch (e) {
    throw new TypeError(`day invalid: ${e.message}`);
  }
};
StandIn.validateMessage = (dataType, dataMessage) => {
  if (typeof dataMessage === 'string') dataMessage = dataMessage.trim();
  if (dataMessage) return dataMessage;
  if (dataType === 0) return null;
  else throw new TypeError('message not a valid string');
};
StandIn.validateTeacher = dataTeacher => {
  if (typeof dataTeacher === 'string') dataTeacher = dataTeacher.trim();
  if (typeof dataTeacher !== 'string' && dataTeacher) throw new TypeError('teacher not a string nor null');
  return dataTeacher || null;
};
StandIn.validateSubject = dataSubject => {
  if (typeof dataSubject === 'string') dataSubject = dataSubject.trim();
  if (typeof dataSubject !== 'string' && dataSubject) throw new TypeError('subject not a string nor null');
  return dataSubject || null;
};
StandIn.validateLesson = dataLesson => {
  if (!dataLesson) return null;
  if (dataLesson instanceof CONST_LessonDiscrim) return dataLesson;
  try {
    return new CONST_LessonDiscrim(dataLesson);
  } catch (e) {
    throw new TypeError(`lesson invalid: ${e.message}`);
  }
};
StandIn.validateClass = dataClass => {
  if (!dataClass) return null;
  if (dataClass instanceof CONST_ClassDiscrim) return dataClass;
  try {
    return new CONST_ClassDiscrim(dataClass);
  } catch (e) {
    throw new TypeError(`class invalid: ${e.message}`);
  }
};
StandIn.validateRoom = dataRoom => {
  if (typeof dataRoom === 'string') dataRoom = dataRoom.trim();
  if (typeof dataRoom !== 'string' && dataRoom) throw new TypeError('room not a string nor null');
  return dataRoom || null;
};
StandIn.validateOriginalTeacher = dataOriginalTeacher => {
  if (typeof dataOriginalTeacher === 'string') dataOriginalTeacher = dataOriginalTeacher.trim();
  if (typeof dataOriginalTeacher !== 'string' && dataOriginalTeacher) {
    throw new TypeError('originalTeacher not a string nor null');
  }
  return dataOriginalTeacher || null;
};
StandIn.validateOriginalSubject = dataOriginalSubject => {
  if (typeof dataOriginalSubject === 'string') dataOriginalSubject = dataOriginalSubject.trim();
  if (typeof dataOriginalSubject !== 'string' && dataOriginalSubject) {
    throw new TypeError('originalSubject not a string nor null');
  }
  return dataOriginalSubject || null;
};
StandIn.validateEliminated = dataEliminated => {
  if (typeof dataEliminated === 'number') dataEliminated = dataEliminated === 1;
  if (typeof dataEliminated !== 'boolean') throw new TypeError('eliminated not a boolean');
  return dataEliminated;
};

StandIn.TYPES = 'default,motd'.split(',');
StandIn.SUBTYPES = 'other,absentclasses,absentteachers'.split(',');
module.exports = StandIn;

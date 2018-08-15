const CONST_UUID = require('../General/UUID');
const CONST_ClassDiscrim = require('../General/ClassDiscriminator');
const CONST_Time = require('../General/Time');
const CONST_Lesson = require('../Data/Lesson');

class Timetable {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = this.validate(data);
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

  validate(data) {
    if (typeof data !== 'object') return 'data not an object';
    try {
      data.uuid = Timetable.validateUUID(data.uuid);
      data.type = Timetable.validateType(data.type);
      data.master = Timetable.validateMaster(data.master);
      data.activation = Timetable.validateActivation(data.activation);
      data.lessons = Timetable.validateLessons(data.content, data.lessons, data.uuid);
    } catch (e) {
      return e.message;
    }
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
      type: Timetable.TYPES[this.type],
      master: this.type === 0 ? this.master.simplify() : this.master,
      activation: this.activation.simplify(),
      content: JSON.stringify(this.lessons.map(l => l.toSQL())),
    };
  }
}
Timetable.validateUUID = dataUUID => {
  if (dataUUID instanceof CONST_UUID) return dataUUID;
  try {
    return new CONST_UUID(dataUUID);
  } catch (e) {
    throw new TypeError(`uuid invalid: ${e.message}`);
  }
};
Timetable.validateType = dataType => {
  if (typeof dataType === 'string') dataType = Timetable.TYPES.indexOf(dataType.toLowerCase().trim());
  if (typeof dataType !== 'number') throw new TypeError('type not a number nor string');
  if (dataType < 0 || dataType >= Timetable.TYPES.length || Math.floor(dataType) !== dataType) {
    throw new TypeError('type out of range');
  }
  return dataType;
};
Timetable.validateMaster = (dataType, dataMaster) => {
  if (dataType === 1 || dataType === 2) {
    if (typeof dataMaster === 'string') dataMaster = dataMaster.trim();
    if (!dataMaster || typeof dataMaster !== 'string') {
      throw new TypeError(`master not a valid string with type ${Timetable.TYPES[dataType]}`);
    }
    return dataMaster;
  } else {
    if (dataMaster instanceof CONST_ClassDiscrim) return dataMaster;
    try {
      return new CONST_ClassDiscrim(dataMaster);
    } catch (e) {
      throw new TypeError(`master with type ${Timetable.TYPES[dataType]} invalid: ${e.message}`);
    }
  }
};
Timetable.validateActivation = dataActivation => {
  if (dataActivation instanceof CONST_Time) return dataActivation;
  try {
    return new CONST_Time(dataActivation);
  } catch (e) {
    throw new TypeError(`activation invalid: ${e.message}`);
  }
};
Timetable.validateLessons = (dataContent, dataLessons, dataUUID) => {
  console.log(dataContent, dataLessons, dataUUID);
  // TODO: remove following comment
  // from web parser?
  if (dataLessons) throw new Error('!!Timetable with lessons');
  // TODO: remove following comment
  // from db?
  if (dataContent) throw new Error('!!Timetable with content');
  // TODO: remove following comment
  // what is the dataUUID?
  if (dataUUID) throw new Error('!!Timetable with UUID');

  if (dataContent && typeof dataContent === 'string') {
    try {
      dataLessons = JSON.parse(dataContent);
    } catch (e) {
      throw new TypeError(`content invalid: ${e.message}`);
    }
  }
  if (!Array.isArray(dataLessons)) throw new TypeError('lessons not an array');
  return dataLessons.map(a =>
    // TODO: remove following comments
    // TODO: clearify whether:
    // dataUUID wenn als dataLessons,
    // masterUUID oder dataUUID wenn dataContent
    a instanceof CONST_Lesson ? a : new CONST_Lesson(a, a.masterUUID || dataUUID)
  );
};

Timetable.TYPES = 'class,teacher,room'.split(',');
module.exports = Timetable;

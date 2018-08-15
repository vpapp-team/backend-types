const CONST_UUID = require('../General/UUID');
const CONST_Timetable = require('../Data/Timetable');

class Teacher {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = this.validate(data);
    if (error) throw new TypeError(`invalid params provided for "Teacher": "${error}"`);

    this.uuid = data.uuid;
    this.leftSchool = data.leftSchool;
    this.shorthand = data.shorthand;
    this.name = data.name;
    this.subjects = data.subjects;
    this.email = data.email;
    this.comments = data.comments;
    this.timetable = data.timetable;
  }

  _castObject(data) {
    return {
      uuid: data[0],
      leftSchool: data[1],
      shorthand: data[2],
      name: data[3],
      subjects: data[4],
      email: data[5],
      comments: data[6],
      timetable: data[7],
    };
  }

  validate(data) {
    if (typeof data !== 'object') return 'data not an object';
    try {
      data.leftSchool = Teacher.validateLeftSchool(data.leftSchool);
      data.shorthand = Teacher.validateShorthand(data.shorthand);
      data.name = Teacher.validateName(data.name);
      data.subjects = Teacher.validateSubjects(data.subjects);
      data.comments = Teacher.validateComments(data.comments);
      data.uuid = Teacher.validateUUID(data.uuid);
      data.email = Teacher.validateEmail(data.email);
      data.timetable = Teacher.validateTimetable(data.timetable);
    } catch (e) {
      return e.message;
    }
    return null;
  }

  simplify(simplifyNested = true) {
    return [
      simplifyNested ? this.uuid.simplify() : this.uuid,
      this.leftSchool,
      this.shorthand,
      this.name,
      this.subjects,
      simplifyNested ? this.email.simplify() : this.email,
      this.comments,
      this.timetable && simplifyNested ? this.timetable.map(a => a.simplify()) : this.timetable,
    ];
  }

  toSQL() {
    return {
      uuid: this.uuid.simplify(),
      leftSchool: this.leftSchool,
      shorthand: this.shorthand,
      name: this.name,
      subjects: this.subjects.join(','),
      email: this.email.simplify(),
      comments: this.comments.join(','),
    };
  }
}
Teacher.validateLeftSchool = dataLeftSchool => {
  if (typeof dataLeftSchool === 'number') dataLeftSchool = dataLeftSchool === 1;
  if (typeof dataLeftSchool !== 'boolean') throw new TypeError('leftSchool not a boolean nor number');
  return dataLeftSchool;
};
Teacher.validateShorthand = dataShorthand => {
  if (typeof dataShorthand === 'string') dataShorthand = dataShorthand.trim();
  if (!dataShorthand || typeof dataShorthand !== 'string') throw new TypeError('shorthand not a valid string');
  return dataShorthand;
};
Teacher.validateName = dataName => {
  if (typeof dataName === 'string') dataName = dataName.trim();
  if (!dataName || typeof dataName !== 'string') throw new TypeError('name not a valid string');
  return dataName;
};
Teacher.validateSubjects = dataSubjects => {
  if (typeof dataSubjects === 'string') dataSubjects = dataSubjects.split(',');
  if (!Array.isArray(dataSubjects)) throw new TypeError('subjects not an array nor string list');
  dataSubjects = dataSubjects && dataSubjects.map(s => typeof s === 'string' ? s.trim() : s);
  if (dataSubjects.some(i => !i || typeof i !== 'string')) throw new TypeError('some subject is not a valid string');
  return dataSubjects;
};
Teacher.validateComments = dataComments => {
  if (typeof dataComments === 'string') dataComments = dataComments.split(',');
  if (!dataComments) return [];
  if (!Array.isArray(dataComments)) throw new TypeError('comments not an array nor string list nor null');
  dataComments = dataComments.map(s => typeof s === 'string' ? s.trim() : s);
  if (dataComments.some(i => !i || typeof i !== 'string')) throw new TypeError('some comment is not a valid string');
  return dataComments;
};
Teacher.validateUUID = dataUUID => {
  if (dataUUID instanceof CONST_UUID) return dataUUID;
  try {
    return new CONST_UUID(dataUUID);
  } catch (e) {
    throw new TypeError(`uuid invalid: ${e.message}`);
  }
};
Teacher.validateEmail = dataEmail => {
  if (dataEmail instanceof CONST_UUID) return dataEmail;
  try {
    return new CONST_UUID(dataEmail);
  } catch (e) {
    throw new TypeError(`email invalid: ${e.message}`);
  }
};
Teacher.validateTimetable = dataTimetable => {
  if (!dataTimetable) return null;
  try {
    return dataTimetable.map(d => d instanceof CONST_Timetable ? d : new CONST_Timetable(d));
  } catch (e) {
    throw new TypeError(`timetable invalid: ${e.message}`);
  }
};

module.exports = Teacher;

const UTIL = require('backend-util').inputValidation;

class Teacher {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = Teacher.validate(data);
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

Teacher.validate = data => {
  if (typeof data !== 'object') return 'data not an object';
  try {
    data.leftSchool = UTIL.validateBoolean(data.leftSchool, 'leftSchool');
    data.shorthand = UTIL.validateString(data.shorthand, 'shorthand');
    data.name = UTIL.validateString(data.name, 'name');

    data.subjects = UTIL.validateArray(data.subjects, 'subjects', UTIL.validateString);
    data.comments = UTIL.validateArray(data.comments, 'comments', UTIL.validateString, true);

    data.uuid = UTIL.validateUUID(data.uuid);
    data.email = UTIL.validateUUID(data.email, 'email');
    data.timetable = UTIL.validateOptionalArray(data.timetable, 'timetable', UTIL.validateTimetable);
  } catch (e) {
    if (e.name !== 'TypeError') throw e;
    return e.message;
  }
  return null;
};

module.exports = Teacher;

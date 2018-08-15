class Teacher {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = this.validate(data);
    if (error) throw new TypeError(`invalid params provided for "Teacher": "${error}"`);

    const CONST_UUID = process.types.get('General').get('UUID');
    const CONST_Timetable = process.types.get('Data').get('Timetable');

    this.uuid = data.uuid instanceof CONST_UUID ? data.uuid : new CONST_UUID(data.uuid);
    this.leftSchool = data.leftSchool;
    this.shorthand = data.shorthand;
    this.name = data.name;
    this.subjects = data.subjects;
    this.email = data.email instanceof CONST_UUID ? data.email : new CONST_UUID(data.email);
    this.comments = data.comments || [];
    this.timetable = null;
    if (data.timetable) {
      this.timetable = data.timetable
        .map(d => d instanceof CONST_Timetable ? d : new CONST_Timetable(d));
    }
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
  if (typeof dataLeftSchool !== 'boolean') throw new TypeError('leftSchool not a boolean');
  return dataLeftSchool;
};
Teacher.validateShorthand = dataShorthand => {
  dataShorthand = typeof dataShorthand === 'string' ? dataShorthand.trim() : dataShorthand;
  if (!dataShorthand || typeof dataShorthand !== 'string') throw new TypeError('shorthand not a valid string');
  return dataShorthand;
};
Teacher.validateName = dataName => {
  dataName = typeof dataName === 'string' ? dataName.trim() : dataName;
  if (!dataName || typeof dataName !== 'string') throw new TypeError('name not a valid string');
  return dataName;
};
Teacher.validateSubjects = dataSubjects => {
  if (typeof dataSubjects === 'string') dataSubjects = dataSubjects.split(',');
  if (!Array.isArray(dataSubjects)) throw new TypeError('subjects not an array');
  dataSubjects = dataSubjects && dataSubjects.map(s => typeof s === 'string' ? s.trim() : s);
  if (dataSubjects.some(i => !i || typeof i !== 'string')) throw new TypeError('some subject is not a valid string');
  return dataSubjects.join(',');
};
Teacher.validateComments = dataComments => {
  if (typeof dataComments === 'string') dataComments = dataComments.split(',');
  if (!dataComments) return null;
  if (!Array.isArray(dataComments)) throw new TypeError('comments not an array');
  dataComments = dataComments.map(s => typeof s === 'string' ? s.trim() : s);
  if (dataComments.some(i => !i || typeof i !== 'string')) throw new TypeError('some comment is not a valid string');
  return dataComments;
};

module.exports = Teacher;

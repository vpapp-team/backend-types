class Room {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = this.validate(data);
    if (error) throw new TypeError(`invalid params provided for "Room": "${error}"`);

    const CONST_UUID = process.types.get('General').get('UUID');
    const CONST_Timetable = process.types.get('Data').get('Timetable');

    this.uuid = data.uuid instanceof CONST_UUID ? data.uuid : new CONST_UUID(data.uuid);
    this.name = data.name;
    this.location = data.location;
    this.x_cord = data.x_cord;
    this.y_cord = data.y_cord;
    this.height = data.height;
    this.width = data.width;
    this.timetable = null;
    if (data.timetable) {
      this.timetable = data.timetable
        .map(d => d instanceof CONST_Timetable ? d : new CONST_Timetable(d));
    }
  }

  _castObject(data) {
    return {
      uuid: data[0],
      name: data[1],
      location: data[2],
      x_cord: data[3],
      y_cord: data[4],
      height: data[5],
      width: data[6],
      timetable: data[7],
    };
  }

  validate(data) {
    if (typeof data !== 'object') return 'data not an object';
    data.name = data.name && data.name.trim ? data.name.trim() : data.name;
    if (!data.name || typeof data.name !== 'string') return 'name not a valid string';
    data.location = data.location && data.location.trim ? data.location.trim() : data.location;
    if (!data.location || typeof data.location !== 'string') return 'location not a valid string';
    if (typeof data.x_cord !== 'number') return 'x_cord not a number';
    if (typeof data.y_cord !== 'number') return 'y_cord not a number';
    if (typeof data.height !== 'number') return 'height not a number';
    if (typeof data.width !== 'number') return 'width not a number';
    if (!Array.isArray(data.timetable) && data.timetable) return 'timetable not an array nor null';
    return null;
  }

  simplify(simplifyNested = true) {
    return [
      simplifyNested ? this.uuid.simplify() : this.uuid,
      this.name,
      this.location,
      this.x_cord,
      this.y_cord,
      this.height,
      this.width,
      this.timetable && simplifyNested ? this.timetable.map(a => a.simplify()) : this.timetable,
    ];
  }
}

module.exports = Room;

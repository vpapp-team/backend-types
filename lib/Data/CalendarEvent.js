class CalendarEvent {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = this.validate(data);
    if (error) throw new TypeError(`invalid params provided for "CalendarEvent": "${error}"`);

    const CONST_UUID = process.types.get('General').get('UUID');
    const CONST_Time = process.types.get('General').get('Time');

    this.masterUUID = data.masterUUID;
    this.uuid = data.uuid instanceof CONST_UUID ? data.uuid : new CONST_UUID(data.uuid);
    this.start = data.start instanceof CONST_Time ? data.start : new CONST_Time(data.start);
    this.end = data.end instanceof CONST_Time ? data.end : new CONST_Time(data.end);
    this.summary = data.summary;
    this.description = data.description || null;
    this.location = data.location || null;
    this.isRecurring = data.isRecurring;
    this.humanRecurrence = data.isRecurring ? data.humanRecurrence : null;
    this._recurrenceRule = data.isRecurring ? data._recurrenceRule : null;
    this._noMore = data.isRecurring ? data._noMore : null;
  }

  _castObject(data) {
    return {
      masterUUID: data[0],
      uuid: data[1],
      start: data[2],
      end: data[3],
      summary: data[4],
      description: data[5],
      location: data[6],
      isRecurring: data[7],
      humanRecurrence: data[8],
    };
  }

  validate(data) {
    if (typeof data !== 'object') return 'data not an object';
    if (!data.masterUUID || typeof data.masterUUID !== 'string') return 'masterUUID not a string';
    data.summary = data.summary && data.summary.trim ? data.summary.trim() : data.summary;
    if (!data.summary || typeof data.summary !== 'string') return 'summary not a valid string';
    data.description = data.description && data.description.trim ? data.description.trim() : data.description;
    if (typeof data.description !== 'string' && data.description) return 'description not a string nor null';
    data.location = data.location && data.location.trim ? data.location.trim() : data.location;
    if (typeof data.location !== 'string' && data.location) return 'location not a string nor null';
    if (typeof data.isRecurring === 'number') data.isRecurring = data.isRecurring === 1;
    if (typeof data.isRecurring !== 'boolean') return 'isRecurring not a boolean';
    if (data.isRecurring) {
      data.humanRecurrence = data.humanRecurrence && data.humanRecurrence.trim ? data.humanRecurrence.trim() : data.humanRecurrence;
      if (!data.humanRecurrence || typeof data.humanRecurrence !== 'string') return 'humanRecurrence not a valid string';
      if (!data._recurrenceRule || typeof data._recurrenceRule !== 'string') return '_recurrenceRule not a valid string';
      if (typeof data._noMore === 'number') data._noMore = data._noMore === 1;
      if (typeof data._noMore !== 'boolean') return 'humanRecurrence not a boolean';
    }
    return null;
  }

  simplify(simplifyNested = true) {
    return [
      simplifyNested ? this.uuid.simplify() : this.uuid,
      simplifyNested ? this.start.simplify() : this.start,
      simplifyNested ? this.end.simplify() : this.end,
      this.summary,
      this.description,
      this.location,
      this.isRecurring,
      this.humanRecurrence,
    ];
  }

  equals(item, ignoreUUID = false) {
    if (!(item instanceof CalendarEvent)) return false;
    if (!ignoreUUID) return this.uuid.equals(item.uuid);

    return this.masterUUID === item.masterUUID &&
      this.start.equals(item.start) &&
      this.end.equals(item.end) &&
      this.summary === item.summary &&
      this.description === item.description &&
      this.location === item.location &&
      this.isRecurring === item.isRecurring &&
      this.humanRecurrence === item.humanRecurrence &&
      this._recurrenceRule === item._recurrenceRule &&
      this._noMore === item._noMore;
  }

  toSQL() {
    return {
      masterUUID: this.masterUUID,
      uuid: this.uuid.simplify(),
      start: this.start.simplify(),
      end: this.end.simplify(),
      summary: this.summary,
      description: this.description,
      location: this.location,
      isRecurring: this.isRecurring,
      humanRecurrence: this.humanRecurrence,
      _recurrenceRule: this._recurrenceRule,
      _noMore: this._noMore,
    };
  }
}

module.exports = CalendarEvent;

const UTIL = require('backend-util').inputValidation;

class CalendarEvent {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = CalendarEvent.validate(data);
    if (error) throw new TypeError(`invalid params provided for "CalendarEvent": "${error}"`);

    this._masterUUID = data._masterUUID;
    this.uuid = data.uuid;
    this.start = data.start;
    this.end = data.end;
    this.summary = data.summary;
    this.description = data.description;
    this.location = data.location;
    this.isRecurring = data.isRecurring;
    this.humanRecurrence = data.humanRecurrence;
    this._recurrenceRule = data._recurrenceRule;
    this._noMore = data._noMore;
  }

  _castObject(data) {
    return {
      _masterUUID: data[0],
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

    return this._masterUUID === item._masterUUID &&
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
      _masterUUID: this._masterUUID,
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

CalendarEvent.validate = data => {
  if (typeof data !== 'object') return 'data not an object';
  try {
    data._masterUUID = UTIL.validateString(data._masterUUID, '_masterUUID');
    data.uuid = UTIL.validateUUID(data.uuid);
    data.start = UTIL.validateTime(data.start, 'start');
    data.end = UTIL.validateTime(data.end, 'end');
    data.summary = UTIL.validateString(data.summary, 'summary');
    data.description = UTIL.validateNullable(data.description, 'description', UTIL.validateString);
    data.location = UTIL.validateNullable(data.location, 'location', UTIL.validateString);
    data.isRecurring = UTIL.validateBoolean(data.isRecurring, 'isRecurring');

    if (data.isRecurring) {
      data.humanRecurrence = UTIL.validateString(data.humanRecurrence, 'humanRecurrence');
      data._recurrenceRule = UTIL.validateString(data._recurrenceRule, '_recurrenceRule');
      data._noMore = UTIL.validateBoolean(data._noMore, '_noMore');
    } else { data._recurrenceRule = data._noMore = data.humanRecurrence = null; }
  } catch (e) {
    if (e.name !== 'TypeError') throw e;
    return e.message;
  }
  return null;
};

module.exports = CalendarEvent;

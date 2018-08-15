const CONST_UUID = require('../General/UUID');
const CONST_Time = require('../General/Time');

class CalendarEvent {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = this.validate(data);
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

  validate(data) {
    if (typeof data !== 'object') return 'data not an object';
    try {
      data._masterUUID = CalendarEvent.validateMasterUUID(data._masterUUID);
      data.uuid = CalendarEvent.validateUUID(data.uuid);
      data.start = CalendarEvent.validateStart(data.start);
      data.end = CalendarEvent.validateEnd(data.end);
      data.summary = CalendarEvent.validateSummary(data.summary);
      data.description = CalendarEvent.validateDescription(data.description);
      data.location = CalendarEvent.validateLocation(data.location);
      data.isRecurring = CalendarEvent.validateIsRecurring(data.isRecurring);
      data.humanRecurrence = CalendarEvent.validateHumanRecurrence(data.isRecurring, data.humanRecurrence);
      data._recurrenceRule = CalendarEvent.validate_recurrenceRule(data.isRecurring, data._recurrenceRule);
      data._noMore = CalendarEvent.validate_noMore(data.isRecurring, data._noMore);
    } catch (e) {
      return e.message;
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
CalendarEvent.validateMasterUUID = dataMasterUUID => {
  if (typeof dataMasterUUID === 'string') dataMasterUUID = dataMasterUUID.trim();
  if (!dataMasterUUID || typeof dataMasterUUID !== 'string') throw new TypeError('_masterUUID not a valid string');
  return dataMasterUUID;
};
CalendarEvent.validateUUID = dataUUID => {
  if (dataUUID instanceof CONST_UUID) return dataUUID;
  try {
    return new CONST_UUID(dataUUID);
  } catch (e) {
    throw new TypeError(`uuid invalid: ${e.message}`);
  }
};
CalendarEvent.validateStart = dataStart => {
  if (dataStart instanceof CONST_Time) return dataStart;
  try {
    return new CONST_Time(dataStart);
  } catch (e) {
    throw new TypeError(`start invalid: ${e.message}`);
  }
};
CalendarEvent.validateEnd = dataEnd => {
  if (dataEnd instanceof CONST_Time) return dataEnd;
  try {
    return new CONST_Time(dataEnd);
  } catch (e) {
    throw new TypeError(`end invalid: ${e.message}`);
  }
};
CalendarEvent.validateSummary = dataSummary => {
  if (typeof dataSummary === 'string') dataSummary = dataSummary.trim();
  if (!dataSummary || typeof dataSummary !== 'string') throw new TypeError('summary not a valid string');
  return dataSummary;
};
CalendarEvent.validateDescription = dataDescription => {
  if (typeof dataDescription === 'string') dataDescription = dataDescription.trim();
  if (typeof dataDescription !== 'string' && dataDescription) throw new TypeError('description not a string nor null');
  return dataDescription || null;
};
CalendarEvent.validateLocation = dataLocation => {
  if (typeof dataLocation === 'string') dataLocation = dataLocation.trim();
  if (typeof dataLocation !== 'string' && dataLocation) throw new TypeError('location not a string nor null');
  return dataLocation || null;
};
CalendarEvent.validateIsRecurring = dataIsRecurring => {
  if (typeof dataIsRecurring === 'number') dataIsRecurring = dataIsRecurring === 1;
  if (typeof dataIsRecurring !== 'boolean') throw new TypeError('isRecurring not a boolean');
  return dataIsRecurring;
};
CalendarEvent.validateHumanRecurrence = (dataIsRecurring, dataHumanRecurrence) => {
  if (!dataIsRecurring) return null;
  if (typeof dataHumanRecurrence === 'string') dataHumanRecurrence = dataHumanRecurrence.trim();
  if (!dataHumanRecurrence || typeof dataHumanRecurrence !== 'string') {
    throw new TypeError('humanRecurrence not a valid string');
  }
  return dataHumanRecurrence;
};
CalendarEvent.validate_recurrenceRule = (dataIsRecurring, data_recurrenceRule) => {
  if (!dataIsRecurring) return null;
  if (typeof data_recurrenceRule === 'string') data_recurrenceRule = data_recurrenceRule.trim();
  if (!data_recurrenceRule || typeof data_recurrenceRule !== 'string') {
    throw new TypeError('_recurrenceRule not a valid string');
  }
  return data_recurrenceRule;
};
CalendarEvent.validate_noMore = (dataIsRecurring, data_noMore) => {
  if (!dataIsRecurring) return null;
  if (typeof data_noMore === 'number') data_noMore = data_noMore === 1;
  if (typeof data_noMore !== 'boolean') throw new TypeError('_noMore not a boolean');
  return data_noMore;
};

module.exports = CalendarEvent;

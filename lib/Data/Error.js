const CONST_UUID = require('../General/UUID');
const CONST_Time = require('../General/Time');
const CONST_Version = require('../General/Version');

class Error {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = this.validate(data);
    if (error) throw new TypeError(`invalid params provided for "Error": "${error}"`);

    this.uuid = data.uuid;
    this.time = data.time;
    this.version = data.version;
    this.userAgent = data.userAgent;
    this.platform = data.platform;

    this.occurredAt = data.occurredAt;
    this.error = data.error;
    this.stack = data.stack;

    this.msgOnReq = data.msgOnReq;
    this.sendMsgOnReq = data.sendMsgOnReq;
    this.handled = data.handled;
  }

  _castObject(data) {
    return {
      uuid: data[0],
      time: data[1],
      version: data[2],
      userAgent: data[3],
      platform: data[4],
      occurredAt: data[5],
      error: data[6],
      stack: data[7],
      msgOnReq: data[8],
      sendMsgOnReq: data[9],
      handled: data[10],
    };
  }

  validate(data) {
    if (typeof data !== 'object') return 'data not an object';
    try {
      data.uuid = Error.validateUUID(data.uuid);
      data.time = Error.validateTime(data.time);
      data.version = Error.validateVersion(data.version);
      data.userAgent = Error.validateUserAgent(data.userAgent);
      data.platform = Error.validatePlatform(data.platform);

      data.occurredAt = Error.validateOccuredAt(data.occurredAt);
      data.error = Error.validateError(data.error);
      data.stack = Error.validateStack(data.stack);

      data.msgOnReq = Error.validateMsgOnReq(data.msgOnReq);
      data.sendMsgOnReq = Error.validateSendMsgOnReq(data.sendMsgOnReq);
      data.handled = Error.validateHandled(data.handled);
    } catch (e) {
      return e.message;
    }
    return null;
  }

  simplify(simplifyNested = true) {
    return [
      simplifyNested ? this.uuid.simplify() : this.uuid,
      simplifyNested ? this.time.simplify() : this.start,
      simplifyNested ? this.version.simplify() : this.end,
      this.userAgent,
      this.platform,
      simplifyNested ? this.occurredAt.simplify() : this.occurredAt,
      this.error,
      this.stack,
      this.msgOnReq,
      this.sendMsgOnReq && simplifyNested ? this.sendMsgOnReq.simplify() : this.sendMsgOnReq,
      this.handled && simplifyNested ? this.handled.simplify() : this.handled,
    ];
  }

  equals(item, ignoreUUID = false) {
    if (!(item instanceof Error)) return false;
    if (!ignoreUUID) return this.uuid.equals(item.uuid);

    return this.time.equals(item.time) &&
      this.version.equals(item.version) &&
      this.userAgent === item.userAgent &&
      this.platform === item.platform &&
      this.occurredAt.equals(item.occurredAt) &&
      this.error === item.error &&
      this.stack === item.stack &&
      this.msgOnReq === item.msgOnReq &&
      (this.sendMsgOnReq ? this.sendMsgOnReq.equals(item.sendMsgOnReq) : this.sendMsgOnReq === item.sendMsgOnReq) &&
      (this.handled ? this.handled.equals(item.handled) : this.handled === item.handled);
  }

  toSQL() {
    return {
      uuid: this.uuid.simplify(),
      time: this.time.simplify(),
      version: this.version.simplify(),
      userAgent: this.userAgent,
      platform: Error.PLATFORMS[this.platform],
      occurredAt: this.occurredAt.simplify(),
      error: this.error,
      stack: this.stack,
      msgOnReq: this.msgOnReq,
      sendMsgOnReq: this.sendMsgOnReq ? this.sendMsgOnReq.simplify() : null,
      handled: this.handled ? this.handled.simplify() : null,
    };
  }
}
Error.validateUUID = dataUUID => {
  if (dataUUID instanceof CONST_UUID) return dataUUID;
  try {
    return new CONST_UUID(dataUUID);
  } catch (e) {
    throw new TypeError(`uuid invalid: ${e.message}`);
  }
};
Error.validateTime = dataTime => {
  if (dataTime instanceof CONST_Time) return dataTime;
  try {
    return new CONST_Time(dataTime);
  } catch (e) {
    throw new TypeError(`time invalid: ${e.message}`);
  }
};
Error.validateVersion = dataVersion => {
  if (dataVersion instanceof CONST_Version) return dataVersion;
  try {
    return new CONST_Version(dataVersion);
  } catch (e) {
    throw new TypeError(`version invalid: ${e.message}`);
  }
};
Error.validateUserAgent = dataUserAgent => {
  if (typeof dataUserAgent === 'string') dataUserAgent = dataUserAgent.trim();
  if (!dataUserAgent || typeof dataUserAgent !== 'string') throw new TypeError('userAgent not a valid string');
  return dataUserAgent;
};
Error.validatePlatform = dataPlatform => {
  if (typeof dataPlatform === 'string') dataPlatform = Error.PLATFORMS.indexOf(dataPlatform);
  if (typeof dataPlatform !== 'number') throw new TypeError('platform not a number');
  if (dataPlatform < 0 || dataPlatform >= Error.PLATFORMS.length || Math.floor(dataPlatform) !== dataPlatform) {
    throw new TypeError('platform out of bounds');
  }
  return dataPlatform;
};

Error.validateOccuredAt = dataOccuredAt => {
  if (dataOccuredAt instanceof CONST_Time) return dataOccuredAt;
  try {
    return new CONST_Time(dataOccuredAt);
  } catch (e) {
    throw new TypeError(`occuredAt invalid: ${e.message}`);
  }
};
Error.validateError = dataError => {
  if (typeof dataError === 'string') dataError = dataError.trim();
  if (!dataError || typeof dataError !== 'string') throw new TypeError('error not a valid string');
  return dataError;
};
Error.validateStack = dataContent => {
  if (typeof dataContent === 'string') dataContent = dataContent.trim();
  if (!dataContent || typeof dataContent !== 'string') throw new TypeError('stack not a valid string');
  return dataContent;
};

Error.validateMsgOnReq = dataMsgOnReq => {
  if (typeof dataMsgOnReq === 'string') dataMsgOnReq = dataMsgOnReq.trim();
  if (typeof dataMsgOnReq !== 'string' && dataMsgOnReq) throw new TypeError('msgOnReq not a string nor null');
  return dataMsgOnReq || null;
};
Error.validateSendMsgOnReq = dataSendMsgOnReq => {
  if (!dataSendMsgOnReq) return null;
  if (dataSendMsgOnReq instanceof CONST_Time) return dataSendMsgOnReq;
  try {
    return new CONST_Time(dataSendMsgOnReq);
  } catch (e) {
    throw new TypeError(`sendMsgOnReq invalid: ${e.message}`);
  }
};
Error.validateHandled = dataHandled => {
  if (!dataHandled) return null;
  if (dataHandled instanceof CONST_Time) return dataHandled;
  try {
    return new CONST_Time(dataHandled);
  } catch (e) {
    throw new TypeError(`handled invalid: ${e.message}`);
  }
};

Error.PLATFORMS = 'ios,android,backend'.split(',');
module.exports = Error;

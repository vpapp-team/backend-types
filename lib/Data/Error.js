const UTIL = require('backend-util').inputValidation;

class Error {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = Error.validate(data);
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

Error.PLATFORMS = 'ios,android,backend'.split(',');

Error.validate = data => {
  if (typeof data !== 'object') return 'data not an object';
  try {
    data.uuid = UTIL.validateUUID(data.uuid);
    data.time = UTIL.validateTime(data.time);
    data.version = UTIL.validateVersion(data.version);
    data.userAgent = UTIL.validateString(data.userAgent, 'userAgent');
    data.platform = UTIL.validateInStringArray(data.platform, 'platform', Error.PLATFORMS, true);

    data.occurredAt = UTIL.validateTime(data.occurredAt, 'occurredAt');
    data.error = UTIL.validateString(data.error, 'error');
    data.stack = UTIL.validateString(data.stack, 'stack');

    data.msgOnReq = UTIL.validateNullable(data.msgOnReq, 'msgOnReq', UTIL.validateString);
    data.sendMsgOnReq = UTIL.validateNullable(data.sendMsgOnReq, 'sendMsgOnReq', UTIL.validateTime);
    data.handled = UTIL.validateNullable(data.handled, 'handled', UTIL.validateTime);
  } catch (e) {
    if (e.name !== 'TypeError') throw e;
    return e.message;
  }
  return null;
};

module.exports = Error;

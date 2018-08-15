const PLATFORMS = 'ios,android,backend'.split(',');

class Error {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = this.validate(data);
    if (error) throw new TypeError(`invalid params provided for "Feedback": "${error}"`);

    const CONST_UUID = process.types.get('General').get('UUID');
    const CONST_Time = process.types.get('General').get('Time');
    const CONST_Version = process.types.get('General').get('Version');

    this.uuid = data.uuid instanceof CONST_UUID ? data.uuid : new CONST_UUID(data.uuid);
    this.time = data.time instanceof CONST_Time ? data.time : new CONST_Time(data.time);
    this.version = data.version instanceof CONST_Version ? data.version : new CONST_Version(data.version);
    this.userAgent = data.userAgent;
    this.platform = data.platform;

    this.occurredAt = data.occurredAt instanceof CONST_Time ? data.occurredAt : new CONST_Time(data.occurredAt);
    this.error = data.error;
    this.stack = data.stack;

    this.msgOnReq = data.msgOnReq || null;
    this.sendMsgOnReq = null;
    if (data.sendMsgOnReq && data.sendMsgOnReq instanceof CONST_Time) this.sendMsgOnReq = data.sendMsgOnReq;
    else if (data.sendMsgOnReq) this.sendMsgOnReq = new CONST_Time(data.sendMsgOnReq);
    this.handled = null;
    if (data.handled) this.handled = data.handled instanceof CONST_Time ? data.handled : new CONST_Time(data.handled);
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
    data.userAgent = data.userAgent && data.userAgent.trim ? data.userAgent.trim() : data.userAgent;
    if (!data.userAgent || typeof data.userAgent !== 'string') return 'uuid not a valid string';
    if (typeof data.platform === 'string') data.platform = PLATFORMS.indexOf(data.platform);
    if (data.platform < 0 || data.platform >= PLATFORMS.length || Math.floor(data.platform) !== data.platform) return 'platform out of bounds';
    data.error = data.error && data.error.trim ? data.error.trim() : data.error;
    if (!data.error || typeof data.error !== 'string') return 'error not a valid string';
    data.stack = data.stack && data.stack.trim ? data.stack.trim() : data.stack;
    if (!data.stack || typeof data.stack !== 'string') return 'stack not a valid string';

    data.msgOnReq = data.msgOnReq && data.msgOnReq.trim ? data.msgOnReq.trim() : data.msgOnReq;
    if (typeof data.msgOnReq !== 'string' && data.msgOnReq) return 'msgOnReq not a string nor null';
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
      platform: PLATFORMS[this.platform],
      occurredAt: this.occurredAt.simplify(),
      error: this.error,
      stack: this.stack,
      msgOnReq: this.msgOnReq,
      sendMsgOnReq: this.sendMsgOnReq ? this.sendMsgOnReq.simplify() : null,
      handled: this.handled ? this.handled.simplify() : null,
    };
  }
}
Error.PLATFORMS = PLATFORMS;

module.exports = Error;

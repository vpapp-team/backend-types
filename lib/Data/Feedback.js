const PLATFORMS = 'ios,android,backend'.split(',');

class Feedback {
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

    this.name = data.name || null;
    this.email = data.email ? data.email instanceof CONST_UUID ? data.email : new CONST_UUID(data.email) : null;
    this.content = data.content;

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
      name: data[5],
      email: data[6],
      content: data[7],
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
    data.name = data.name && data.name.trim ? data.name.trim() : data.name;
    if (typeof data.name !== 'string' && data.name) return 'name not a string nor null';
    data.content = data.content && data.content.trim ? data.content.trim() : data.content;
    if (!data.content || typeof data.content !== 'string') return 'content not a valid string';

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
      this.name,
      this.email && simplifyNested ? this.email.simplify() : this.email,
      this.content,
      this.msgOnReq,
      this.sendMsgOnReq && simplifyNested ? this.sendMsgOnReq.simplify() : this.sendMsgOnReq,
      this.handled && simplifyNested ? this.handled.simplify() : this.handled,
    ];
  }

  equals(item, ignoreUUID = false) {
    if (!(item instanceof Feedback)) return false;
    if (!ignoreUUID) return this.uuid.equals(item.uuid);

    return this.time.equals(item.time) &&
      this.version.equals(item.version) &&
      this.userAgent === item.userAgent &&
      this.platform === item.platform &&
      this.name === item.name &&
      this.email === item.email &&
      this.content === item.content &&
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
      name: this.name,
      email: this.email ? this.email.simplify() : null,
      content: this.content,
      msgOnReq: this.msgOnReq,
      sendMsgOnReq: this.sendMsgOnReq ? this.sendMsgOnReq.simplify() : null,
      handled: this.handled ? this.handled.simplify() : null,
    };
  }
}
Feedback.PLATFORMS = PLATFORMS;

module.exports = Feedback;

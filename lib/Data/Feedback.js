const UTIL = require('backend-util').inputValidation;

class Feedback {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = Feedback.validate(data);
    if (error) throw new TypeError(`invalid params provided for "Feedback": "${error}"`);

    this.uuid = data.uuid;
    this.time = data.time;
    this.version = data.version;
    this.userAgent = data.userAgent;
    this.platform = data.platform;

    this.name = data.name;
    this.email = data.email;
    this.content = data.content;

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
      name: data[5],
      email: data[6],
      content: data[7],
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
      platform: Feedback.PLATFORMS[this.platform],
      name: this.name,
      email: this.email ? this.email.simplify() : null,
      content: this.content,
      msgOnReq: this.msgOnReq,
      sendMsgOnReq: this.sendMsgOnReq ? this.sendMsgOnReq.simplify() : null,
      handled: this.handled ? this.handled.simplify() : null,
    };
  }
}

Feedback.PLATFORMS = 'ios,android,backend'.split(',');

Feedback.validate = data => {
  if (typeof data !== 'object') return 'data not an object';
  try {
    data.uuid = UTIL.validateUUID(data.uuid);
    data.time = UTIL.validateTime(data.time);
    data.version = UTIL.validateVersion(data.version);
    data.userAgent = UTIL.validateString(data.userAgent, 'userAgent');
    data.platform = UTIL.validateInStringArray(data.platform, 'platform', Feedback.PLATFORMS, true);

    data.name = UTIL.validateNullable(data.name, 'name', UTIL.validateString);
    data.email = UTIL.validateNullable(data.email, 'email', UTIL.validateUUID);
    data.content = UTIL.validateString(data.content, 'content');

    data.msgOnReq = UTIL.validateNullable(data.msgOnReq, 'msgOnReq', UTIL.validateString);
    data.sendMsgOnReq = UTIL.validateNullable(data.sendMsgOnReq, 'sendMsgOnReq', UTIL.validateTime);
    data.handled = UTIL.validateNullable(data.handled, 'handled', UTIL.validateTime);
  } catch (e) {
    if (e.name !== 'TypeError') throw e;
    return e.message;
  }
  return null;
};

module.exports = Feedback;

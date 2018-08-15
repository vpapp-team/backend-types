const CONST_UUID = require('../General/UUID');
const CONST_Time = require('../General/Time');
const CONST_Version = require('../General/Version');

class Feedback {
  constructor(data) {
    if (Array.isArray(data)) data = this._castObject(data);
    let error = this.validate(data);
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

  validate(data) {
    if (typeof data !== 'object') return 'data not an object';
    try {
      data.uuid = Feedback.validateUUID(data.uuid);
      data.time = Feedback.validateTime(data.time);
      data.version = Feedback.validateVersion(data.version);
      data.userAgent = Feedback.validateUserAgent(data.userAgent);
      data.platform = Feedback.validatePlatform(data.platform);

      data.name = Feedback.validateName(data.name);
      data.email = Feedback.validateEmail(data.email);
      data.content = Feedback.validateContent(data.content);

      data.msgOnReq = Feedback.validateMsgOnReq(data.msgOnReq);
      data.sendMsgOnReq = Feedback.validateSendMsgOnReq(data.sendMsgOnReq);
      data.handled = Feedback.validateHandled(data.handled);
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
Feedback.validateUUID = dataUUID => {
  if (dataUUID instanceof CONST_UUID) return dataUUID;
  try {
    return new CONST_UUID(dataUUID);
  } catch (e) {
    throw new TypeError(`uuid invalid: ${e.message}`);
  }
};
Feedback.validateTime = dataTime => {
  if (dataTime instanceof CONST_Time) return dataTime;
  try {
    return new CONST_Time(dataTime);
  } catch (e) {
    throw new TypeError(`time invalid: ${e.message}`);
  }
};
Feedback.validateVersion = dataVersion => {
  if (dataVersion instanceof CONST_Version) return dataVersion;
  try {
    return new CONST_Version(dataVersion);
  } catch (e) {
    throw new TypeError(`version invalid: ${e.message}`);
  }
};
Feedback.validateUserAgent = dataUserAgent => {
  if (typeof dataUserAgent === 'string') dataUserAgent = dataUserAgent.trim();
  if (!dataUserAgent || typeof dataUserAgent !== 'string') throw new TypeError('userAgent not a valid string');
  return dataUserAgent;
};
Feedback.validatePlatform = dataPlatform => {
  if (typeof dataPlatform === 'string') dataPlatform = Feedback.PLATFORMS.indexOf(dataPlatform);
  if (typeof dataPlatform !== 'number') throw new TypeError('platform not a number');
  if (dataPlatform < 0 || dataPlatform >= Feedback.PLATFORMS.length || Math.floor(dataPlatform) !== dataPlatform) {
    throw new TypeError('platform out of bounds');
  }
  return dataPlatform;
};
Feedback.validateName = dataName => {
  if (typeof dataName === 'string') dataName = dataName.trim();
  if (typeof dataName !== 'string' && dataName) throw new TypeError('name not a string nor null');
  return dataName || null;
};
Feedback.validateEmail = dataEmail => {
  if (!dataEmail) return null;
  if (dataEmail instanceof CONST_UUID) return dataEmail;
  try {
    return new CONST_UUID(dataEmail);
  } catch (e) {
    throw new TypeError(`email invalid: ${e.message}`);
  }
};
Feedback.validateContent = dataContent => {
  if (typeof dataContent === 'string') dataContent = dataContent.trim();
  if (!dataContent || typeof dataContent !== 'string') throw new TypeError('content not a valid string');
  return dataContent;
};
Feedback.validateMsgOnReq = dataMsgOnReq => {
  if (typeof dataMsgOnReq === 'string') dataMsgOnReq = dataMsgOnReq.trim();
  if (typeof dataMsgOnReq !== 'string' && dataMsgOnReq) throw new TypeError('msgOnReq not a string nor null');
  return dataMsgOnReq || null;
};
Feedback.validateSendMsgOnReq = dataSendMsgOnReq => {
  if (!dataSendMsgOnReq) return null;
  if (dataSendMsgOnReq instanceof CONST_Time) return dataSendMsgOnReq;
  try {
    return new CONST_Time(dataSendMsgOnReq);
  } catch (e) {
    throw new TypeError(`sendMsgOnReq invalid: ${e.message}`);
  }
};
Feedback.validateHandled = dataHandled => {
  if (!dataHandled) return null;
  if (dataHandled instanceof CONST_Time) return dataHandled;
  try {
    return new CONST_Time(dataHandled);
  } catch (e) {
    throw new TypeError(`handled invalid: ${e.message}`);
  }
};

Feedback.PLATFORMS = 'ios,android,backend'.split(',');
module.exports = Feedback;

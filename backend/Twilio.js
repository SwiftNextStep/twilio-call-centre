const twilio = require('twilio');
const VoiceResponse = require('twilio/lib/twiml/VoiceResponse');

class Twilio {
  phoneNumber = '+1 351 222 2440';
  phoneNumberSid = 'PN47f2bad216fdd88d372dc71b664134bb';
  tokenSid = 'SK5c80fa5fdb5fcf6bb0d1b62729faeb0a';
  tokenSecret = 'kYf35kMrCj6nQTaHnQqaBdBJ938FMTZ6';
  accountSid = 'AC00a582b04fdc286f452bbc54e2ed3f68';
  verify = 'VAa9076aa844820c1989ede893233b5c92';
  outgoingApplicationSid = 'APa6f537b76c8303bf77d7fd442a4f4107';
  client;
  constructor() {
    this.client = twilio(this.tokenSid, this.tokenSecret, {
      accountSid: this.accountSid,
    });
  }
  getTwilio() {
    this.client;
  }

  async sendVerifyAsync(to, channel) {
    const data = await this.client.verify
      .services(this.verify)
      .verifications.create({
        to,
        channel,
      });
    console.log('sendVerify');
    return data;
  }

  async verifyCodeAsync(to, code) {
    const data = await this.client.verify
      .services(this.verify)
      .verificationChecks.create({
        to,
        code,
      });
    console.log('verifyCode');
    return data;
  }

  voiceResponse(message) {
    const twiml = new VoiceResponse();
    twiml.say(
      {
        voice: 'female',
      },
      message
    );
    twiml.redirect('https://icaro-callcenter.loca.lt/enqueue');
    return twiml;
  }

  enqueueCall(queueName) {
    const twiml = new VoiceResponse();
    twiml.enqueue(queueName);
    return twiml;
  }

  redirectCall(client) {
    const twiml = new VoiceResponse();
    twiml.dial().client(client);
    return twiml;
  }

  answerCall(sid) {
    console.log('answerCall with sid', sid);
    this.client.calls(sid).update({
      url: 'https://icaro-callcenter.loca.lt/connect-call',
      method: 'POST',
      function(err, call) {
        console.log('anwserCall', call);
        if (err) {
          console.error('anwserCall', err);
        }
      },
    });
  }

  getAccessTokenForVoice = (identity) => {
    console.log(`Access token for ${identity}`);
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;
    const outgoingAppSid = this.outgoingApplicationSid;
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: outgoingAppSid,
      incomingAllow: true,
    });
    const token = new AccessToken(
      this.accountSid,
      this.tokenSid,
      this.tokenSecret,
      { identity }
    );
    token.addGrant(voiceGrant);
    console.log('Access granted with JWT', token.toJwt());
    return token.toJwt();
  };
}

const instance = new Twilio();
Object.freeze(instance);

module.exports = instance;

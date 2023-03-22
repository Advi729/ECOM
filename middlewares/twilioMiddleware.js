/* eslint-disable linebreak-style */
const twilio = require('twilio');

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const serviceSid = process.env.SERVICE_SID;

const client = twilio(accountSid, authToken);

module.exports = {

  // api for sending otp to the user mobile number....
  send_otp: (mobileNo) => new Promise((resolve, reject) => {
    client.verify
      .services(serviceSid)
      .verifications
      .create({
        to: `+91${mobileNo}`,
        channel: 'sms',
      })
      .then((verifications) => {
        resolve(verifications.sid);
      });
  }),
  // api for verifying the otp recived by the user
  verifying_otp: (mobileNo, otp) => new Promise((resolve, reject) => {
    client.verify
      .services(serviceSid)
      .verificationChecks
      .create({
        to: `+91${mobileNo}`,
        code: otp,
      })
      .then((verifications) => {
        resolve(verifications);
      });
  }),
};

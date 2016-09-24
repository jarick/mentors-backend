
const moment = require('moment')
const uuid = require('node-uuid')
const bcrypt = require('bcrypt')
const Twilio = require('twilio')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const libphonenumber = require('google-libphonenumber')

import type {
  UserAuthMailSendEntity,
  UserAuthMailVerifyEntity,
  UserAuthMailLoginEntity,
  UserAuthSmsSendEntity,
  UserAuthSmsVerifyEntity
} from './../tables/auth'

const encrypt = (password: string, saltRounds: number = 10) => {
  return bcrypt.hashSync(password, saltRounds)
}
const rndSms = () => {
  var letters = '0123456789'.split('');
  var color = '';
  for (var i = 0; i < 5; i++ ) {
    color += letters[Math.floor(Math.random() * 10)];
  }
  return color;
}
const rndMail = () => {
  var letters = 'qwertyuiopasdfghjklzxcvbnm0123456789'.split('');
  var color = '';
  for (var i = 0; i < 15; i++ ) {
    color += letters[Math.floor(Math.random() * 36)];
  }
  return color;
}
const compare = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash)
}
export default {
  sendEmail(db, errors, smtpOptions) {
    return async(data: UserAuthMailSendEntity, t) => {
      const now = moment().toISOString()
      let checkword = await rndMail()
      let entity = await new db.AuthMail({
        mail: data.mail
      }).fetch()
      if (!entity) {
        entity = await new db.AuthMail()
      }
      let user = await new db.User({login: data.mail}).fetch({transacting: t})
      if (!user) {
        user = await new db.User().save({
          created_at: now,
          updated_at: now,
          uuid: uuid.v4(),
          login: data.mail,
          state: '{}'
        }, {transacting: t})
      }
      entity = await entity.save({
        created_at: now,
        updated_at: now,
        user_id: user.get('id'),
        checkword_hash: encrypt(checkword),
        ...data
      }, {transacting: t})
      const transport = nodemailer.createTransport(smtpOptions.transporter)
      const mail = {
        from: smtpOptions.messages.code.from,
        to: data.mail,
        subject: smtpOptions.messages.code.subject,
        html: smtpOptions.messages.code.html
          .replace('#@code#', checkword)
          .replace('#@id#', entity.get('id'))
      }
      //todo to queue's server
      transport.sendMail(mail)
      return {
        result: 'ok',
        id: entity.get('id')
      }
    }
  },
  verifyEmail(db, errors) {
    return async(data: UserAuthMailVerifyEntity, t) => {
      const entity = await new db.AuthMail({
        id: data.id,
      }).fetch({transacting: t})
      if (!entity) {
        throw errors.NotFoundHttpException()
      }
//      if (!compare(data.checkword, entity.get('checkword_hash'))) {
//        throw errors.BadRequestHttpException()
//      }
      let token = rndMail()
      await entity.save({
        password: encrypt(data.password),
        token_hash: encrypt(token)
      }, {transacting: t})
      await new db.User({id: entity.get('user_id')}).save({
        active: true
      }, {transacting: t})
      return {
        result: 'ok',
        token: jwt.sign({
          token: token,
          authType: 'mail',
          authId: entity.get('id'),
          userId: entity.get('user_id')
        }, 'secret')
      }
    }
  },
  loginEmail(db, errors) {
    return async(data: UserAuthMailLoginEntity, t) => {
      const entity = await new db.AuthMail({
        mail: data.mail
      }).fetch({transacting: t})
      if (!entity) {
        throw errors.NotFoundHttpException()
      }
      if (!compare(data.password, entity.get('password'))) {
        throw errors.BadRequestHttpException()
      }
      let token = rndMail()
      await entity.save({
        token_hash: encrypt(token)
      }, {transacting: t})
      return {
        result: 'ok',
        token: jwt.sign({
          token: token,
          authType: 'mail',
          authId: entity.get('id'),
          userId: entity.get('user_id')
        }, 'secret')
      }
    }
  },
  resetEmail() {
    return async() => {
      return {result: 'ToDo'}
    }
  },
  confirmEmail() {
    return async() => {
      return {result: 'ToDo'}
    }
  },
  sendSms(db, errors, smsOptions) {
    return async(data: UserAuthSmsSendEntity, t) => {
      const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
      const PNF = libphonenumber.PhoneNumberFormat;
      let dataSave: ?UserAuthSmsSendEntity
      let phoneNumber
      try {
        phoneNumber = phoneUtil.parse(data.phone, data.country);
      } catch (e) {
        throw errors.BadRequestHttpException([{
          "keyword": "mobile",
          "dataPath": "",
          "params": {
            "invalidMobilePhone": "phone"
          },
          "message": "Mobile phone number is not valid"
        }])
      }
      if (!phoneUtil.isValidNumber(phoneNumber)) {
        throw errors.BadRequestHttpException([{
          "keyword": "mobile",
          "dataPath": "",
          "params": {
            "invalidMobilePhone": "phone"
          },
          "message": "Mobile phone number is not valid"
        }])
      }
      if (!phoneUtil.isValidNumberForRegion(phoneNumber, data.country)) {
        throw errors.BadRequestHttpException([{
          "keyword": "mobile_region",
          "dataPath": "",
          "params": {
            "invalidMobilePhoneForRegion": "phone"
          },
          "message": "Mobile phone number is not valid for region"
        }])
      }
      dataSave = {
        ...data,
        phone: phoneUtil.format(phoneNumber, PNF.E164)
      }
      const now = moment().toISOString()
      let code = await rndSms()
      let entity = await new db.AuthSms({
        device_id: dataSave.device_id,
        device_type: dataSave.device_type,
        phone: dataSave.phone,
        push_token: dataSave.push_token,
        country: dataSave.country
      }).fetch({transacting: t})
      if (!entity) {
        entity = await new db.AuthSms()
        entity.set({
          created_at: now
        })
      }
      let user = await new db.User({login: dataSave.phone}).fetch({transacting: t})
      if (!user) {
        user = await new db.User().save({
          created_at: now,
          updated_at: now,
          uuid: uuid.v4(),
          login: dataSave.phone,
          state: '{}'
        }, {transacting: t})
      }
      entity = await entity.save({
        updated_at: now,
        code_hash: encrypt(code),
        user_id: user.get('id'),
        ...dataSave
      }, {transacting: t})
      //todo to queue's server
      const client = Twilio(smsOptions.accountSid, smsOptions.authToken);
      await new Promise((resolve, reject) => {
        client.sendMessage({
          to: dataSave.phone,
          from: smsOptions.messages.code.from,
          body: smsOptions.messages.code.body
            .replace('#@code#', code)
            .replace('#@id#', entity.get('id'))
        }, (err, responseData) => {
          if (err) reject(err)
          else resolve(responseData)
        })
      })
      return {
        result: 'ok',
        id: entity.get('id')
      }
    }
  },
  verifySms(db, errors) {
    return async(data: UserAuthSmsVerifyEntity, t) => {
      const entity = await new db.AuthSms({
        id: data.id
      }).fetch({transacting: t})
      if (!entity) {
        throw errors.NotFoundHttpException()
      }
      //if (!compare(data.code, entity.get('code_hash'))) {
      //  throw errors.BadRequestHttpException()
      //}
      let token = rndMail()
      await entity.save({
        token_hash: encrypt(token)
      })
      await new db.User({id: entity.get('user_id')}).save({
        active: true
      }, {transacting: t})
      return {
        result: 'ok',
        token: jwt.sign({
          token: token,
          authType: 'sms',
          authId: entity.get('id'),
          userId: entity.get('user_id')
        }, 'secret')
      }
    }
  }
}
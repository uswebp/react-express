//======================================================================
// set up
//======================================================================
const nodemailer = require('nodemailer');
const df = require('./config/define.js');
//======================================================================
// メールアカウント接続
let transporter = nodemailer.createTransport({
    service:'gmail',
    host: df.FROM_MAIL_HOST,
    port: df.SMTP_MAIL_PORT,
    secure: true, // SSL
    auth: {
      user: df.FROMT_MAIL_ADRESS,
      pass: df.FROMT_MAIL_ADRESS_PASS
    }
  });// DB設定情報出力
module.exports =  {transporter:transporter}

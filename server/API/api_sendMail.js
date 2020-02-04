//======================================================================
// set up
//======================================================================
const apiFunc = require('../lib/api_functions');
const MailCon = require('../MailManager.js');
const df = require('../config/define');
//======================================================================
exports.getAPI = function (req,res) {
    let con = MailCon.transporter;
    let from = df.FROMT_MAIL_ADRESS;
    // console.log(con);
    // return con;
    let results = apiFunc.sendMail(con, from);
    console.log(results);
    //     return res.json({
    //     con:con
    // })
}
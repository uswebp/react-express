const mysql = require('mysql');
const dbconfig = require('../conifg/db_conf');
// DB接続
const connection = mysql.createConnection(dbconfig.connection);
// DB設定情報出力
module.exports =  {connection:connection}

const basicAuth = require('basic-auth-connect');
const basic_user = 'coodig';
const basic_pass = 'u.syu.2525';

module.exports =  {basicconf:basicAuth(basic_user,basic_pass)}

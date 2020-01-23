// ドメイン
const APP_DOMAIN = 'coodig.com'
// ローカルIPアドレス
const LOCAL_IP = '192.168.33.11';
// URL(IP)
const FULL_LOCAL_URL = 'http://192.168.33.11';
// URL(ドメイン)
const FULL_URL = 'http://coodig.com';
// URL(ドメインwww有り)
const FULL_URL_WWW = 'http://www.coodig.com';
// サーバーサイドポート番号
const SERVER_PORT = 5000;
// フロントサイドポート番号
const FRONT_PORT = 3000;
// トップに出すPGタグの数
const TOP_VIEW_TOTAL_NUMBER = 10;
// 送信元メールアドレス
const FROMT_MAIL_ADRESS = 'usweb111@gmail.com';
// 送信元メールアカウントパスワード
const FROMT_MAIL_ADRESS_PASS = 'u.syu.2525';
// 送信メールポート
const SMTP_MAIL_PORT = 465;
// メールホスト
const FROM_MAIL_HOST = 'smtp.gmail.com';

module.exports = {
    APP_DOMAIN:APP_DOMAIN,
    LOCAL_IP:LOCAL_IP,
    FULL_LOCAL_URL:FULL_LOCAL_URL,
    FULL_URL:FULL_URL,
    FULL_URL_WWW:FULL_URL_WWW,
    SERVER_PORT:SERVER_PORT,
    FRONT_PORT,FRONT_PORT,
    TOP_VIEW_TOTAL_NUMBER: TOP_VIEW_TOTAL_NUMBER,
    FROMT_MAIL_ADRESS: FROMT_MAIL_ADRESS,
    FROMT_MAIL_ADRESS_PASS: FROMT_MAIL_ADRESS_PASS,
    SMTP_MAIL_PORT: SMTP_MAIL_PORT,
    FROM_MAIL_HOST: FROM_MAIL_HOST,
};


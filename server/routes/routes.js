//======================================================================
// set up
//======================================================================
const dbConf = require('../DbManager');
//======================================================================
// DB接続エラー
dbConf.connection.connect(err => {
    if(err) {
        return err;
    }
});
// server routing
module.exports = function(app) {
    // CORSを許可
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'http://192.168.33.11:3000');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        next();
    });
    // Options
    app.options('*', (req, res) => {
        res.sendStatus(200);
    });
    // テストJSON
    app.get('/api/customers/:id/:operation?',require('../API/api_getTestJson').getAPI);
    // テストDB接続➔値取得
    app.use('/chat_db',require('../API/api_getChatData').getAPI);
    // 言語カラー取得
    app.use('/p_lang_color',require('../API/api_getPlangColor').getAPI);
    // 豆知識取得
    app.use('/trivia',require('../API/api_getTrivia').getAPI);
    // 最近の豆知識情報(重複なし)取得
    app.use('/getRecentlyLang',require('../API/api_getRecentlyLang').getAPI);
}


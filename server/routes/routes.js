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
    // 言語カラー取得
    app.use('/p_lang_color',require('../API/api_getPlangColor').getAPI);
    // 指定数で豆知識取得
    app.use('/trivia/:num',require('../API/api_getTrivia').getAPI);
    // 乱数配列を取得
    app.use('/tagrandum/:num',require('../API/api_tagRandum').getAPI);
    // 検索ページの豆知識取得
    app.use('/search_trivia/page/:page/limit/:limit',require('../API/api_searchTrivia').getAPI);
    // 検索ページの豆知識取得
    app.use('/search_trivia_where/word/:word/id/:id/page/:page/limit/:limit/order/:order',require('../API/api_searchTriviaWhere').getAPI);
    // 豆知識数取得
    app.use('/count_trivia/word/:word/id/:id',require('../API/api_getTriviaCount').getAPI);
    //豆知識登録用API
    app.use('/ins_trivia/article/:article/id/:id',require('../API/api_insTrivia').getAPI);
    //メール送信用API
    app.use('/send_mail/',require('../API/api_sendMail.js').getAPI);
    //トップページ用のタグ取得
    app.use('/recently_lang/',require('../API/api_getRecentlyLang.js').getAPI);
}


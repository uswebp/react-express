//======================================================================
// set up
//======================================================================
const dbConf = require('./DbManager');
const dbQuery = require('./lib/db_query');
//======================================================================
//DB接続チェック
dbConf.connection.connect(err => {
    if (err) {
        return err;
    }
});

module.exports = function(socket) {
    console.log('socket connect ⇒ ' + socket.id);
    socket.emit('emit_socketid', socket.id);
    // socket切断時
    socket.on('disconnect', () => {
        console.log('user disconnected ⇒ ' + socket.id);
    });
    // 任意にsocket切断
    socket.on('amputation_socket', () => {
        console.log('dct');
        socket.disconnect();
    });
    // 任意にsocket接続
    socket.on('connection_socket', () => {
        socket.connect();
    });
    // 豆知識投稿を検知し、豆知識タグが表示中か判定
    socket.on('trivia_send_sign', () => {
        socket.emit('trivia_sending');
        socket.broadcast.emit('trivia_sending');
    });
    // 豆知識投稿時
    socket.on('send_trivia', (data) => {
        // 豆知識情報をデコード
        data.artcle = decodeURIComponent(data.article);
        // 豆知識登録
        const INS_TRIVIA = dbQuery.insTrivia(data.p_lang_id, data.artcle);
        // 登録した豆知識を取得するSQL文発行
        const GET_TRIVIA = dbQuery.getTrivia(1);
        // 豆知識投稿
        dbConf.connection.query(INS_TRIVIA, (err) => {
            if (err) {
                return res.send(err)
            }
        });
        // プログラム言語情報取得
        dbConf.connection.query(GET_TRIVIA, (err, results) => {
            if (err) {
                return res.send(err)
            } else {
                // 言語情報登録
                data.p_lang_name = results[0].p_lang_name;
                data.p_lang_color = results[0].p_lang_color_code;
                data.trivia_id = results[0].trivia_id;
                data.socket_id = socket.id;
                // 送信
                socket.emit('emit_from_server_trivia', data);
                socket.broadcast.emit('emit_from_server_trivia', data);
            }
        });
    });
}
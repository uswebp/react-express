//======================================================================
// set up
//======================================================================
const dbConf = require('./DbManager');
const dbQuery = require('./lib/db_query');
//======================================================================
//DB接続チェック
dbConf.connection.connect(err => {
    if(err) {
        return err;
    }
});

module.exports = function(socket){
    console.log('socket connect ⇒ ' + socket.id);
    socket.emit('emit_socketid', socket.id );
    // socket切断時
    socket.on('disconnect', () => {
        console.log('user disconnected ⇒ ' + socket.id);
    });
    // 任意にsocket切断
    socket.on('amputation_socket', () => {
        socket.disconnect();
    });

    socket.on('send_trivia', (data) => {
        const INS_TRIVIA = dbQuery.insTrivia(data.p_lang_id,data.article);
        const GET_P_COLOR = dbQuery.getSPcolor(data.p_lang_id);
        // 豆知識投稿
        dbConf.connection.query(INS_TRIVIA, (err) => {
            if(err) {
                return res.send(err)
            }
        });
        // プログラム言語情報取得
        dbConf.connection.query(GET_P_COLOR, (err, results) => {
            if(err) {
                return res.send(err)
            } else {
                // 言語情報登録
                data.p_lang_name = results[0].p_lang_name;
                data.p_lang_color = results[0].p_lang_color_code;
                data.socket_id = socket.id;
                // 送信
                socket.emit('emit_from_server_trvie', data);
                socket.broadcast.emit('emit_from_server_trvie', data);
            }
        });
    });
}
//======================================================================
// set up
//======================================================================
const dbConf = require('./dbManager');
const dbQuery = require('../lib/db_query');
//======================================================================
//DB接続チェック
dbConf.connection.connect(err => {
    if(err) {
        return err;
    }
});

module.exports = function(socket){
    console.log('socket connect...' + socket.id);
    socket.emit('emit_socketid', socket.id );
    socket.on('disconnect', () => {
        console.log('user disconnectdd');
    });

    socket.on('amputation_socket', (socketid) => {
        socket.disconnect();
    });

    socket.on('send_trivia', (data) => {
        const INS_TRIVIA = dbQuery.insTrivia(data.p_lang_id,data.article);
        const GET_P_COLOR = dbQuery.getSPcolor(data.p_lang_id);
        dbConf.connection.query(INS_TRIVIA, (err) => {
            if(err) {
                return res.send(err)
            }
        });
        dbConf.connection.query(GET_P_COLOR, (err, results) => {
            if(err) {
                return res.send(err)
            } else {
                data.p_lang_name = results[0].p_lang_name;
                data.p_lang_color = results[0].p_lang_color_code;
                data.socket_id = socket.id;

                socket.emit('emit_from_server_trvie', data );
                socket.broadcast.emit('emit_from_server_trvie', data);
            }
        });
    });
}
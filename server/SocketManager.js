const io = require('./server').io;
const dbConf = require('./dbManager');
const dbQuery = require('../lib/db_query');

dbConf.connection.connect(err => {
    if(err) {
        return err;
    }
});

module.exports = function(socket){
    console.log('socket connect...');

    socket.on('disconnect', () => {
        console.log('user disconnectdd');
    });
    socket.on('send_chat', (data) => {
        const INS_MSG_Q = `insert into chat_test(chat_msg) values('${data}');`;
        console.log(INS_MSG_Q);
        dbConf.connection.query(INS_MSG_Q, (err) => {
            if(err) {
                return res.send(err)
            }
        });
        socket.emit('emit_from_server', data);
        socket.broadcast.emit('emit_from_server', data);
    });
    
    socket.on('send_trivia', (data) => {
        // console.log(data);
        const INS_TRIVIA = dbQuery.insTrivia(data.p_lang_id,data.article);
        const GET_P_COLOR = dbQuery.getSPcolor(data.p_lang_id);
        var p_lang_name = 0;
        var p_lang_color = 0;
        dbConf.connection.query(INS_TRIVIA, (err) => {
            if(err) {
                return res.send(err)
            }
        });

        dbConf.connection.query(GET_P_COLOR, (err, results) => {
            if(err) {
                return res.send(err)
            } else {
                p_lang_name = results[0].p_lang_name;
                p_lang_color = results[0].p_lang_color_code;
                socket.emit('emit_from_server_trvie', data , p_lang_name,p_lang_color);
                socket.broadcast.emit('emit_from_server_trvie', data, p_lang_name,p_lang_color);
            }
        });
    });
}
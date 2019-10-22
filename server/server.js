const express = require('express');
const app = express();
const port = 5000;
const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server);
const SocketManager = require('./SocketManager');
const dbConf = require('./dbManager');
const dbQuery = require('../lib/db_query');
// const auth = require('../conifg/auth');
// app.use(auth.basicconf);

const TOP_VIEW_TOTAL_NUMBER = 10;

// console.log(dbQuery.getRandomArr());
// DB接続エラー
dbConf.connection.connect(err => {
    if(err) {
        return err;
    }
});
// Crossを有効
app.use((req, res, next) => {
    // res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Origin', 'http://192.168.33.11:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    next();
});
// Optionsも必要
app.options('*', (req, res) => {
    res.sendStatus(200);
});

app.get('/api/customers', (req, res) => {
    const customers = [
        {id: 1, firstName: 'John', lastName: 'White'},
        {id: 2, firstName: 'John', lastName: 'Blue'},
        {id: 3, firstName: 'John', lastName: 'Red'}
    ];
    res.json(customers);
});

app.get('/chat_db', (req, res) => {
    const SELECT_ALL_REACT_TEST_Q = 'SELECT * FROM chat_test ORDER BY chat_id DESC limit 20';
    dbConf.connection.query(SELECT_ALL_REACT_TEST_Q, (err, results) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                data: results
            })
        }
    }); 
});
app.get('/p_lang_color', (req, res) => {
    const SELECT_ALL_REACT_TEST_Q = 'SELECT * FROM p_lang_mst';
    dbConf.connection.query(SELECT_ALL_REACT_TEST_Q, (err, results) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                color: results
            })
        }
    }); 
});
app.get('/trivia', (req, res) => {
    const SELECT_ALL_REACT_TEST_Q = dbQuery.getTrivia();
    // console.log(SELECT_ALL_REACT_TEST_Q);
    dbConf.connection.query(SELECT_ALL_REACT_TEST_Q, (err, results) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                trivia: results
            })
        }
    }); 
});


app.get('/getRecentlyLang', (req, res) => {
    const SELECT_ALL_REACT_TEST_Q = dbQuery.getRecentlyLang(TOP_VIEW_TOTAL_NUMBER);
    // console.log(SELECT_ALL_REACT_TEST_Q);
    dbConf.connection.query(SELECT_ALL_REACT_TEST_Q, (err, results) => {
        if(err) {
            return res.send(err);
        } else {
            return res.json({
                recently_p_langs: results
            })
        }
    });
});

// Socket接続
io.on('connection', SocketManager);
// Listen
server.listen(port, (err) => {
    if (err) throw err
    console.log(`Server started on port ${port}`);
});

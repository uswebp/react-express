const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 5000;


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Usweb0812@',
    database: 'database_test'
});
const SELECT_ALL_REACT_TEST_Q = 'SELECT * FROM react_test';

connection.connect(err => {
    if(err) {
        return err;
    }
});

app.get('/api/customers', (req, res) => {
    const customers = [
        {id: 1, firstName: 'John', lastName: 'White'},
        {id: 2, firstName: 'John', lastName: 'Blue'},
        {id: 3, firstName: 'John', lastName: 'Red'}
    ];
    res.json(customers);
});
app.get('/', (req, res) => {
    const {name} = req.query;
    // console.log(name);
    connection.query(SELECT_ALL_REACT_TEST_Q, (err, results) => {
        console.log(results);
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                data: results
            })
        }
    });
});
app.listen(port, () => console.log(`Server started on port ${port}`));
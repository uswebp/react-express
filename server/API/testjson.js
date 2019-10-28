//======================================================================
// set up
//======================================================================
const dbConf = require('../dbManager');
const dbQuery = require('../../lib/db_query');
const define = require('../../config/define');
//======================================================================
exports.getAPI = function (req,res) {
    const customers = [
        {id: 1, firstName: 'John', lastName: 'White'},
        {id: 2, firstName: 'John', lastName: 'Blue'},
        {id: 3, firstName: 'John', lastName: 'Red'}
    ];
    res.json(customers);
}
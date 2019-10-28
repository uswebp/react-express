//======================================================================
// set up
//======================================================================
const dbConf = require('../dbManager');
const dbQuery = require('../../lib/db_query');
const define = require('../../config/define');
//======================================================================
exports.getAPI = function (req,res) {
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
}
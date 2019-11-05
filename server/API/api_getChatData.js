//======================================================================
// set up
//======================================================================
const dbConf = require('../DbManager');
const dbQuery = require('../lib/db_query');
const df = require('../config/define');
//======================================================================
exports.getAPI = function (req,res) {
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
}
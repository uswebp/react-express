//======================================================================
// set up
//======================================================================
const dbConf = require('../DbManager');
const dbQuery = require('../lib/db_query');
const df = require('../config/define');
//======================================================================
exports.getAPI = function (req,res) {
    let fetch_num = req.params.num;
    const SELECT_ALL_REACT_TEST_Q = dbQuery.getTrivia(fetch_num);
    dbConf.connection.query(SELECT_ALL_REACT_TEST_Q, (err, results) => {
        if(err) {
            return res.send(err)
        } else {
            return res.json({
                trivia: results
            })
        }
    }); 
}
//======================================================================
// set up
//======================================================================
const dbConf = require('../DbManager');
const dbQuery = require('../lib/db_query');
const df = require('../config/define');
//======================================================================
exports.getAPI = function (req,res) {
    console.log(req.params.num);
    let tag_num = req.params.num;
    let results = dbQuery.getRandomArr(tag_num);
    return res.json({
        randum:results
    })
}
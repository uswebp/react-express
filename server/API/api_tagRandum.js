//======================================================================
// set up
//======================================================================
const apiFunc = require('../lib/api_functions');
//======================================================================
exports.getAPI = function (req,res) {
    let tag_num = req.params.num;
    let results = apiFunc.getRandomArr(tag_num);
    return res.json({
        randum:results
    })
}
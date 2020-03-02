//======================================================================
// set up
//======================================================================
const apiFunc = require('../lib/api_functions');
//======================================================================
exports.getAPI = function (req,res) {
    let max = req.params.num;
    let results = apiFunc.getRandomArr(max);
    return res.json({
        randum:results
    })
}
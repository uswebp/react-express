/*=================================================================================
 APIに関する関数集
=================================================================================*/
/**
 * @description 重複無しランダム配列
 * @param {Int} max | 生成する配列の数字列の個数
 * @returns {Array} randoms | 生成した乱数配列 ([3,5,9,1,5,0,2])
 */
exports.getRandomArr = (max) => {
    // 重複チェック用配列
    var randoms = [];
    // 最小値と最大値
    var min = 0, max_num = max - 1;

    // 重複チェックしながら乱数作成
    for(i = min; i <= max_num; i++){
        while(true){
            var tmp = intRandom(min, max_num);
            if(!randoms.includes(tmp)){
              randoms.push(tmp);
              break;
            }
        }
    }
    return randoms;
}
/**
 * @description 指定された範囲内で乱数を返す
 * @param {Int} min |　最小値
 * @param {Int} max |  最大値
 * @returns {Int} Math.floor( Math.random() * (max - min + 1)) + min | 乱数
 */
function intRandom(min, max){
  return Math.floor( Math.random() * (max - min + 1)) + min;
}
/**
 * @description お問い合わせメール送信
 *
 * @returns
 */
exports.sendMail = (con, from) => {
    var mailOptions = {
        from: from,
        to: 'usweb111@gmail.com',
        subject: '{test}',
        text: '{testhonbun}'
      };
      con.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          return 'false';
        } else {
          console.log('Email sent: ' + info.response);
          return 'ok';
        }
      });
}


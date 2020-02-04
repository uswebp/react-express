# Coding Rule

> ## CSS
```
- 備考
・クラス名/ID名はハイフン(-)で連結【例：header-area】
・cssプロパティの複数指定がある場合は別ファイル参照【例：border,transition等】
・CSSファイルは下記に該当するように作成する
    ∟ 共通使用 ⇒ common.css
    ∟ input関連 ⇒ form.css
    ∟ button関連 ⇒ button.css
    ∟ animation関連 ⇒ animation.css
```
```css
.id {
    font-size: 12px;
    color: #ffffff;
    background-color: rgba(10, 10, 10, 0.5);
}
```
> ## JavaScript
```
- 備考
・変数名・定数名は「スネークケース」【例:admin_id, MAX_WIDTH】
・配列の変数には「ary, 〇〇s」を使用
・関数名は「キャメルケース」【例:getRandum】
・共通して使用する定数は別ファイルで指定し、ファイルを読み込んで使用
・関数はアロー関数を使用
```
- ### 代入
```javascript
let a = 10;
const b = 'Hello';

let c = 5,
    d = 10,
    e = 'Good';

let colors = ['red', 'blue', 'yellow', 'black'];

let hoge = function(){
    hogehoge = 'hogehoge';
    return hogehoge;
};
```

- ### if文
```javascript
if (i === ture && j === false) {

} else if(y === false) {

} else {

}

if (i === true) console.log("ok");
```

- ### 三項演算子
```javascript
let i = (i > 5) ? 'OK' : 'NG';
```

- ### for文
```javascript
let i = 0;
for (let i = 0; i < 10; i++) {
    let j = 'Hello' + 'World';
}
```

- ### function
```javascript
function testInsert() {
    console.log('insert!');
}


(function (){
    console.log('即時関数');
}());

```
- ### switch
```javascript
switch (a) {
    case '1':
        console.log('1!');
        break;

    case '2':
        console.log('2!');
        break;

    case '3':
        console.log('3!');
        break;

    default:
        console.log('default!');
        break;
}
```

- ### try
```javascript
try {

} catch (error) {

} finally {

}

```

- ### function comments
```javascript
/**
 * @CM
 * @description 足し算
 * @param {*} a
 * @param {*} b
 * @returns ab
 */
function testInsert(a, b) {
    let ab = a + b;
    return ab;
}
```

- ### class

```javascript
class User extends Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
/**
 *
    *
    * @returns
    * @memberof User
    */
    getAge() {
        return this.age;
    }
}

let user1 = new User('a', 17);

```

- ###  comments
```javascript
// 1行

/*
// 複数行
// 複数行
// 複数行
*/
```

> ## 独自ルール

- インデント4 (タブOK)
- 独自関数は関数の上部にコメントで // CM
- メソッド名に動詞
- 演算子の間半角スペース

> ## 参考
> 
> #### [コーディング規約](https://www.studio-umi.jp/blog/9/160)
> 
> <br>

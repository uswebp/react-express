# Coding Rule

> ## CSS

```css
.id {
    font-size: 12px;
    color: #ffffff;
    background-color: rgba(10, 10, 10, 0.5);
}
```

> ## JavaScript

- ### 代入
```javascript
var a = 10;
var b = 'Hello';

var c = 5,
    d = 10,
    e = 'Good';

var colors = ['red', 'blue', 'yellow', 'black'];

var hoge = function(){
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
var i = (i > 5) ? 'OK' : 'NG';
```

- ### for文
```javascript
var i = 0;
for (var i = 0; i < 10; i++) {
    var j = 'Hello' + 'World';
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
    var ab = a + b;
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

var user1 = new User('a', 17);

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

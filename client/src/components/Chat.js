import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import history from '../lib/history';
import { Link } from 'react-router-dom';

class Chat extends Component {
  constructor() {
    super();
    this.state = {
      TOP_VIEW_LANGAGES: 10,
      serverURL: "http://192.168.33.11:5000",
      socket: socketIOClient('http://192.168.33.11:5000'),
      socketID: '',
      chat_msgs: [],
      trivia: [],
      p_lang_color: [],
      recentlyLangs: [] // 呼び出し => this.state.recentlyLangs[0].p_lang_id
    };
  }


  componentDidMount() {
    let socket = this.state.socket;
    // SocketIDセット
    socket.on("emit_socketid",(socketid) => {
      this.setSocketID(socketid);
    });
    // 豆知識送信時
    socket.on("emit_from_server_trvie", (data) => {
      // socket.idをセット
      this.setSocketID(data.socket_id);
      // 送信データの描画
      let msg = document.querySelector('.msgs');
      let chat_txt = document.querySelector('.chat-txt');
      let msg_obj = document.createElement('div');
      let msg_span = document.createElement('span');
      let msg_last = msg.lastElementChild;
      msg_obj.classList.add('msg');
      msg_obj.classList.add('p_' + data.p_lang_color);
      msg_obj.setAttribute('alt', data.article);
      msg_span.classList.add('msg_ch');
      msg.insertBefore(msg_obj, msg.firstChild);
      let msgs_f = document.querySelectorAll('.msg');
      console.log(msgs_f[0]);
      msgs_f[0].appendChild(msg_span).innerText = data.p_lang_name;
      chat_txt.value = '';
      chat_txt.focus();
      msg_last.classList.add('killmsg');
      msg_last.addEventListener('animationend',function(){
        msg.removeChild(msg_last); 
      });
    
    });

    this.getTrivia();
    this.getPcolor();
  }

  // ルーティング 
  routerAction = (url) => {
    let link_path = url.currentTarget.getAttribute('data-num');
    // Socket切断
    this.socketDct();
    // 遷移
    history.push(link_path);
  }
  // 豆知識送信
  sendTrivia = () => {
    let socket = this.state.socket;
    let chat_txt = document.querySelector('.chat-txt').value;
    let p_lang_id = document.querySelector('.p_lang_color').value;
    let trivia_data = {
      article: chat_txt,
      p_lang_id: p_lang_id
    }
    socket.emit('send_trivia', trivia_data);
  }
  // ページ遷移時ソケット情報削除
  socketDct = () => {
    let socket = this.state.socket;
    socket.emit('amputation_socket');
  }
  // 豆知識取得
  getTrivia = () => {
    fetch('http://192.168.33.11:5000/trivia')
      .then(response => response.json())
      .then((data) => {
        this.setTrivia(data);
      })
      .catch(err => console.error(err))
  }
  // 言語情報取得
  getPcolor = () => {
    fetch('http://192.168.33.11:5000/p_lang_color')
      .then(response => response.json())
      .then((data) => {
        this.setPcolor(data);
      })
      .catch(err => console.error(err))
  }
  // 豆知識セット
  setTrivia = (data) => {
    this.setState({ trivia: data.trivia });
  }
  // 言語カラーセット
  setPcolor = (data) => {
    this.setState({ p_lang_color: data.color });
  }
  // SocketIDセット
  setSocketID = (data) => {
    this.setState({ socketID: data });
  }
  // latest_msgセット
  setLatestMsg = (data) => {
    this.setState({ latest_msg: data });
  }
  // 投稿内容レンダリング
  renderTrivia = () => ({ trivia_id, article, p_lang_color_code, p_lang_name }) =>
    <div className={`msg p_${p_lang_color_code}`} key={trivia_id} alt={article}><span className='msg_ch'>{p_lang_name}</span></div>

  render() {
    const {trivia} = this.state;
    // 言語セレクトメニュー
    let list = [];
    let p_color_list = this.state.p_lang_color;
    for (let i in p_color_list) {
      list.push(<option key={p_color_list[i].p_lang_id} value={p_color_list[i].p_lang_id}>{p_color_list[i].p_lang_name}</option>);
    }
    
    return (
      <div> 
            <h2>Coodig.com</h2>
            <div className="container">
                <select name="p_lang_color" className="p_lang_color">
                  {list}
                </select>
                <input type="text" className="chat-txt"/>
                <button onClick={()=>this.sendTrivia()}>send</button>
                <div className="msgs">
                {trivia.map(this.renderTrivia())}
                </div>
            </div>
            <button onClick={this.routerAction} data-num='/article' className="article_btn"> articleへ</button>
            <button onClick={this.routerAction} data-num='/linktest' className="article_btn"> linktestへ</button>
            <p><Link to="/soket_bug">バグ用 ×</Link></p>
            <p><a href="/soket_bug">バグ用　○</a></p>
      </div>
    )
  }
}

export default Chat;
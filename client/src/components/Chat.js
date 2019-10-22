import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import history from '../lib/history';
import '../index.css';


class Chat extends Component {
  constructor() {
    super();
    this.state = {
      TOP_VIEW_LANGAGES: 10,
      serverURL: "http://192.168.33.11:5000",
      socket: socketIOClient('http://192.168.33.11:5000'),
      chat_msgs: [],
      trivia: [],
      p_lang_color: [],
      recentlyLangs: [] // 呼び出し => this.state.recentlyLangs[0].p_lang_id
    };
  }


  componentDidMount() {
    let socket = this.state.socket;
    socket.on("emit_from_server", (data) => {

      let msg = document.querySelector('.msgs');
      let chat_txt = document.querySelector('.chat-txt');
      let msg_obj = document.createElement('div');
      msg_obj.classList.add('msg')
      msg.insertBefore(msg_obj, msg.firstChild).innerText = data;
      chat_txt.value = '';
      chat_txt.focus();
    });

    socket.on("emit_from_server_trvie", (data, p_lang_name, p_lang_color) => {
      let msg = document.querySelector('.msgs');
      let chat_txt = document.querySelector('.chat-txt');
      let msg_obj = document.createElement('div');
      let msg_last = msg.lastElementChild;
      msg_obj.classList.add('msg');
      msg_obj.classList.add('p_' + p_lang_color);
      msg_obj.setAttribute('alt', data.article);
      msg.insertBefore(msg_obj, msg.firstChild).innerText = p_lang_name;
      chat_txt.value = '';
      chat_txt.focus();
      msg.removeChild(msg_last);

    });
    this.getChat();
    this.getTrivia();
    this.getPcolor();
    this.getLangId();
  }

  emitInfoToAll = () => {
    let socket = this.state.socket;
    let chat_txt = document.querySelector('.chat-txt').value;
    if (chat_txt) {
      socket.emit('send_chat', chat_txt);
    }
  }

  // ルーティング 
  routerAction = () => {
    history.push('/article');
  }

  routerlinktest = () => {
    history.push('/LinkTest');
  }

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

  getChat = () => {
    fetch('http://192.168.33.11:5000/chat_db')
      .then(response => response.json())
      .then((data) => {
        this.setChat(data);
      })
      .catch(err => console.error(err))
  }

  getTrivia = () => {
    fetch('http://192.168.33.11:5000/trivia')
      .then(response => response.json())
      .then((data) => {
        this.setTrivia(data);
      })
      .catch(err => console.error(err))
  }
  getPcolor = () => {
    fetch('http://192.168.33.11:5000/p_lang_color')
      .then(response => response.json())
      .then((data) => {
        this.setPcolor(data);
      })
      .catch(err => console.error(err))
  }

  // 最近投稿された言語idを取得するAPI呼び出し
  getLangId = () => {
    fetch('http://192.168.33.11:5000/getRecentlyLang')
      .then(response => response.json())
      .then((data) => {
      this.setRecently(data);
      })
    .catch (err => console.err(err));
    }

    setChat = (data) => {
      this.setState({ chat_msgs: data.data });
    }

    setTrivia = (data) => {
      this.setState({ trivia: data.trivia });
    }

    setPcolor = (data) => {
      this.setState({ p_lang_color: data.color });
    }

    // 最新10件をstateにset
    setRecently = (data) => {
      this.setState({ recentlyLangs: data.recently_p_langs });
    }

    renderChat = () => ({ chat_id, chat_msg }) => <div className="msg" key={chat_id}> {chat_msg}</div>

    renderTrivia = () => ({ trivia_id, article, p_lang_color_code, p_lang_name }) =>
      <div className={`msg p_${p_lang_color_code}`} key={trivia_id} alt={article}>{p_lang_name}</div>

  render() {
    // const {chat_msgs} = this.state;
    const {trivia} = this.state;
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
                {/* <button onClick={()=>this.emitInfoToAll()}>send</button> */}
                <button onClick={()=>this.sendTrivia()}>send</button>
                <div className="msgs">
                {trivia.map(this.renderTrivia())}
                {/* {chat_msgs.map(this.renderChat())} */}
                </div>
            </div>
            <button onClick={this.routerAction} className="article_btn"> articleへ</button>
            <button onClick={this.routerlinktest} className="article_btn"> linktestへ</button>
      </div>
      
    )
    }
  }

  export default Chat;
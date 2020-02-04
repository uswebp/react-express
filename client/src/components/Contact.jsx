import React from 'react';
import history from '../lib/history';

class Contact extends React.Component {
    changePage = () => {
        history.push('/');
    }

    render() {
        return (
            <div>
                <form action="" name="contact-form" id="contact-form" className="contact-form" method="post">
                    <fieldset>
                        <legend><span className="form-head">お問い合わせフォーム</span></legend>
                        <div className="inner-contact-form">
                            <div className="contact-input-parts">
                                <label className="contact-label">お名前【任意】</label>
                                <div className="contact-input-area">
                                    <input type="text" name="name" id="contact-name" placeholder="" />
                                </div>
                            </div>
                            <div className="contact-input-parts">
                                <label className="contact-label">メールアドレス 【必須】</label>
                                <div className="contact-input-area">
                                    <input type="mail" name="mail" id="contact-mail" placeholder="sapmle@sample.ne.jp" />
                                </div>
                            </div>
                            <div className="contact-input-parts">
                                <label className="contact-label">問い合わせ内容 【必須】</label>
                                <div className="contact-input-area">
                                    <textarea name="contact-body" className="contact-body" id="contact-body" placeholder="お問い合わせ内容入力してください"></textarea>
                                    <div className="annotation">※最大入力文字数は2000文字です。</div>
                                </div>
                            </div>
                            <div className="contact-input-parts">
                            <div className="contact-button-area">
                                <label className="contact-label"></label>
                                <div className="contact-input-area">
                                    <input type="submit" value="送信" id="contact-button" className="btn-basic btn-02" />
                                </div>
                            </div>
                        </div>
                        </div>
                    </fieldset>
                </form>
            </div>
        );
    }
};

export default Contact;
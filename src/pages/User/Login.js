import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { Checkbox, Alert, Icon } from 'antd';
import Login from '@/components/Login';
import * as encryptions from '@/utils/basicTools';

import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: '2',
    autoLogin: false,
    loginUserInfo: {},
  };

  componentDidMount() {
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('autoLogin')) {
        this.setState({
          autoLogin: JSON.parse(localStorage.getItem('autoLogin')),
        });
      }
      if (localStorage.getItem('loginUserInfo')) {
        const loginUserInfo = JSON.parse(encryptions.decodeBase64(localStorage.getItem('loginUserInfo')));
        this.setState({
          loginUserInfo,
        });
      }
    }
  }

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  handleSubmit = (err, values) => {
    const { type, autoLogin } = this.state;
    if (autoLogin) {
      const str = JSON.stringify(values);
      const encodeStr = encryptions.encodeBase64(str);
      localStorage.setItem('loginUserInfo', encodeStr);
    } else {
      localStorage.removeItem('loginUserInfo');
    }
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
    localStorage.setItem('autoLogin', e.target.checked);
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );


  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin, loginUserInfo } = this.state;

    return (
      <div className={styles.main}>
        <Login
          autoComplete="off"
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          {login.status === 'error' &&
          login.type === 'account' &&
          !submitting &&
          this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
          <UserName
            name="account"
            placeholder={formatMessage({ id: 'app.login.placeholderUserName' })}
            autoComplete="chrome-off"
            defaultValue={Object.keys(loginUserInfo).length !== 0 ? loginUserInfo.account : ''}
          />
          <Password
            name="password"
            placeholder={formatMessage({ id: 'app.login.placeholderPassword' })}
            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            autoComplete="new-password"
            defaultValue={Object.keys(loginUserInfo).length !== 0 ? loginUserInfo.password : ''}
          />
          <div className='verification' />

          <div className={styles.forget}>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="app.login.remember-me" />
            </Checkbox>
          </div>
          <Submit loading={submitting} style={{ float: 'right' }}>
            <FormattedMessage id="app.login.login" />
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;

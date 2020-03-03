import React, { Fragment } from 'react';
import styles from '~css/login.module.less';
import { Form, Icon, Input, Button, Checkbox, message, Avatar } from 'antd';
import request from '~js/utils/request';
import { store } from '~js/utils/utils';
import { history } from '~js/utils/utils';
import { Link } from 'react-router-dom';

@Form.create()
class RegisterForm extends React.Component {
  state = {
    url: null
  };

  componentDidMount() {
    this.handleCaptcha();
  }

  handleCaptcha = () => {
    request('http://114.67.90.231:8888/testGetCaptcha')
      .then(payload => this.setState({ url: payload.url }))
      .catch(error => message.error(error.message));
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        request('http://114.67.90.231:8888/login/create', {
          method: 'POST',
          body: values,
          notify: true
        })
          .then(payload => {
            const { history } = this.props;

            history.push('/login');
          })
          .catch(error => message.error(error.message));
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { url } = this.state;
    return (
      <div className={styles.registerFormBox}>
        <h2>帐号注册</h2>
        <Form onSubmit={this.handleSubmit} className={styles.loginForm}>
          <Form.Item>
            {getFieldDecorator('telnumber', {
              rules: [
                { required: true, message: '请输入手机号' },
                {
                  pattern: /^1[3456789]\d{9}$/,
                  message: '请输入正确的手机号'
                }
              ]
            })(
              <Input
                maxLength={11}
                prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请输入手机号"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('pwd', {
              rules: [{ required: true, message: '请输入密码' }]
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                maxLength={16}
                type="password"
                placeholder="请输入密码"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('user_name', {
              rules: [{ required: true, message: '请输入真实姓名' }]
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="text"
                placeholder="请输入真实姓名"
              />
            )}
          </Form.Item>
          <Form.Item>
            <div className={styles.captchaBox}>
              {getFieldDecorator('code', {
                rules: [{ required: true, message: '请输入验证码' }]
              })(
                <Input
                  className={styles.captchaInput}
                  prefix={<Icon type="picture" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="text"
                  placeholder="请输入验证码"
                />
              )}
              {url ? (
                <img src={url} className={styles.captchaImg} onClick={this.handleCaptcha} />
              ) : (
                <span className={styles.imgPlaceHolder}></span>
              )}
            </div>
          </Form.Item>
          <Button type="primary" htmlType="submit" className={styles.registerButton}>
            注册
          </Button>
          <Link to="/login" className={styles.loginHref}>
            帐号登录
          </Link>
        </Form>
      </div>
    );
  }
}

const storeAccount = 'loginName';
const storeAccountState = 'loginRememberState';

@Form.create()
export default class App extends React.Component {
  state = {
    account: store.get(storeAccount),
    remember: store.get(storeAccountState) != 0
  };

  handleRemember = e => {
    const { checked } = e.target;
    console.log(e.target.checked);
    if (!checked) {
      store.remove(storeAccount);
    }
    this.setState({ remember: checked });

    store.set(storeAccountState, checked ? 1 : 0);
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { remember } = this.state;
        if (remember) {
          store.set(storeAccount, values.telnumber);
        } else {
          store.remove(storeAccount);
        }

        request('http://114.67.90.231:8888/login_user', {
          method: 'POST',
          body: values
        })
          .then(payload => {
            const { history } = this.props;

            history.push('/');
          })
          .catch(error => message.error(error.message));
      }
    });
  };

  getErrorMessage() {
    const { form } = this.props;
    const { getFieldsError } = form;

    const error = getFieldsError(['telnumber', 'pwd']);

    if (error.username) {
      return error.username[0];
    }

    if (error.pwd) {
      return error.password[0];
    }

    return null;
  }

  render() {
    const { type } = this.props.match.params;
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props;

    return (
      <div className={styles.body}>
        {type === 'login' ? (
          <div className={styles.loginFormBox}>
            <img src={require('~images/logo.png')} className={styles.logo} />
            <Form onSubmit={this.handleSubmit} className={styles.loginForm}>
              <Form.Item>
                {getFieldDecorator('telnumber', {
                  initialValue: store.get(storeAccount),
                  rules: [
                    {
                      required: true,
                      message: '请输入手机号'
                    },
                    {
                      pattern: /^1[3456789]\d{9}$/,
                      message: '请输入正确的手机号'
                    }
                  ]
                })(
                  <Input
                    maxLength={11}
                    prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="请输入手机号"
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('pwd', {
                  rules: [{ required: true, message: '请输入密码' }]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    maxLength={16}
                    type="password"
                    placeholder="请输入手机号"
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: this.state.remember
                })(<Checkbox onChange={this.handleRemember}>记住密码</Checkbox>)}
                <a className={styles.loginForgot} href="">
                  忘记密码
                </a>
                <Button type="primary" htmlType="submit" className={styles.loginButton}>
                  登录
                </Button>
                <Link to="/register">注册帐号</Link>
              </Form.Item>
            </Form>
          </div>
        ) : (
          <RegisterForm history={history}></RegisterForm>
        )}
      </div>
    );
  }
}

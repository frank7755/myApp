import React, { Fragment } from 'react';
import request from '~js/utils/request';
import { message, Layout, Menu, Icon, Dropdown, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import menu from '~src/menu.js';
import styles from './Index.module.less';

export default class App extends React.Component {
  state = {
    draw: false,
    info: null
  };
  handleLogout = () => {
    request('http://114.67.90.231:8888/login_out').then(this.props.history.push('/login'));
  };

  componentWillMount() {
    request('http://114.67.90.231:8888/login_check')
      .then(payload => this.setState({ draw: true, info: payload }))
      .catch(error => {
        console.error(error);
        message.error(error.message);
      });
  }

  render() {
    const { SubMenu } = Menu;
    const { Header, Content, Sider } = Layout;
    const { draw, info } = this.state;

    const userSlideMenu = (
      <Menu>
        <Menu.Item onClick={this.handleLogout}>
          <a>
            <Icon type="logout" style={{ marginRight: 5 }}></Icon>退出登录
          </a>
        </Menu.Item>
      </Menu>
    );

    return draw ? (
      <Layout style={{ height: '100%', overflow: 'hidden' }}>
        <Sider
          className={styles.slider}
          width={200}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0
          }}
          theme="dark"
        >
          <div className={styles.logo}>
            <img src={require('~images/logo.png')}></img>
          </div>
          <Menu theme="dark" mode="inline" className={styles.menu}>
            {menu.map(nav => (
              <SubMenu
                key={nav.key}
                title={
                  <div>
                    {nav.icon}
                    <span>{nav.title}</span>
                  </div>
                }
              >
                {nav.children &&
                  nav.children.map(subnav => (
                    <Menu.Item key={subnav.key}>
                      <Link to={subnav.src}>{subnav.title}</Link>
                    </Menu.Item>
                  ))}
              </SubMenu>
            ))}
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: 200 }}>
          <Header className={styles.header}>
            <ul>
              <Dropdown overlay={userSlideMenu}>
                <li>
                  <Avatar style={{ backgroundColor: '#87d068', marginRight: 10 }} icon="user" />
                  {info.telnumber}
                </li>
              </Dropdown>
            </ul>
          </Header>
          <Content
            style={{
              padding: 24,
              height: '100%',
              overflow: 'initial'
            }}
          >
            {this.props.children(info.id, info.user_name, info.telnumber)}
          </Content>
        </Layout>
      </Layout>
    ) : null;
  }
}

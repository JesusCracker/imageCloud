import React, { PureComponent } from 'react';
import { Menu, Layout } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './HelpCenter.less'
import FillReport from './HelpPages/FillReport'
import Reading from './HelpPages/Reading'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

@connect(({ suggestion, loading }) => ({
  loading: loading.models.suggestion,
  suggestion,
}))

class ProductSuggestionPage extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick = e => {
    const { key } = e
    switch (key) {
      case '1-2':
        router.push('/helpCenter/helpCenter/fillReport');
        break;
      default:
        router.push('/helpCenter/helpCenter');
    }
  };

  render() {
    const { history } = this.props
    const pathName = history.location.pathname

    let Component
    switch(pathName) {
      case '/helpCenter/helpCenter/fillReport':
        Component = <FillReport />
        break;
      default:
        Component = <Reading />
    }

    return (
      <Layout>
        <Header className={styles.header}>
          <div className={styles.logo} />
        </Header>
        <Layout>
          <Sider width={256} style={{ background: '#fff' }}>
            <Menu
              onClick={this.handleClick}
              style={{ width: 256, height: '100%' }}
              defaultSelectedKeys={['1-1']}
              defaultOpenKeys={['sub1']}
              mode="inline"
            >
              <SubMenu
                key="sub1"
                title={
                  <span>快速上手：</span>
                }
              >
                <Menu.Item key="1-1">如何阅片</Menu.Item>
                <Menu.Item key="1-2">如何填写报告</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub2"
                title={
                  <span>使用手册：</span>
                }
              >
                <Menu.Item key="2-1">Option 5</Menu.Item>
                <Menu.Item key="2-2">Option 6</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub3"
                title={
                  <span>常见问题：</span>
                }
              >
                <Menu.Item key="3-1">Option 9</Menu.Item>
                <Menu.Item key="3-2">Option 10</Menu.Item>
              </SubMenu>
            </Menu>

          </Sider>
          <Layout>
            <Content
              style={{
                background: '#fff',
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              { Component }
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default ProductSuggestionPage;

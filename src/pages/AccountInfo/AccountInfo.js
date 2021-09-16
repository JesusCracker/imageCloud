import React, { createRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Row,
  Col,
  Skeleton,
  Avatar,
  Button,
  Divider,
  Tag,
  Tabs,
  Input,
  Table,
  Icon,
  Form,
  Modal,
  message,
  Popconfirm
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { imgUrlPath } from '@/global';
import ErrorBoundary from '@/utils/ErrorBoundary'
import styles from './AccountInfo.less';
import ChangeInfo from './changeInfo';
import ChangePassword from './changePassword';

const { TabPane } = Tabs;
const { Search } = Input;

@connect(({ info, loading }) => ({
  info,
  loading,
}))
@Form.create()
class AccountInfo extends PureComponent {

  state = {
    params: {
      limit: 10,
      page: 1,
      recipientId: localStorage.getItem('id'),
    },
    ids: [],
    type: 'list',
    visibleInfo: false,
    visiblePwd: false,
  };

  searchBar = createRef()

  child = createRef();

  otherChild = createRef();

  columns = [
    {
      title: '发件人',
      dataIndex: 'sendUserName',
      key: 'sendUserName',
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
      render: (text, record) => (
        <div>
          {record && record.status === 2 && <Tag color="#f50">未读</Tag>}
          <a onClick={() => this.changeMessage(record)}>{text}</a>
        </div>
      ),
    },
    {
      title: '时间',
      dataIndex: 'createDate',
      key: 'createDate',
      align: 'center',
      defaultSortOrder: 'descend',
      render: val => moment.utc(val).format('YYYY-MM-DD HH:mm:ss'),
      sorter: ((a,b) => moment(b) > moment(a) ? -1 : 1)
    },
  ];

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      const arr = [];
      selectedRows.forEach((item, index) => {
        arr[index] = item.id;
      });
      this.setState({
        ids: arr,
      });
    },
  };

  componentDidMount() {
    const { dispatch,location } = this.props;
    const { params } = this.state;
    // 通过右上角消息进入个人中心
    if (location.state && location.state.messageId) {
      dispatch({
        type: 'info/getMessageInfo',
        payload: location.state.messageId,
      }).then(() => {
        this.setState({
          type: 'info'
        })
      })
    } else {
      dispatch({
        type: 'info/queryList',
        payload: params,
      });
    }
    dispatch({
      type: 'info/fetchCurrent',
    });
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const {dispatch,location} = this.props;
    if (location.state && (location.state.messageId !== (prevProps.location.state ? prevProps.location.state.messageId : ''))) {
      dispatch({
        type: 'info/getMessageInfo',
        payload: location.state.messageId,
      }).then(() => {
        this.setState({
          type: 'info'
        })
      })
    }
  }

  // 用于消息列表刷新和条件筛选
  getMessageListData = (type, value) => {
    const { dispatch } = this.props;
    const { params } = this.state;
    if (type === 'search') {
      dispatch({
        type: 'info/queryList',
        payload: {
          ...params,
          searchData: value,
        },
      });
    } else {
      // 清空输入框内容
      this.searchBar.current.input.state.value = '';
      dispatch({
        type: 'info/queryList',
        payload: params,
      });
    }
  };

  // 消息删除
  handleDelete = () => {
    const { ids, type } = this.state;
    const { dispatch, info } = this.props;
    if (type === 'list') {
      if (ids.length !== 0) {
        dispatch({
          type: 'info/deleteMessages',
          payload: ids,
        }).then((res) => {
          if (res && res.status === 1) {
            message.success('消息删除成功');
            this.getMessageListData();
          } else {
            message.error('删除失败');
          }
        });
      }else {
        message.error('未选择需要删除的消息！');
      }
    } else if (type === 'info') {
      dispatch({
        type: 'info/deleteMessages',
        payload: [info.messageContent.id],
      }).then((res) => {
        if (res && res === 1) {
          message.success('消息删除成功');
          this.setState({
            type: 'list',
          });
          this.getMessageListData();
        } else {
          message.error('删除失败');
        }
      });
    }
  };

  // 点击分页
  handlePage = (page) => {
    const { params } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'info/queryList',
      payload: { ...params, page: page.current },
    });
  };

  // 用于消息详情的刷新
  reloadMessageInfo = () => {
    const { dispatch, info } = this.props;
    dispatch({
      type: 'info/getMessageInfo',
      payload: info.messageContent.id,
    });
  };

  // 点击查看详情
  changeMessage = (row) => {
    const { params, type } = this.state;
    const { dispatch } = this.props;
    if (type === 'list') {
      dispatch({
        type: 'info/getMessageInfo',
        payload: row.id,
      })
      dispatch({
        type: 'user/changeMessageStatus',
        payload: row.id
      }).then(res => {
        if(res && res.status === 1) {
          dispatch({
            type: 'global/fetchAllNotices',
          });
        }
      })
      this.setState({
        type: 'info',
      })
    } else if (type === 'info') {
      dispatch({
        type: 'info/queryList',
        payload: params,
      })
      this.setState({
        type: 'list',
      })
    }
  };

  // 显示个人信息修改
  showChangeInfo = () => {
    this.setState({
      visibleInfo: true,
    });
  };

  // 隐藏个人信息修改
  handleCancel = e => {
    e.preventDefault();
    this.setState({
      visibleInfo: false,
      visiblePwd: false,
    });
  };

  // 显示密码修改
  handleChangePwd = () => {
    this.setState({
      visiblePwd: true,
    });
  };

  // 提交表单
  submit = () => {
    const {dispatch,info} = this.props;
    const {userInfo} = info;
    const {imageUrl} = this.child.state

    this.child.props.form.validateFields((err, values) => {
      const params = {
        name: values.name,
        sex: values.sex,
        birthDate: moment(values.birthDate).format('YYYY-MM-DD'),
        id: userInfo.id,
      }
      if (values.newPhoneSuffix) {
        params.phone = values.newPhoneSuffix;
        params.phoneCode = values.phoneVerify;
      }
      if (values.newEmail) {
        params.email = values.newEmail;
        params.emailCode = values.emailVerify;
      }
      if (imageUrl) {
        params.headicon = imageUrl;
      }
      dispatch({
        type: 'info/postMessage',
        payload: params
      }).then((res) => {
        if (res && res.status === 1) {
          dispatch({
            type: 'info/fetchCurrent'
          })
          dispatch({
            type: 'user/fetchCurrent'
          })
          message.success('修改成功')
          this.setState({
            visibleInfo: false
          })
        } else {
          message.error('修改失败')
        }
      })
    })
  };

  // 修改密码
  changePwd = () => {
    const {dispatch} = this.props;
    this.otherChild.props.form.validateFields((err,values) => {
      const {password: oldPassword, newPassword} = values;
      const params = {
        userId: parseInt(localStorage.getItem('id'), 10),
        oldPassword, newPassword
      }
      dispatch({
        type: 'info/changePwd',
        payload: params
      }).then(res => {
        if (res && res.status === 1) {
          message.success('修改成功,请重新登录');
          this.setState({
            visiblePwd: false
          })
          dispatch({
            type: 'login/logout',
          });
        }
      })
    })
  }

  render() {
    const { type, visibleInfo, visiblePwd } = this.state;
    const { info, loading } = this.props;
    const { userInfo, messageList, messageContent, messageListTotal } = info;
    const time = messageContent && moment.utc(messageContent.createDate);

    return (
      <PageHeaderWrapper title="个人中心">
        <Row gutter={24}>
          {/* 左侧基础信息栏 */}
          <Col xl={7} lg={24}>
            <Card bordered={false} className={styles.baseInfo}>
              <Skeleton loading={loading.effects['user/fetchCurrent']} avatar active paragraph={{ rows: 14 }}>
                {/*头像*/}
                <div className={styles.avatarHolder}>
                  {
                    userInfo.headicon ? (
                      <Avatar
                        size={110}
                        src={imgUrlPath+userInfo.headicon}
                      />
                    ) : (
                      <Avatar
                        size={110}
                      >
                        {userInfo.name}
                      </Avatar>
                    )
                  }
                  <div className={styles.name}>
                    {userInfo.name}
                    {
                      userInfo.sex === 1 && <Icon type="woman" style={{ color: 'pink' }} />
                    }
                    {
                      userInfo.sex === 2 && <Icon type="man" style={{ color: 'skyblue' }} />
                    }
                    {
                      userInfo.sex === 3 && '保密'
                    }
                  </div>
                  <div>阅片医生</div>
                </div>
                {/*详细信息*/}
                <div className={styles.detail}>
                  <p>电话号码 ： {userInfo.phone}</p>
                  <p>出生年月 ： {moment.utc(userInfo.birthDate).format('YYYY-MM-DD')}</p>
                  <p>电子邮箱 ： {userInfo.email ? userInfo.email : <a onClick={this.showChangeInfo}>去绑定</a>}</p>
                </div>
                <div className={styles.handleBox}>
                  <Button
                    type="primary"
                    className={styles.changeInfoBtn}
                    onClick={this.showChangeInfo}
                  >修改信息
                  </Button>
                  <Button className={styles.changeInfoBtn} onClick={this.handleChangePwd}>修改密码</Button>
                </div>
              </Skeleton>
            </Card>
          </Col>
          {/* 右侧消息栏 */}
          <Col xl={17} lg={24}>
            {
              type === 'list' && (
                <Card bordered={false} className={styles.messageBox}>
                  <Tabs defaultActiveKey="1">
                    <TabPane tab={`消息列表（${messageListTotal || 0}）`} key="1">
                      <div className={styles.messageHeader}>
                        <div className={styles.btnBox}>
                          <Button icon="sync" size='large' onClick={this.getMessageListData} />
                          <Popconfirm
                            placement="rightTop"
                            title='确认删除吗？'
                            onConfirm={this.handleDelete}
                            okText="确定"
                            cancelText="取消"
                          >
                            <Button icon="delete" size='large' />
                          </Popconfirm>
                        </div>
                        <div className={styles.searchBox}>
                          <Search
                            ref={this.searchBar}
                            placeholder="搜索邮件标题、正文等"
                            enterButton="搜 索"
                            size="large"
                            onSearch={value => this.getMessageListData('search', value)}
                          />
                        </div>
                      </div>
                      <ErrorBoundary>
                        <Table
                          loading={loading.effects['info/queryList']}
                          rowSelection={this.rowSelection}
                          columns={this.columns}
                          dataSource={messageList}
                          rowKey={row => row.id}
                          onChange={this.handlePage}
                          pagination={{total: messageListTotal}}
                        />
                      </ErrorBoundary>
                    </TabPane>
                  </Tabs>
                </Card>
              )
            }
            {
              type === 'info' && (
                <Card bordered={false} className={styles.messageBox}>
                  <Skeleton loading={loading.effects['info/getMessageInfo']} active paragraph={{ rows: 7 }}>
                    <div className={styles.messageInfo}>
                      <div className={styles.navHeader}>
                        <div style={{ fontSize: '20px' }}>查看消息</div>
                        <div className={styles.btnBox}>
                          <Button icon="sync" onClick={this.reloadMessageInfo} />
                          <Popconfirm
                            placement="bottom"
                            title='确认删除这条消息吗？'
                            onConfirm={this.handleDelete}
                            okText="确定"
                            cancelText="取消"
                          >
                            <Button icon="delete" />
                          </Popconfirm>
                          <Button icon="rollback" onClick={this.changeMessage}>
                            返回列表
                          </Button>
                        </div>
                      </div>
                      <Divider style={{ borderWidth: '2px 0 0' }} />
                      <div className={styles.navTitle}>
                        <Row type="flex" justify="start" align="bottom" className={styles.title}>
                          标题：<span>{messageContent && messageContent.title}</span>
                        </Row>
                        <Row>
                          <Col xl={12} lg={24}>
                            发件人：{messageContent &&messageContent.sendUserName}
                          </Col>
                          <Col xl={12} lg={0} style={{ textAlign: 'end' }}>
                            {`${time && time.format('YYYY年MM月DD日（dddd）A HH:mm')}`}
                          </Col>
                          <Col xl={0} lg={24}>
                            {`${time && time.format('YYYY年MM月DD日（dddd）A HH:mm')}`}
                          </Col>
                        </Row>
                      </div>
                      <Divider style={{ borderWidth: '2px 0 0' }} />
                      <div className={styles.messageContent}>
                        {messageContent && messageContent.content}
                      </div>
                    </div>
                  </Skeleton>
                </Card>
              )
            }
          </Col>
        </Row>
        {
          visibleInfo && (
            <Modal
              title="编辑个人信息"
              width='calc(50%)'
              visible={visibleInfo}
              maskClosable={false}
              confirmLoading={loading.effects['info/postMessage']}
              onOk={this.submit}
              onCancel={this.handleCancel}
            >
              <ChangeInfo
                wrappedComponentRef={(form) => {
                  this.child = form;
                  return form;
                }}
              />
            </Modal>
          )
        }
        {
          visiblePwd && (
            <Modal
              title="修改密码"
              width='calc(50%)'
              visible={visiblePwd}
              maskClosable={false}
              confirmLoading={loading.effects['info/changePwd']}
              onOk={this.changePwd}
              onCancel={this.handleCancel}
            >
              <ChangePassword
                wrappedComponentRef={(form) => {
                  this.otherChild = form;
                  return form;
                }}
              />
            </Modal>
          )
        }
      </PageHeaderWrapper>
    );
  }
}

AccountInfo.propTypes = {
  info: PropTypes.exact({
    userInfo: PropTypes.object,
    messageList: PropTypes.array,
    messageContent: PropTypes.object,
    messageListTotal: PropTypes.number
  }),
}
AccountInfo.defaultProps = {
  info: {
    userInfo: {},
    messageList: [],
    messageContent: {},
    messageListTotal: 0
  }
}

export default AccountInfo;

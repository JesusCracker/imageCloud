import React, { PureComponent } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Menu, message,
  Modal,
  Popover,
  Row,
  Select,
  Table,
  Tooltip,
  TreeSelect,
  Empty,
} from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getLastTime } from '@/utils/utils';
import styles from './SystemInformation.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@connect(({ sendInformation, loading }) => ({
  viewAllRoles: loading.effects['sendInformation/viewAllRoles'],
  templateLoading: loading.effects['sendInformation/queryMessageTemplate'],
  sendInformation,
}))
@Form.create()

class SendMessage extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      template: '',
      templateVisible: false,
      userName: JSON.parse(localStorage.getItem('name')),
      userID: localStorage.getItem('id'),
    };
  }

  // eslint-disable-next-line no-unused-vars
  componentWillReceiveProps(nextProps, nextContext) {
    if (!nextProps.showMessage) {
      this.setState({ template: '' });
    }
  }

  confirmHandle = () => {
    const { form, addMessage } = this.props;
    const { userName, userID } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { title, content, type, orderBy } = fieldsValue;

      const labels = orderBy.map(item => item.label);
      const values = orderBy.map(item => item.value);

      const params = {
        type,
        // createDate: time.format('YYYY-MM-DD'),
        title,
        content,
        recipientId: values,
        recipientNames: labels.join(),
        sendUserId: userID,
        sendUserName: userName,
      };
      addMessage(params);
    });
  };

  addTemplate = (e) => {
    const { template } = this.state;
    this.setState({ template: template + e.target.text, templateVisible: false });
  };

  handleVisibleChange = visible => {
    if (visible) {
      const { dispatch } = this.props;
      const payload = {
        limit: 10,
        page: 1,
        isTemplate: 1,
      };
      dispatch({
        type: 'sendInformation/queryMessageTemplate',
        payload,
      }).then(res => {
        if (res?.status === 1) {
          this.setState({ templateVisible: visible });
        }
      });
    } else {
      this.setState({ templateVisible: visible });
    }
  };

  onChangeMessage = (e) => {
    this.setState({ template: e.target.value });
  };

  saveTemplate = () => {
    const { template, userName, userID } = this.state;
    if (!template) {
      message.error('请输入消息内容后保存模板');
      return;
    }
    const { dispatch } = this.props;
    const payload = {
      content: template,
      sendUserId: userID,
      sendUserName: userName,
      isTemplate: 1,
    };
    dispatch({
      type: 'sendInformation/sendInformation',
      payload,
    });
  };

  render() {
    const { form, showMessage, hideSendMessage, loading, templateLoading, sendInformation: { treeData, templateData } } = this.props;
    const { template, templateVisible, userName } = this.state;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
    };

    const content = templateData.length ? (
      <div className={styles.messageWrap}>
        {templateData.map(item => (
          <a className={styles.message} onClick={this.addTemplate}>{item.content}</a>
        ))}
      </div>
    ) : (
      <Empty description="暂无模板" image={Empty.PRESENTED_IMAGE_SIMPLE} />
    );

    const tProps = {
      treeData,
      showSearch: true,
      treeCheckable: true,
      labelInValue: true,
      treeNodeFilterProp: 'title',
      searchPlaceholder: '请选择接收人',
      style: {
        width: '100%',
      },
    };

    // 新建菜单需要填的表单
    const menuForm = (
      <Form>
        <FormItem {...formItemLayout} label="发送人">
          {userName}
        </FormItem>
        <FormItem {...formItemLayout} label="消息类型">
          {form.getFieldDecorator('type', {
            rules: [{ required: true, message: '请选择消息类型！' }],
          })(
            <Select placeholder="请选择消息类型">
              <Option value="1">公开消息</Option>
              <Option value="2">私发消息</Option>
            </Select>,
          )}
        </FormItem>
        {/*<FormItem {...formItemLayout} label="发送时间">*/}
        {/*  {form.getFieldDecorator('time', {*/}
        {/*    rules: [{ required: true, message: '请选择发送时间!' }],*/}
        {/*  })(*/}
        {/*    <DatePicker placeholder="发送时间" format="YYYY-MM-DD" style={{ width: '100%' }}/>,*/}
        {/*  )}*/}
        {/*</FormItem>*/}
        <FormItem {...formItemLayout} label="标题">
          {form.getFieldDecorator('title', {
            rules: [{ required: true, message: '请输入标题!' }],
          })(<Input placeholder="请输入标题" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="消息内容">
          {form.getFieldDecorator('content', {
            rules: [{ required: true, message: '请输入消息内容!' }],
          })(
            <div>
              <Row>
                <Col span={4} offset={10}>
                  <Popover
                    content={content}
                    trigger="click"
                    placement="bottomLeft"
                    visible={templateVisible}
                    onVisibleChange={this.handleVisibleChange}
                  >
                    <Button type="link" loading={templateLoading}>+插入模板</Button>
                  </Popover>
                </Col>
                <Col span={4} offset={4}>
                  <Button type="link" onClick={this.saveTemplate}>存为模板</Button>
                </Col>
              </Row>
              <Row>
                <TextArea
                  placeholder="请输入消息内容"
                  autoSize={{ minRows: 3 }}
                  value={template}
                  onChange={this.onChangeMessage}
                />
              </Row>
            </div>,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="接收人">
          {form.getFieldDecorator('orderBy', {
            rules: [{ required: true, message: '请选择接收人!', type: 'array' }],
          })(<TreeSelect {...tProps} />)}
        </FormItem>
      </Form>
    );
    return (
      <Modal
        maskClosable={false}
        destroyOnClose
        title='发送消息'
        visible={showMessage}
        onOk={this.confirmHandle}
        onCancel={() => hideSendMessage()}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading}
      >
        {menuForm}
      </Modal>
    );
  }
}


@connect(({ sendInformation }) => ({
  sendInformation,
}))
@Form.create()
class ViewMessage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { showViewMessage, hideViewMessage, sendInformation: { watchData } } = this.props;
    const { sendUserName, createDate, title, content, treeData, selectTree } = watchData;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
    };

    const tProps = {
      treeData,
      value: selectTree,
      disabled: true,
      showSearch: true,
      treeCheckable: true,
      treeNodeFilterProp: 'title',
      style: {
        width: '100%',
      },
    };
    // 新建菜单需要填的表单
    const menuForm = (
      <Form>
        <FormItem {...formItemLayout} label="发送人">
          {sendUserName}
        </FormItem>
        <FormItem {...formItemLayout} label="发送时间">
          <Input value={getLastTime(createDate)} disabled />
        </FormItem>
        <FormItem {...formItemLayout} label="标题">
          <Input value={title} disabled />
        </FormItem>
        <FormItem {...formItemLayout} label="消息内容">
          <TextArea
            disabled
            autoSize={{ minRows: 3 }}
            value={content}
          />
        </FormItem>
        <FormItem {...formItemLayout} label="接收人">
          <TreeSelect {...tProps} />
        </FormItem>
      </Form>
    );
    return (
      <Modal
        destroyOnClose
        title='查看消息'
        visible={showViewMessage}
        footer={null}
        onCancel={() => hideViewMessage()}
      >
        {menuForm}
      </Modal>
    );
  }
}

@connect(({ information, loading }) => ({
  information,
  loadingList: loading.effects['information/informationList'],
  btnLoading: loading.effects['information/deleteInformationList'],
}))
@Form.create()

class systemInformation extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '编号',
        dataIndex: 'id',
      },
      {
        title: '发件人',
        dataIndex: 'sendUserName',
      },
      {
        title: '消息提醒',
        dataIndex: 'title',
      },
      {
        title: '消息内容',
        dataIndex: 'content',
      },
      {
        title: '时间',
        dataIndex: 'createDate',
        // render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        render: text => getLastTime(text),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => (
          <span>
            <Col span={8}>
              <a onClick={() => this.watch(record)}>查看</a>
            </Col>
            <Col span={8} offset={2}>
              <a style={{ color: 'red' }} onClick={() => this.delete(record.id)}>删除</a>
            </Col>
          </span>
        ),
      },

    ];

    this.state = {
      params: {
        page: 1,
        limit: 10,
      },
      currentMenu: 'informationList',
      selectedRowKeys: [],
      showSendMessage: false,
      showViewMessage: false,
    };
  }

  componentDidMount() {
    const { params } = this.state;
    this.fetchList(params);
  }

  // 操作 查看
  watch = (data) => {
    const { dispatch } = this.props;
    // 先加载一次列表内的数据
    dispatch({
      type: 'sendInformation/viewLocalInformation',
      payload: {data},
    })
    dispatch({
      type: 'sendInformation/viewInformation',
      payload: data.id,
    })
    this.setState({ showViewMessage: true });
  };

  // 操作 删除
  delete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'information/deleteInformationList',
      payload: [id],
    }).then(res => {
      if (res?.status === 1) {
        const { params } = this.state;
        this.fetchList(params);
      }
    });
  };

  // 请求列表
  fetchList = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'information/informationList',
      payload: { ...params, isTemplate: 0 },
    });
  };

  // 翻页
  changePage = (page) => {
    const { params: { limit } } = this.state;
    this.setState({
      params: {
        page,
        limit,
      },
    });
    this.fetchList({ page, limit });
  };

  // 改变每页显示条数
  onShowSizeChange = (currentPage, limit) => {
    this.setState({
      params: {
        page: 1,
        limit,
      },
    });
    this.fetchList({ page: 1, limit });
  };

  // 查询
  searchSubmit = (e) => {
    e.preventDefault();
    const { params: { limit } } = this.state;
    const { form: { getFieldValue } } = this.props;
    this.fetchList({ page: 1, limit, searchData: getFieldValue('name') });
  };

  // 重置
  resetFields = () => {
    const { form } = this.props;
    form.resetFields();
    // 请求
    const { params: { limit } } = this.state;

    this.fetchList({ page: 1, limit });
    this.setState({
      params: {
        page: 1,
        limit,
      },
    });
  };

  // 删除
  deleteInformation = () => {
    const { selectedRowKeys } = this.state;
    if (!selectedRowKeys.length) return;

    const { dispatch } = this.props;
    dispatch({
      type: 'information/deleteInformationList',
      payload: selectedRowKeys,
    }).then(res => {
      if (res?.status === 1) {
        this.setState({
          selectedRowKeys: [],
        });
        const { params } = this.state;
        this.fetchList(params);
      }
    });
  };

  // 隐藏发送消息
  hideSendMessage = () => {
    this.setState({
      showSendMessage: false,
    });
  };

  // 显示发送消息
  showSendMessage = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sendInformation/viewAllRoles',
    });
    this.setState({ showSendMessage: true });
  };

  // 发送消息
  addMessage = (fieldsValue) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sendInformation/sendInformation',
      payload: fieldsValue,
    }).then(res => {
      if (res?.status === 1) {
        message.success('发送成功');
        this.hideSendMessage();
        const { params: { limit } } = this.state;
        this.fetchList({ page: 1, limit });
      }
    });
  };

  // 隐藏显示消息
  hideViewMessage = () => {
    this.setState({
      showViewMessage: false,
    });
  };

  render() {
    const { information: { data, dataTotal }, loadingList, form, btnLoading } = this.props;
    const { params: { page }, currentMenu, selectedRowKeys, showSendMessage, showViewMessage } = this.state;
    const { getFieldDecorator } = form;
    const paginationProps = {
      showSizeChanger: true,
      onShowSizeChange: this.onShowSizeChange,
      showQuickJumper: true,
      onChange: this.changePage,
      current: page,
      total: dataTotal,
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: (currentSelectedRowKeys) => {
        this.setState({ selectedRowKeys: currentSelectedRowKeys });
      },
    };

    return (
      <PageHeaderWrapper title="">
        <Card>
          <Menu selectedKeys={[currentMenu]} mode="horizontal">
            <Menu.Item key="informationList">
              消息列表
            </Menu.Item>
          </Menu>

          <Form onSubmit={this.searchSubmit} className="login-form" layout="inline" style={{ marginTop: 20 }}>
            <FormItem>
              {getFieldDecorator('name', {})(
                <Input placeholder="搜索消息标题、正文等" style={{ width: 240 }} />,
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button">
                查询
              </Button>
            </FormItem>
            <FormItem>
              <Tooltip title="重置">
                <Button icon="reload" type="primary" onClick={() => this.resetFields()} />
              </Tooltip>
            </FormItem>
            <FormItem>
              <Tooltip title="删除">
                <Button icon="delete" type="primary" onClick={() => this.deleteInformation()} loading={btnLoading} />
              </Tooltip>
            </FormItem>
          </Form>

          <Button
            icon="plus-circle"
            type="primary"
            onClick={this.showSendMessage}
            style={{ marginTop: 20 }}
          >发送消息
          </Button>

          <SendMessage
            showMessage={showSendMessage}
            hideSendMessage={this.hideSendMessage}
            addMessage={this.addMessage}
          />
          <ViewMessage showViewMessage={showViewMessage} hideViewMessage={this.hideViewMessage} />

          <Table
            rowSelection={rowSelection}
            style={{ marginTop: 20 }}
            loading={loadingList || btnLoading}
            dataSource={data}
            columns={this.columns}
            rowKey={rowKey => rowKey.id}
            // onChange={this.handleTableChange}
            pagination={paginationProps}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

systemInformation.propTypes = {
  // information: PropTypes.arrayOf(PropTypes.shape({
  //   id: PropTypes.number,
  //   sender: PropTypes.string,
  // })),
};

export default systemInformation;

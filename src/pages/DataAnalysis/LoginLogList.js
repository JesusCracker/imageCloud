import React, { PureComponent } from 'react';
import { Table, Card, DatePicker, Input, Form, Button, Tooltip } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import PropTypes from 'prop-types';

@connect(({ loginLog, loading }) => ({
  loginLog,
  loading: loading.models.loginLog,
}))

class loginLogList extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '性别',
        dataIndex: 'sex',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
      },
      {
        title: '最近登录时间',
        dataIndex: 'lastloginDate',
        render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
        sorter: (a, b) => moment(a.lastloginDate).valueOf() - moment(b.lastloginDate).valueOf(),
      },
      {
        title: '最近登录地址',
        dataIndex: 'lastAddress',
      },
      {
        title: '最近登录IP',
        dataIndex: 'lastIp',
      },
    ];

    this.state = {
      params: {
        page: 1,
        limit: 10,
      },
    };
  }

  componentDidMount() {
    const { params } = this.state;

    this.fetchList(params);
  }

  // 请求列表
  fetchList = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'loginLog/loginLog',
      payload: params,
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

    const { form: { validateFields } } = this.props;
    validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const { keywords } = fieldsValue;
      const date = fieldsValue.loginDate?.format('YYYY-MM-DD');
      this.fetchList({
        page: 1,
        limit,
        date,
        keywords,
      });
    });
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

  render() {
    const { loginLog, loading, form } = this.props;
    const { params: { page } } = this.state;
    const { getFieldDecorator } = form;

    const { data: { data, dataTotal } } = loginLog;
    const paginationProps = {
      showSizeChanger: true,
      onShowSizeChange: this.onShowSizeChange,
      showQuickJumper: true,
      onChange: this.changePage,
      current: page,
      total: dataTotal,
    };

    return (
      <PageHeaderWrapper title="">
        <Card>
          <Form onSubmit={this.searchSubmit} className="login-form" layout="inline">
            <Form.Item>
              {getFieldDecorator('loginDate', {})(
                <DatePicker placeholder="登录时间" style={{ width: 240 }} format="YYYY-MM-DD" />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('keywords', {})(
                <Input placeholder="查询姓名/手机号" style={{ width: 240 }} />,
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                查询
              </Button>
            </Form.Item>
            <Form.Item>
              <Tooltip title="重置">
                <Button icon="reload" type="primary" onClick={() => this.resetFields()} />
              </Tooltip>
            </Form.Item>
          </Form>

          <Table
            style={{ marginTop: 20 }}
            loading={loading}
            dataSource={data}
            columns={this.columns}
            rowKey={rowData => rowData.id}
            onChange={this.handleTableChange}
            pagination={paginationProps}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

loginLogList.propTypes = {
  loginLog: PropTypes.exact({
    data: PropTypes.object
  }),
};
loginLogList.defaultProps = {
  loginLog: {
    data: {
      data: [],
      dataTotal: 0
    }
  },
};

export default Form.create()(loginLogList);

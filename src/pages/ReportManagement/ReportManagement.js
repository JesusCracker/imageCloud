import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Table,
  Tabs,
  DatePicker, message, Modal,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import styles from './ReportManagement.less';
import ReportCard from '@/components/ViewReportComponent';

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

@connect(({ report, loading }) => ({
  report,
  loading,
}))
@Form.create()
class ReportManagement extends PureComponent {
  state = {
    currentTabKey: '1',
    selectedRowKeys: [],
    pageData: {
      current: 1,
      pageSize: 10,
    },
    reportInfoModal: false
  };

  columns = [
    {
      title: '编号',
      dataIndex: 'orId',
      key: 'orId',
      align: 'center',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      align: 'center',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      align: 'center',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: '民族',
      dataIndex: 'nation',
      key: 'nation',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'phoneNum',
      key: 'phoneNum',
      align: 'center',
    },
    {
      title: '联系地址',
      dataIndex: 'location',
      key: 'location',
      align: 'center',
    },
    {
      title: '筛查机构',
      dataIndex: 'screenInstitutionName',
      key: 'screenInstitutionName',
      align: 'center',
    },
    {
      title: '检查时间',
      dataIndex: 'examinationDate',
      key: 'examinationDate',
      align: 'center',
      sorter: ((a, b) => moment(b) > moment(a) ? -1 : 1),
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '开始阅片时间',
      dataIndex: 'doctorStartDate',
      key: 'doctorStartDate',
      align: 'center',
      sorter: ((a, b) => moment(b) > moment(a) ? -1 : 1),
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '结束阅片时间',
      dataIndex: 'reportDate',
      key: 'reportDate',
      align: 'center',
      sorter: ((a, b) => moment(b) > moment(a) ? -1 : 1),
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'BI-RADS分级',
      dataIndex: 'biRads',
      key: 'biRads',
      align: 'center',
      sorter: (a, b) => a.level - b.level,
    },
    {
      title: '阅片医生',
      dataIndex: 'doctorName',
      key: 'doctorName',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      render: (text, row) => {
        const { currentTabKey } = this.state;
        return (
          <Fragment>
            <Button type="link" onClick={() => this.getReportInfo(row)}>查看报告</Button>
            <Button type="link" onClick={() => this.handleUpdateModalVisible(row)}>查看读图</Button>
            {
              currentTabKey === '1' && <Button type="link" onClick={() => this.pushReport(row)}>推送报告</Button>
            }
          </Fragment>
        );
      },
    },
  ];

  layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };

  assistantAI = ['0', '1', '2', '3', '4', '5'];

  componentDidMount() {
    const { dispatch } = this.props;
    // 获取机构详情
    dispatch({
      type: 'report/getInstitutionList',
    });
    // 请求列表数据
    this.initListData('1');
  };

  // 初始化列表数据
  initListData = (currentTab = '1', page = 1, limit = 10) => {
    const { dispatch, form } = this.props;
    const { getFieldsValue } = form;
    const { date, ...params } = getFieldsValue(['aiPicture', 'biRads', 'examInstitutionId', 'date', 'searchs']);
    params.reportDateBegin = date && moment.isMoment(date[0]) ? date[0].format('YYYY-MM-DD') : '';
    params.reportDateEnd = date && moment.isMoment(date[1]) ? date[1].format('YYYY-MM-DD') : '';
    params.auditStatus = '1';
    params.currentUserId = localStorage.getItem('id');
    params.limit = limit;
    params.type = currentTab;
    params.page = page;
    dispatch({
      type: 'report/getReportManagementList',
      payload: params,
    });
  };

  // 表格选择多行
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  // 处理重置按钮
  handleFormReset = () => {
    const { form } = this.props;
    const { currentTabKey } = this.state;
    form.resetFields();
    this.initListData(currentTabKey);
  };

  getReportInfo = (row) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/getReportInfo',
      payload: row.id
    });
    dispatch({
      type: 'report/getInstitutionLogo',
      payload: row.examinationAddress
    }).then(res => {
      if(!res || res.status !== 1) {
        message.error('logo加载失败');
      }
    });
    this.setState({
      reportInfoModal: true
    });
  }

  // 点击查询按钮
  handleSearch = e => {
    const { currentTabKey } = this.props;
    e.preventDefault();
    this.initListData(currentTabKey);
  };

  // 点击分页
  handlePageChange = (page) => {
    const { form, dispatch } = this.props;
    const { currentTabKey } = this.state;
    const { date, ...params } = form.getFieldsValue(['aiPicture', 'biRads', 'examInstitutionId', 'date', 'searches']);
    this.setState({
      pageData: {
        current: page.current,
        pageSize: page.pageSize,
      },
    });
    params.reportDateBegin = date && moment.isMoment(date[0]) ? date[0].format('YYYY-MM-DD') : '';
    params.reportDateEnd = date && moment.isMoment(date[1]) ? date[1].format('YYYY-MM-DD') : '';
    params.limit = page.pageSize || 10;
    params.page = page.current || 1;
    params.type = currentTabKey;
    params.auditStatus = '1';
    params.currentUserId = localStorage.getItem('id');
    dispatch({
      type: 'report/getReportManagementList',
      payload: params,
    });
  };

  // 显示对话框
  handleUpdateModalVisible = (row) => {
    this.setState({
      selectedRowKeys: [row.id],
    });
  };

  // 切换Tabs
  handleTabChange = (key) => {
    const { form } = this.props;
    this.setState({
      currentTabKey: key,
    });
    form.resetFields();
    this.initListData(key);
  };

  // 推送报告
  pushReport = (row) => {
    const { dispatch } = this.props;
    const { currentTabKey, pageData } = this.state;
    const hide = message.loading('正在推送中...', 0)
    dispatch({
      type: 'report/pushReport',
      payload: row,
    }).then(res => {
      if (res && res.status === 1) {
        hide();
        message.success('推送成功');
        this.initListData(currentTabKey, pageData.current, pageData.pageSize);
      } else {
        hide();
        message.error('推送失败');
      }
    });
  };

  // 表格上方表单
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      report,
    } = this.props;
    const { selectedRowKeys, currentTabKey } = this.state;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={{ lg: 8 }}>
          <Col xl={6} lg={24}>
            <FormItem>
              {getFieldDecorator('biRads')(
                <Select placeholder="请选择BI-RADS分级" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  {
                    this.assistantAI.map(item => (<Option key={item} value={item}>{item}级</Option>))
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xl={6} lg={24}>
            <FormItem>
              {getFieldDecorator('examInstitutionId')(
                <Select placeholder="请选择筛查机构" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  {
                    report.institutionList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xl={6} lg={24}>
            <FormItem>
              {getFieldDecorator('aiPicture')(
                <Select placeholder="请选择AI辅助" style={{ width: '100%' }}>
                  <Option value="">辅助诊断</Option>
                  <Option value="1">辅助诊断存在病灶</Option>
                  <Option value="2">辅助诊断不存在病灶</Option>
                  <Option value="3">辅助诊断未进行</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xl={6} lg={24}>
            <Form.Item>
              {getFieldDecorator('date')(
                <RangePicker
                  style={{ width: '100%' }}
                  format="YYYY/MM/DD"
                  placeholder="请选择筛查时间"
                  disabledDate={(current) => current && current > moment().endOf('day')}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ lg: 8 }}>
          <Col xl={6} lg={24}>
            <FormItem>
              {getFieldDecorator('searchs')(<Input style={{ width: '100%' }} placeholder="编号、姓名、身份证或阅片医生" />)}
            </FormItem>
          </Col>
          <Col xl={6} lg={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
        {
          currentTabKey === '1' && (
            <Row gutter={{ lg: 8 }}>
              <Col xl={6} lg={24}>
                <Button
                  icon="plus-circle"
                  type="primary"
                  style={{ marginBottom: '25px' }}
                  disabled={!selectedRowKeys.length}
                >
                  发送短信
                </Button>
              </Col>
            </Row>
          )
        }
      </Form>
    );
  };

  // 渲染表格
  renderTable() {
    const {
      report,
      loading,
    } = this.props;
    const { listData } = report;
    const { selectedRowKeys } = this.state;
    return (
      <div>
        <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
        <Table
          bordered
          loading={loading.effects['report/getReportManagementList']}
          className={styles.tableList}
          rowSelection={{ selectedRowKeys, onChange: this.onSelectChange }}
          dataSource={listData.data}
          columns={this.columns}
          rowKey={row => row.id}
          scroll={{ x: 'max-content' }}
          onChange={this.handlePageChange}
          pagination={{ total: listData.dataTotal, showQuickJumper: true, showSizeChanger: true }}
        />
      </div>
    );
  }

  // 渲染表格
  render() {
    const { loading, report } = this.props;
    const { currentTabKey, reportInfoModal } = this.state;
    const { reportInfo, institutionLogo } = report;
    return (
      <PageHeaderWrapper title="审批管理">
        <Card bordered={false}>
          <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
            <TabPane tab="筛查报告" key="1">
              {
                currentTabKey === '1' && (
                  this.renderTable()
                )
              }
            </TabPane>
            <TabPane tab="科研报告" key="2">
              {
                currentTabKey === '2' && (
                  this.renderTable()
                )
              }
            </TabPane>
          </Tabs>
        </Card>
        <Modal
          width='50%'
          visible={reportInfoModal}
          footer={null}
          onCancel={() => {
            this.setState({
              reportInfoModal: false
            })
          }}
        >
          <ReportCard
            loading={loading.effects['report/getReportInfo']}
            reportInfo={reportInfo}
            institutionLogo={institutionLogo}
          />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

ReportManagement.propTypes = {
  report: PropTypes.exact({
    listData: PropTypes.exact({
      data: PropTypes.array,
      dataTotal: PropTypes.number
    }),
    institutionList: PropTypes.array
  })
}

ReportManagement.defaultProps = {
  report: {
    listData: {
      data: [],
      dataTotal: 0
    },
    institutionList: []
  }
}


export default ReportManagement;

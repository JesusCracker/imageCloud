import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
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
  Modal,
  DatePicker,
  Radio, message,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ReportCard from '@/components/ViewReportComponent';
import moment from 'moment';
import PropTypes from 'prop-types';
import styles from './ApprovalManagement.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

@connect(({ approval, loading }) => ({
  approval,
  loading,
}))
@Form.create()
class ApprovalManagement extends PureComponent {
  state = {
    // 页面中可以操控的变量
    updateModalVisible: false, // 审批阅片
    reportInfoModal: false,// 查看报告
    currentTabKey: '1',
    selectedRowKeys: [],
    confirmLoading: false
  };

  columns = [
    {
      title: '编号',
      dataIndex: 'orId',
      key: 'orId',
      align: 'center',
      sorter: (a, b) => a.id - b.id,
      render: text => text || ''
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: text => text || ''
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      align: 'center',
      render: text => text || ''
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      align: 'center',
      sorter: (a, b) => a.age - b.age,
      render: text => text || ''
    },
    {
      title: '民族',
      dataIndex: 'nation',
      key: 'nation',
      align: 'center',
      render: text => text || ''
    },
    {
      title: '手机号',
      dataIndex: 'phoneNum',
      key: 'phoneNum',
      align: 'center',
      render: text => text || ''
    },
    {
      title: '联系地址',
      dataIndex: 'location',
      key: 'location',
      align: 'center',
      render: text => text || ''
    },
    {
      title: '筛查机构',
      dataIndex: 'screenInstitutionName',
      key: 'screenInstitutionName',
      align: 'center',
      render: text => text || ''
    },
    {
      title: '检查时间',
      dataIndex: 'examinationDate',
      key: 'examinationDate',
      align: 'center',
      sorter: ((a, b) => moment(b) > moment(a) ? -1 : 1),
      render: (text) => moment.isMoment(moment(text)) ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    {
      title: '开始阅片时间',
      dataIndex: 'doctorStartDate',
      key: 'doctorStartDate',
      align: 'center',
      sorter: ((a, b) => moment(b) > moment(a) ? -1 : 1),
      render: (text) => moment.isMoment(moment(text)) ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    {
      title: '结束阅片时间',
      dataIndex: 'reportDate',
      key: 'reportDate',
      align: 'center',
      sorter: ((a, b) => moment(b) > moment(a) ? -1 : 1),
      render: (text) => moment.isMoment(moment(text)) ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    {
      title: 'BI-RADS分级',
      dataIndex: 'biRads',
      key: 'biRads',
      align: 'center',
      sorter: (a, b) => a.level - b.level,
      render: text => text || ''
    },
    {
      title: '阅片医生',
      dataIndex: 'doctorName',
      key: 'doctorName',
      align: 'center',
      render: text => text || ''
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
            {
              currentTabKey === '0' && (
                <Fragment>
                  <Button type="link" onClick={() => this.handleUpdateModalVisible(row)}>审批</Button>
                  <Button type="link">读图</Button>
                </Fragment>
              )
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
      type: 'approval/getInstitutionList',
    });
    dispatch({
      type: 'approval/getApprovalNum',
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
    params.auditStatus = currentTab;
    params.currentUserId = localStorage.getItem('id');
    params.limit = limit;
    params.type = 1;
    params.page = page;
    dispatch({
      type: 'approval/getApprovalManagementList',
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
      type: 'approval/getReportInfo',
      payload: row.id
    });
    dispatch({
      type: 'approval/getInstitutionLogo',
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
    params.reportDateBegin = date && moment.isMoment(date[0]) ? date[0].format('YYYY-MM-DD') : '';
    params.reportDateEnd = date && moment.isMoment(date[1]) ? date[1].format('YYYY-MM-DD') : '';
    params.limit = page.pageSize || 10;
    params.page = page.current || 1;
    params.type = 1;
    params.auditStatus = currentTabKey;
    params.currentUserId = localStorage.getItem('id');
    dispatch({
      type: 'approval/getApprovalManagementList',
      payload: params,
    });
  };

  // 显示对话框
  handleUpdateModalVisible = (row) => {
    this.setState({
      updateModalVisible: true,
      selectedRowKeys: [row.orId],
    });
  };

  // 提交审批意见
  submitOpinion = () => {
    const { selectedRowKeys, currentTabKey } = this.state;
    const { form, dispatch } = this.props;
    const { getFieldsValue, validateFields } = form;
    validateFields(['auditComment', 'auditStatus'], (err) => {
      if (!err) {
        const params = getFieldsValue(['auditComment', 'auditStatus']);
        params.reportIds = selectedRowKeys;
        this.setState({
          confirmLoading: true
        })
        dispatch({
          type: 'approval/postOpinion',
          payload: params,
        }).then(res => {
          if (res && res.status === 1) {
            message.success('修改成功');
            this.setState({
              confirmLoading: false,
              updateModalVisible: false,
              selectedRowKeys: [],
            });
            this.initListData(currentTabKey);
          }
        });
      }
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

  // 表格上方表单
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      approval,
    } = this.props;
    const { selectedRowKeys } = this.state;
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
                    approval.institutionList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
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
                <RangePicker style={{ width: '100%' }} format="YYYY/MM/DD" placeholder="请选择筛查时间" disabledDate={(current) => current && current > moment().endOf('day')} />,
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
        <Row gutter={{ lg: 8 }}>
          <Col xl={6} lg={24}>
            <Button
              icon="plus-circle"
              type="primary"
              style={{ marginBottom: '25px' }}
              disabled={!selectedRowKeys.length}
              onClick={() => {
                this.setState({
                  updateModalVisible: true,
                });
              }}
            >
              批量审批
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  // 渲染表格
  renderTable() {
    const {
      approval,
      loading,
    } = this.props;
    const { listData } = approval;
    const { selectedRowKeys } = this.state;
    return (
      <div>
        <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
        <Table
          bordered
          loading={loading.effects['approval/getApprovalManagementList']}
          className={styles.tableList}
          rowSelection={{ selectedRowKeys, onChange: this.onSelectChange }}
          dataSource={listData.data}
          columns={this.columns}
          rowKey={row => row.id}
          onChange={this.handlePageChange}
          scroll={{x: 'max-content'}}
          pagination={{ total: listData.dataTotal, showQuickJumper: true, showSizeChanger: true  }}
        />
      </div>
    );
  }

  // 渲染表格
  render() {
    const {
      form: { getFieldDecorator },
      approval,
      loading,
    } = this.props;
    const { count, reportInfo, institutionLogo } = approval;
    const { updateModalVisible, reportInfoModal, currentTabKey, confirmLoading } = this.state;

    return (
      <PageHeaderWrapper title="审批管理">
        <Card bordered={false}>
          <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
            <TabPane tab={`未审批（${count.noApprovalNum}）`} key="0">
              {
                currentTabKey === '0' && (
                  this.renderTable()
                )
              }
            </TabPane>
            <TabPane tab={`已通过（${count.passedNum}）`} key="1">
              {
                currentTabKey === '1' && (
                  this.renderTable()
                )
              }
            </TabPane>
            <TabPane tab={`已驳回（${count.rejectedNum}）`} key="2">
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
          bodyStyle={{ padding: '20px 40px' }}
          destroyOnClose
          title="审批阅片"
          visible={updateModalVisible}
          confirmLoading={confirmLoading}
          onOk={this.submitOpinion}
          onCancel={() => {
            this.setState({
              updateModalVisible: false,
            });
          }}
        >
          <Form {...this.layout}>
            <FormItem label="审批意见">
              {getFieldDecorator('auditComment')(
                <TextArea
                  rows={4}
                />,
              )}
            </FormItem>
            <FormItem label="操作">
              {getFieldDecorator('auditStatus', {
                rules: [{ required: true, message: '请选择结果' }],
              })(
                <RadioGroup>
                  <Radio value="1">通过</Radio>
                  <Radio value="2">驳回</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          </Form>
        </Modal>
        {
          reportInfoModal && (
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
                loading={loading.effects['approval/getReportInfo']}
                reportInfo={reportInfo}
                institutionLogo={institutionLogo}
              />
            </Modal>
          )
        }
      </PageHeaderWrapper>
    );
  }
}

ApprovalManagement.propTypes = {
  approval: PropTypes.exact({
    listData: PropTypes.object,
    total: PropTypes.number,
    institutionList: PropTypes.array,
    count: PropTypes.exact({
      noApprovalNum: PropTypes.number,
      passedNum: PropTypes.number,
      rejectedNum: PropTypes.number,
    }),
  }),
};
ApprovalManagement.defaultProps = {
  approval: {
    listData: {},
    total: 0,
    institutionList: [],
    count: {
      noApprovalNum: 0,
      passedNum: 0,
      rejectedNum: 0,
    },
  },
};

export default ApprovalManagement;

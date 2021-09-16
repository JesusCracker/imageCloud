import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Divider,
  Button,
  Table,
  message,
  Modal,
  Checkbox,
  DatePicker,
} from 'antd';
import ViewReportComponent from '@/components/ViewReportComponent/index'
import styles from './ScientificScreeningList.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ scientReading, loading }) => ({
  loading: loading.models.scientReading,
  scientReading,
}))
@Form.create()
class CheckReport extends PureComponent {
  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const {
      reportStaus,
      currentReport,
      handleReport,
      scientReading: { institutionLogo }
    } = this.props;
    return (
      <Modal
        maskClosable={false}
        destroyOnClose
        width='50%'
        visible={reportStaus}
        footer={null}
        onCancel={() => handleReport()}
      >
        <ViewReportComponent reportInfo={currentReport.data} institutionLog={institutionLogo} loading={false} />
      </Modal>
    );
  }
}

@connect(({ scientReading, loading }) => ({
  scientReading,
  loading: loading.models.scientReading,
}))
@Form.create()
class ScientificList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      reportStaus: false,
      paginationLimt: {
        limit: 10,
        page: 1,
        type: 2,
        status: props.tabsChangeKey
      }
    }
  }

  //页面初始化
  componentDidMount() {
    const { paginationLimt } = this.state;
    const { status } = paginationLimt;
    if (status === '3') {
      this.query(paginationLimt);
    } else {
      this.queryLete(paginationLimt);
    }
    this.queryAddress();
  }

  //改变分页
  handleTableChange = (current) => {
    const { paginationLimt } = this.state;
    const { limit, status, type } = paginationLimt
    const newpagination = {
      page: current,
      limit,
      type,
      status,
    };
    if (status === '3') {
      this.query(newpagination)
    } else {
      this.queryLete(newpagination)
    }
  };

  handleTableChangePageSize = (current, pageSize) => {
    const { paginationLimt } = this.state;
    const { page, status, type } = paginationLimt
    const newParams = {
      page,
      limit: pageSize,
      type,
      status,
    };
    if (status === '3') {
      this.query(newParams)
    } else {
      this.queryLete(newParams)
    }
  };

  //请求筛选地址
  queryAddress = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'scientReading/fetchAddressList',
    })
  };

  //请求全部
  query = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'scientReading/fetchWaitReadingList',
      payload: {
        ...data
      },
    })
  }

  //请求读图中,已完成
  queryLete = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'scientReading/fetchWaitingReadingList',
      payload: {
        ...data
      },
    })
  }

  //点击删除按钮
  handleDeleteConfirm = record => {
    const { paginationLimt } = this.state;
    const { status } = paginationLimt;
    Modal.confirm({
      title: '确定删除该条数据吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        if (status === '3') {
          this.deleteAll(record)
        } else {
          this.delete(record)
        }
      },
    });
  };

  //读图中和已完成页面的删除按钮
  delete = (record) => {
    const { dispatch } = this.props;
    const { paginationLimt } = this.state;
    const { id } = record;
    dispatch({
      type: 'scientReading/remove',
      payload: { id },
    }).then((res) => {
      if (res && res.status === 1 && res.message === '成功') {
        message.success('删除成功');
        this.queryLete(paginationLimt)
      } else {
        message.error('删除失败');
      }
    })
  }

  //删除科研阅片-全部页面的删除按钮
  deleteAll = (record) => {
    const { dispatch } = this.props;
    const { paginationLimt } = this.state;
    const { id } = record;
    dispatch({
      type: 'scientReading/removeAll',
      payload: { id },
    }).then((res) => {
      if (res && res.status === 1 && res.message === '成功') {
        message.success('删除成功');
        this.query(paginationLimt)
      } else {
        message.error('删除失败');
      }
    })
  }

  //点击查看报告
  handleReport = (flag, record) => {
    const { dispatch } = this.props;
    if (flag) {
      const reportId = record.id
      const logoAddress = record.examinationAddress
      dispatch({
        type: 'scientReading/checkReport',
        payload: { reportId },
      });
      dispatch({
        type: 'scientReading/getInstitutionLogo',
        payload: logoAddress
      })
    }
    this.setState({
      reportStaus: !!flag
    })
  }

  //重置
  handleFormReset = () => {
    const { form } = this.props;
    const { paginationLimt } = this.state;
    const { status } = paginationLimt;
    form.resetFields();
    if (status === '3') {
      this.query(paginationLimt)
    } else {
      this.queryLete(paginationLimt)
    }
  };

  //切换疑难图标
  changeDifficult = (record) => {
    const { dispatch } = this.props;
    const { paginationLimt } = this.state;
    const { status } = paginationLimt;
    let params = {}
    if (status === '3') {
      params = {
        id: record.id,
        difficultCase: record.difficultCase === 0 ? 1 : 0
      }
    } else {
      params = {
        id: record.orId,
        difficultCase: record.difficultCase === 0 ? 1 : 0
      }
    }
    dispatch({
      type: 'scientReading/changeIcon',
      payload: params,
    }).then((res) => {
      if (res && res.status === 1 && res.message === '成功') {
        message.success('标记切换成功');
        if (status === '3') {
          this.query(paginationLimt)
        } else {
          this.queryLete(paginationLimt)
        }
      }
      else {
        message.error('标记切换失败');
      }
    })
  }

  //全部列表中的排序
  waitOnchange = (pagination, filters, sorter) => {
    const { paginationLimt } = this.state;
    const { status, type } = paginationLimt
    let sortType = sorter.order
    if (sortType) {
      sortType = sortType === 'ascend' ? 'asc' : 'desc'
    }
    const values = {
      orderBy: sorter.columnKey,
      sort: sortType,
      limit: pagination.pageSize,
      page: pagination.current,
      type,
      status,
    };
    this.query(values)
  }

  //其他列表中的排序
  OtherOnchange = (pagination, filters, sorter) => {
    const { paginationLimt } = this.state;
    const { status, type } = paginationLimt
    let sortType = sorter.order
    if (sortType) {
      sortType = sortType === 'ascend' ? 'asc' : 'desc'
    }
    const values = {
      orderBy: sorter.columnKey,
      sort: sortType,
      limit: pagination.pageSize,
      page: pagination.current,
      type,
      status,
    };
    this.queryLete(values)
  }

  //查询全部
  handleSearchWait = e => {
    e.preventDefault();
    const { paginationLimt } = this.state;
    const { limit, page, status, type } = paginationLimt;
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formData = fieldsValue
      if (formData.difficultCase) {
        formData.difficultCase = 1
      } else {
        formData.difficultCase = 0
      }
      const searchDate = formData.searchDate?.format('YYYY-MM-DD')
      const values = {
        ...fieldsValue,
        searchDate,
        limit,
        page,
        type,
        status
      };
      this.query(values)
    });
  };

  //查询其他列表
  handleSearchOther = e => {
    e.preventDefault();
    const { paginationLimt } = this.state;
    const { limit, page, status, type } = paginationLimt;
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formData = fieldsValue
      if (formData.difficultCase) {
        formData.difficultCase = 1
      } else {
        formData.difficultCase = 0
      }
      const readingDate = formData.readingDate && formData.readingDate.length > 0 ? [formData.readingDate[0].format('YYYY-MM-DD'), formData.readingDate[1].format('YYYY-MM-DD')] : ''
      const reportDateBegin = readingDate ? readingDate[0] : ''
      const reportDateEnd = readingDate ? readingDate[1] : ''
      const searchDate = formData.searchDate?.format('YYYY-MM-DD')
      const values = {
        ...fieldsValue,
        searchDate,
        reportDateBegin,
        reportDateEnd,
        limit,
        page,
        type,
        status
      };
      this.queryLete(values)
    });
  };

  //列表中参考阅片状态
  aiPictureStatus = (status) => {

    let stringStatus = '';
    if (status && status !== null) {
      const statusArr = JSON.parse(status)
      if (statusArr.length > 0) {
        stringStatus = '存在';
      } else {
        stringStatus = '不存在';
      }
    } else {
      stringStatus = '无';
    }
    return stringStatus;
  };

  //科研阅片-全部-搜索条件
  renderWaitForm() {
    const {
      form: { getFieldDecorator }, scientReading: { addressList }
    } = this.props;
    const options = addressList.scrInstitutionList ? addressList.scrInstitutionList.map(e => <Option key={e.value}>{e.label}</Option>) : [];
    return (
      <Form onSubmit={this.handleSearchWait} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="">
              {getFieldDecorator('year')(
                <Select placeholder="筛查年度" allowClear style={{ width: '100%' }}>
                  <Option value={2017}>2017年</Option>
                  <Option value={2018}>2018年</Option>
                  <Option value={2019}>2019年</Option>
                  <Option value={2020}>2020年</Option>
                  <Option value={2021}>2021年</Option>
                  <Option value={2022}>2022年</Option>
                  <Option value={2023}>2023年</Option>
                  <Option value={2024}>2024年</Option>
                  <Option value={2025}>2025年</Option>
                  <Option value={2026}>2026年</Option>
                  <Option value={2027}>2027年</Option>
                  <Option value={2028}>2028年</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="">
              {getFieldDecorator('institutionId')(
                <Select placeholder="筛查机构" allowClear style={{ width: '100%' }}>
                  {options}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="">
              {getFieldDecorator('aiPicture')(
                <Select placeholder="AI辅助" allowClear style={{ width: '100%' }}>
                  <Option value={1}>辅助诊断存在病灶</Option>
                  <Option value={2}>辅助诊断不存在病灶</Option>
                  <Option value={3}>辅助诊断未进行</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="">
              {getFieldDecorator('searchDate')(
                <DatePicker style={{ width: '100%' }} placeholder="请选择检查时间" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="">
              {getFieldDecorator('searchParam')(
                <Input placeholder="姓名/编号/身份证号" allowClear style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="">
              {getFieldDecorator('difficultCase', { valuePropName: 'checked' })(
                <Checkbox>疑难病历</Checkbox>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <div style={{ marginBottom: 10 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  //科研阅片-读图中-搜索条件
  renderWaitingForm() {
    const {
      form: { getFieldDecorator }, scientReading: { addressList }
    } = this.props;
    const options = addressList.scrInstitutionList ? addressList.scrInstitutionList.map(e => <Option key={e.value}>{e.label}</Option>) : [];
    return (
      <Form onSubmit={this.handleSearchOther} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="">
              {getFieldDecorator('year')(
                <Select placeholder="筛查年度" allowClear style={{ width: '100%' }}>
                  <Option value={2017}>2017年</Option>
                  <Option value={2018}>2018年</Option>
                  <Option value={2019}>2019年</Option>
                  <Option value={2020}>2020年</Option>
                  <Option value={2021}>2021年</Option>
                  <Option value={2022}>2022年</Option>
                  <Option value={2023}>2023年</Option>
                  <Option value={2024}>2024年</Option>
                  <Option value={2025}>2025年</Option>
                  <Option value={2026}>2026年</Option>
                  <Option value={2027}>2027年</Option>
                  <Option value={2028}>2028年</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="">
              {getFieldDecorator('institutionId')(
                <Select placeholder="筛查机构" allowClear style={{ width: '100%' }}>
                  {options}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="">
              {getFieldDecorator('aiPicture')(
                <Select placeholder="AI辅助" allowClear style={{ width: '100%' }}>
                  <Option value={1}>辅助诊断存在病灶</Option>
                  <Option value={2}>辅助诊断不存在病灶</Option>
                  <Option value={3}>辅助诊断未进行</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="">
              {getFieldDecorator('searchDate')(
                <DatePicker style={{ width: '100%' }} placeholder="请选择检查时间" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="">
              {getFieldDecorator('searchParam')(
                <Input placeholder="姓名/编号/身份证号" allowClear style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="">
              {getFieldDecorator('difficultCase', { valuePropName: 'checked' })(
                <Checkbox>疑难病历</Checkbox>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <div style={{ marginBottom: 10 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  //科研阅片-已完成-搜索条件
  renderFinishForm() {
    const {
      form: { getFieldDecorator }, scientReading: { addressList }
    } = this.props;
    const options = addressList.scrInstitutionList ? addressList.scrInstitutionList.map(e => <Option key={e.value}>{e.label}</Option>) : [];
    return (
      <Form onSubmit={this.handleSearchOther} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="">
              {getFieldDecorator('year')(
                <Select placeholder="筛查年度" allowClear style={{ width: '100%' }}>
                  <Option value={2017}>2017年</Option>
                  <Option value={2018}>2018年</Option>
                  <Option value={2019}>2019年</Option>
                  <Option value={2020}>2020年</Option>
                  <Option value={2021}>2021年</Option>
                  <Option value={2022}>2022年</Option>
                  <Option value={2023}>2023年</Option>
                  <Option value={2024}>2024年</Option>
                  <Option value={2025}>2025年</Option>
                  <Option value={2026}>2026年</Option>
                  <Option value={2027}>2027年</Option>
                  <Option value={2028}>2028年</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="">
              {getFieldDecorator('institutionId')(
                <Select placeholder="筛查机构" allowClear style={{ width: '100%' }}>
                  {options}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="">
              {getFieldDecorator('aiPicture')(
                <Select placeholder="AI辅助" allowClear style={{ width: '100%' }}>
                  <Option value={1}>辅助诊断存在病灶</Option>
                  <Option value={2}>辅助诊断不存在病灶</Option>
                  <Option value={3}>辅助诊断未进行</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="">
              {getFieldDecorator('biRads')(
                <Select placeholder="BI-RADS分级" style={{ width: '100%' }}>
                  <Option value={0}>0级</Option>
                  <Option value={1}>1级</Option>
                  <Option value={2}>2级</Option>
                  <Option value={3}>3级</Option>
                  <Option value={4}>4级</Option>
                  <Option value={5}>5级</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="">
              {getFieldDecorator('readingDate')(
                <RangePicker style={{ width: '100%' }} placeholder={['完成时间（起）', '完成时间（终）']} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="">
              {getFieldDecorator('name')(
                <Input placeholder="姓名/编号/身份证号" allowClear style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label="">
              {getFieldDecorator('difficultCase', { valuePropName: 'checked' })(
                <Checkbox>疑难病历</Checkbox>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <div style={{ marginBottom: 10 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }


  render() {
    const { scientReading: { scienList,reportData }, loading, tabsChangeKey } = this.props;
    const { reportStaus } = this.state
    const { data, dataTotal } = scienList;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: () => `共${dataTotal}条`,
      total: dataTotal,
      pageSizeOptions: ['10', '15', '20'],
      onChange: (current) => this.handleTableChange(current),
      onShowSizeChange: (current, pageSize) => this.handleTableChangePageSize(current, pageSize),
    };

    //全部列表
    const WaitColumns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        sorter: true,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        sorter: true,
      },
      {
        title: '民族',
        dataIndex: 'nation',
        key: 'nation',
      },
      {
        title: '身份证号',
        dataIndex: 'idCardNum',
        key: 'idCardNum',
      },
      {
        title: '手机号码',
        dataIndex: 'phoneNum',
        key: 'phoneNum',
      },
      {
        title: '联系地址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '检查时间',
        dataIndex: 'examinationDate',
        key: 'examinationDate',
        render: text => text ? moment(text).format('YYYY-MM-DD HH-mm-ss') : '',
        sorter: true,
      },
      {
        title: '筛查机构',
        align: 'center',
        dataIndex: 'screenInstitutionName',
        key: 'screenInstitutionName',
        sorter: true,
      },
      {
        title: '阅片参考',
        dataIndex: 'aiPicture',
        key: 'aiPicture',
        render: val => <span>{this.aiPictureStatus(val)}</span>,
      },
      {
        title: '设备号',
        dataIndex: 'deviceNo',
        key: 'deviceNo',
      },
      {
        title: '标记疑难',
        dataIndex: 'difficultCase',
        key: 'difficultCase',
        render: (text, record) => (
          <Fragment>
            {text === 1 ?
              <Button icon="check" type="primary" onClick={() => this.changeDifficult(record)} />
              : <Button icon="close" onClick={() => this.changeDifficult(record)} />
            }
          </Fragment>
        ),
      },
      {
        title: '操作',
        key: '',
        fixed: 'right',
        align: 'center',
        render: (record) => (
          <Fragment>
            <a href="">开始读图</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleDeleteConfirm(record)}>删除</a>
          </Fragment>
        ),
      },
    ];

    //读图中列表
    const ReadingColumns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        sorter: true,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        sorter: true,
      },
      {
        title: '民族',
        dataIndex: 'nation',
        key: 'nation',
      },
      {
        title: '身份证号',
        dataIndex: 'idCardNum',
        key: 'idCardNum',
      },
      {
        title: '手机号码',
        dataIndex: 'phoneNum',
        key: 'phoneNum',
      },
      {
        title: '联系地址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '检查时间',
        dataIndex: 'examinationDate',
        key: 'examinationDate',
        render: text => text ? moment(text).format('YYYY-MM-DD HH-mm-ss') : '',
        sorter: true,
      },
      {
        title: '筛查机构',
        align: 'center',
        dataIndex: 'screenInstitutionName',
        key: 'screenInstitutionName',
        sorter: true,
      },
      {
        title: '开始时间',
        dataIndex: 'doctorStartDate',
        key: 'doctorStartDate',
        render: text => text ? moment(text).format('YYYY-MM-DD HH-mm-ss') : '',
        sorter: true,
      },
      {
        title: '锁定时长',
        key: 'lockDoctorStartDate',
        render: text => text ? `已锁定${(moment()).diff(moment(text), 'minutes')}分钟` : '',
      },
      {
        title: '阅片参考',
        dataIndex: 'aiPicture',
        key: 'aiPicture',
        render: val => <span>{this.aiPictureStatus(val)}</span>,
      },
      {
        title: '设备号',
        dataIndex: 'deviceNo',
        key: 'deviceNo',
      },
      {
        title: '标记疑难',
        dataIndex: 'difficultCase',
        key: 'difficultCase',
        render: (text, record) => (
          <Fragment>
            {text === 1 ?
              <Button icon="check" type="primary" onClick={() => this.changeDifficult(record)} />
              : <Button icon="close" onClick={() => this.changeDifficult(record)} />
            }
          </Fragment>
        ),
      },
      {
        title: '操作',
        key: '',
        fixed: 'right',
        align: 'center',
        render: (record) => (
          <Fragment>
            <a href="">继续读图</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleDeleteConfirm(record)}>删除</a>
          </Fragment>
        ),
      },
    ];

    //已完成列表
    const FinishColumns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        sorter: true,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        sorter: true,
      },
      {
        title: '民族',
        dataIndex: 'nation',
        key: 'nation',
      },
      {
        title: '身份证号',
        dataIndex: 'idCardNum',
        key: 'idCardNum',
      },
      {
        title: '手机号码',
        dataIndex: 'phoneNum',
        key: 'phoneNum',
      },
      {
        title: '联系地址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '检查时间',
        dataIndex: 'examinationDate',
        key: 'examinationDate',
        render: text => text ? moment(text).format('YYYY-MM-DD HH-mm-ss') : '',
        sorter: true,
      },
      {
        title: '筛查机构',
        align: 'center',
        dataIndex: 'screenInstitutionName',
        key: 'screenInstitutionName',
        sorter: true,
      },
      {
        title: '开始时间',
        dataIndex: 'doctorStartDate',
        key: 'doctorStartDate',
        render: text => text ? moment(text).format('YYYY-MM-DD HH-mm-ss') : '',
        sorter: true,
      },
      {
        title: '阅片时长',
        key: 'readingDate',
        render: (record) => (record.doctorStartDate && record.reportDate) ? `${(moment(record.reportDate)).diff(moment(record.doctorStartDate), 'minutes')}分钟` : ''
      },
      {
        title: 'BI_RADS 分级',
        dataIndex: 'biRads',
        key: 'biRads',
        sorter: true,
        render: text => `${text}级`,
      },
      {
        title: '阅片参考',
        dataIndex: 'aiPicture',
        key: 'aiPicture',
        render: val => <span>{this.aiPictureStatus(val)}</span>,
      },
      {
        title: '设备号',
        dataIndex: 'deviceNo',
        key: 'deviceNo',
      },
      {
        title: '标记疑难',
        dataIndex: 'difficultCase',
        key: 'difficultCase',
        render: (text, record) => (
          <Fragment>
            {text === 1 ?
              <Button icon="check" type="primary" onClick={() => this.changeDifficult(record)} />
              : <Button icon="close" onClick={() => this.changeDifficult(record)} />
            }
          </Fragment>
        ),
      },
      {
        title: '操作',
        key: '',
        fixed: 'right',
        align: 'center',
        render: (record) => (
          <Fragment>
            <a onClick={() => this.handleReport(true, record)}>预览报告</a>
            <Divider type="vertical" />
            <a href="">查看阅片</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleDeleteConfirm(record)}>删除</a>
          </Fragment>
        ),
      },
    ];

    const reportMethod = {
      handleReport: this.handleReport
    }

    return (
      <Fragment>
        {tabsChangeKey === '3' &&
          <Fragment>
            <div className={styles.tableListForm}>{this.renderWaitForm()}</div>
            <Table
              loading={loading}
              dataSource={data}
              columns={WaitColumns}
              onChange={this.waitOnchange}
              rowKey={(record) => record.id}
              pagination={paginationProps}
              scroll={{ x: 'max-content' }}
            />
          </Fragment>}
        {tabsChangeKey === '10' &&
          <Fragment>
            <div className={styles.tableListForm}>{this.renderWaitingForm()}</div>
            <Table
              loading={loading}
              dataSource={data}
              columns={ReadingColumns}
              onChange={this.OtherOnchange}
              rowKey={(record) => record.id}
              pagination={paginationProps}
              scroll={{ x: 'max-content' }}
            />
          </Fragment>}
        {tabsChangeKey === '20' &&
          <Fragment>
            <div className={styles.tableListForm}>{this.renderFinishForm()}</div>
            <Table
              loading={loading}
              rowKey={(record) => record.id}
              columns={FinishColumns}
              onChange={this.OtherOnchange}
              dataSource={data}
              pagination={paginationProps}
              scroll={{ x: 'max-content' }}
            />
            {reportData && Object.keys(reportData).length > 0 ?
              <CheckReport
                {...reportMethod}
                currentReport={reportData}
                reportStaus={reportStaus}
              /> : null}
          </Fragment>}
      </Fragment>
    );
  }
}

ScientificList.propTypes = {
  scientReading: PropTypes.object
}
ScientificList.defaultProps = {
  scientReading: {
    scienList: [],
    addressList: [],
    reportData: {},
    institutionLogo:'',
  },
};

export default ScientificList;
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
  Modal,
  DatePicker,
} from 'antd';
import ViewReportComponent from '@/components/ViewReportComponent/index'
import styles from './ScreenReadingList.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;


@connect(({ waitReading, loading }) => ({
  loading: loading.models.waitReading,
  waitReading,
}))
@Form.create()
class RejectReason extends PureComponent {
  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const {
      form,
      rejectReasonStaus,
      currentReason,
      handleRejectReason,
    } = this.props;
    const Reason = (
      <Form>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="驳回原因">
          {form.getFieldDecorator('auditComment', {
            initialValue: currentReason.data.auditComment
          })(
            <TextArea disabled rows={3} />
          )}
        </FormItem>
      </Form>
    );
    return (
      <Modal
        maskClosable={false}
        destroyOnClose
        title='驳回原因'
        visible={rejectReasonStaus}
        footer={null}
        onCancel={() => handleRejectReason()}
      >
        {Reason}
      </Modal>
    );
  }
}

@connect(({ waitReading, loading }) => ({
  loading: loading.models.waitReading,
  waitReading,
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
      waitReading: { institutionLogo }
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

@connect(({ waitReading, loading }) => ({
  waitReading,
  loading: loading.models.waitReading,
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rejectReasonStaus: false,
      reportStaus: false,
      paginationLimt: {
        limit: 10,
        page: 1,
        type: 1,
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
      type: 'waitReading/fetchAddressList',
    })
  };

  //请求待读图
  query = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waitReading/fetchWaitReadingList',
      payload: {
        ...data
      },
    })
  }

  //请求读图中,已完成，已驳回,已关闭
  queryLete = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waitReading/fetchWaitingReadingList',
      payload: {
        ...data
      },
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

  //查询待读图
  handleSearchWait = e => {
    e.preventDefault();
    const { paginationLimt } = this.state;
    const { limit, page, status, type } = paginationLimt;
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formData = fieldsValue
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
      const readingDate = formData.readingDate && formData.readingDate.length > 0 ? [formData.readingDate[0].format('YYYY-MM-DD'), formData.readingDate[1].format('YYYY-MM-DD')] : ''
      const reportDateBegin = readingDate ? readingDate[0] : null
      const reportDateEnd = readingDate ? readingDate[1] : null
      const closeDate = formData.closeDate?.format('YYYY-MM-DD')
      const values = {
        ...fieldsValue,
        closeDate,
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

  //查询关闭列表
  handleSearchClose = e => {
    e.preventDefault();
    const { paginationLimt } = this.state;
    const { limit, page, status, type } = paginationLimt;
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formData = fieldsValue
      const startDate = formData.startDate && formData.startDate.length > 0 ? [formData.startDate[0].format('YYYY-MM-DD'), formData.startDate[1].format('YYYY-MM-DD')] : ''
      const doctorStartDateBegin = startDate ? startDate[0] : null
      const doctorStartDateEnd = startDate ? startDate[1] : null
      const values = {
        ...fieldsValue,
        doctorStartDateBegin,
        doctorStartDateEnd,
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

  //点击驳回原因
  handleRejectReason = (flag, record) => {
    const { dispatch } = this.props;
    if (flag) {
      const { orId } = record
      dispatch({
        type: 'waitReading/reason',
        payload: { orId },
      })
    }
    this.setState({
      rejectReasonStaus: !!flag
    })
  }

  //点击查看报告
  handleReport = (flag, record) => {
    const { dispatch } = this.props;
    if (flag) {
      const reportId = record.id
      const logoAddress = record.examinationAddress
      dispatch({
        type: 'waitReading/checkReport',
        payload: { reportId },
      });
      dispatch({
        type: 'waitReading/getInstitutionLogo',
        payload: logoAddress
      })
    }
    this.setState({
      reportStaus: !!flag
    })
  }

  //待读图中的排序
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

  //筛查阅片-待读图-搜索条件
  renderWaitForm() {
    const {
      form: { getFieldDecorator }, waitReading: { addressList }
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
      </Form>
    );
  }

  //筛查阅片-读图中-搜索条件
  renderWaitingForm() {
    const {
      form: { getFieldDecorator }, waitReading: { addressList }
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
              {getFieldDecorator('closeDate')(
                <DatePicker style={{ width: '100%' }} placeholder="请选择截止时间" />
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
      </Form>
    );
  }

  //筛查阅片-已完成-搜索条件
  renderFinishForm() {
    const {
      form: { getFieldDecorator }, waitReading: { addressList }
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
                <Select placeholder="BI_RADS分级" allowClear style={{ width: '100%' }}>
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
              {getFieldDecorator('searchParam')(
                <Input placeholder="姓名/编号/身份证号" allowClear style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
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
      </Form>
    );
  }

  //筛查阅片-已驳回-搜索条件
  renderRejectForm() {
    const {
      form: { getFieldDecorator }, waitReading: { addressList }
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
                <Select placeholder="BI_RADS分级" allowClear style={{ width: '100%' }}>
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
              {getFieldDecorator('searchParam')(
                <Input placeholder="姓名/编号/身份证号" allowClear style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={16} sm={24}>
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
      </Form>
    );
  }

  //筛查阅片-已关闭-搜索条件
  renderCloseForm() {
    const {
      form: { getFieldDecorator }, waitReading: { addressList }
    } = this.props;
    const options = addressList.scrInstitutionList ? addressList.scrInstitutionList.map(e => <Option key={e.value}>{e.label}</Option>) : [];
    return (
      <Form onSubmit={this.handleSearchClose} layout="inline">
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
              {getFieldDecorator('startDate')(
                <RangePicker style={{ width: '100%' }} placeholder={['开始时间（起）', '开始时间（终）']} />
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
      </Form>
    );
  }

  render() {
    const { waitReading: { screenList, reasonData, reportData }, loading, tabsChangeKey } = this.props;
    const { rejectReasonStaus, reportStaus } = this.state
    const { data, dataTotal } = screenList;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: () => `共${dataTotal}条`,
      total: dataTotal,
      pageSizeOptions: ['10', '15', '20'],
      onChange: (current) => this.handleTableChange(current),
      onShowSizeChange: (current, pageSize) => this.handleTableChangePageSize(current, pageSize),
    };

    //筛查阅片-待读图列表
    const WaitColumns = [
      {
        title: '编号',
        dataIndex: 'id',
        align: 'center',
        key: 'id',
        sorter: true
      },
      {
        title: '姓名',
        align: 'center',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '性别',
        align: 'center',
        dataIndex: 'sex',
        key: 'sex',
      },
      {
        title: '年龄',
        align: 'center',
        dataIndex: 'age',
        key: 'age',
        sorter: true,
      },
      {
        title: '民族',
        align: 'center',
        dataIndex: 'nation',
        key: 'nation',
      },
      {
        title: '身份证号',
        align: 'center',
        dataIndex: 'idCardNum',
        key: 'idCardNum',
      },
      {
        title: '手机号码',
        align: 'center',
        dataIndex: 'phoneNum',
        key: 'phoneNum',
      },
      {
        title: '联系地址',
        align: 'center',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '检查时间',
        align: 'center',
        dataIndex: 'examinationDate',
        key: 'examinationDate',
        render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
        sorter: true,
      },
      {
        title: '筛查机构',
        align: 'center',
        dataIndex: 'screenInstitutionName',
        key: 'screenInstitutionName',
        sorter: true
      },
      {
        title: '阅片参考',
        align: 'center',
        dataIndex: 'aiPicture',
        key: 'aiPicture',
        render: val => <span>{this.aiPictureStatus(val)}</span>,
      },
      {
        title: '设备号',
        align: 'center',
        dataIndex: 'deviceNo',
        key: 'deviceNo',
      },
      {
        title: '操作',
        key: '',
        fixed: 'right',
        align: 'center',
        render: () => (
          <Fragment>
            <a href="">开始读图</a>
          </Fragment>
        ),
      },
    ];

    //筛查阅片-读图中列表
    const ReadingColumns = [
      {
        title: '编号',
        align: 'center',
        dataIndex: 'id',
        key: 'id',
        sorter: true
      },
      {
        title: '姓名',
        align: 'center',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '性别',
        align: 'center',
        dataIndex: 'sex',
        key: 'sex',
      },
      {
        title: '年龄',
        align: 'center',
        dataIndex: 'age',
        key: 'age',
        sorter: true
      },
      {
        title: '民族',
        align: 'center',
        dataIndex: 'nation',
        key: 'nation',
      },
      {
        title: '身份证号',
        align: 'center',
        dataIndex: 'idCardNum',
        key: 'idCardNum',
      },
      {
        title: '手机号码',
        align: 'center',
        dataIndex: 'phoneNum',
        key: 'phoneNum',
      },
      {
        title: '联系地址',
        align: 'center',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '检查时间',
        align: 'center',
        dataIndex: 'examinationDate',
        key: 'examinationDate',
        render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
        sorter: true
      },
      {
        title: '筛查机构',
        align: 'center',
        dataIndex: 'screenInstitutionName',
        key: 'screenInstitutionName',
        sorter: true
      },
      {
        title: '开始时间',
        align: 'center',
        dataIndex: 'doctorStartDate',
        key: 'doctorStartDate',
        render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
        sorter: true
      },
      {
        title: '截止时间',
        align: 'center',
        dataIndex: 'closeDate',
        key: 'closeDate',
        render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
        sorter: true
      },
      {
        title: '阅片参考',
        align: 'center',
        dataIndex: 'aiPicture',
        key: 'aiPicture',
        render: val => <span>{this.aiPictureStatus(val)}</span>,
      },
      {
        title: '设备号',
        align: 'center',
        dataIndex: 'deviceNo',
        key: 'deviceNo',
      },
      {
        title: '操作',
        key: '',
        fixed: 'right',
        align: 'center',
        render: (record) => (
          <Fragment>
            {record.status === 9 ? <a href="">读图</a> : ''}
            {record.status === 10 ? <a href="">继续读图</a> : ''}
          </Fragment>
        ),
      },
    ];

    //筛查阅片-已完成列表
    const FinishColumns = [
      {
        title: '编号',
        align: 'center',
        dataIndex: 'id',
        key: 'id',
        sorter: true
      },
      {
        title: '姓名',
        align: 'center',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '性别',
        align: 'center',
        dataIndex: 'sex',
        key: 'sex',
      },
      {
        title: '年龄',
        align: 'center',
        dataIndex: 'age',
        key: 'age',
        sorter: true
      },
      {
        title: '民族',
        align: 'center',
        dataIndex: 'nation',
        key: 'nation',
      },
      {
        title: '身份证号',
        align: 'center',
        dataIndex: 'idCardNum',
        key: 'idCardNum',
      },
      {
        title: '手机号码',
        align: 'center',
        dataIndex: 'phoneNum',
        key: 'phoneNum',
      },
      {
        title: '联系地址',
        align: 'center',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '检查时间',
        align: 'center',
        dataIndex: 'examinationDate',
        key: 'examinationDate',
        render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
        sorter: true
      },
      {
        title: '筛查机构',
        align: 'center',
        dataIndex: 'screenInstitutionName',
        key: 'screenInstitutionName',
        sorter: true
      },
      {
        title: '开始时间',
        align: 'center',
        dataIndex: 'doctorStartDate',
        key: 'doctorStartDate',
        render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
        sorter: true
      },
      {
        title: '完成时间',
        align: 'center',
        dataIndex: 'reportDate',
        key: 'reportDate',
        render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
        sorter: true
      },
      {
        title: 'BI_RADS 分级',
        align: 'center',
        dataIndex: 'biRads',
        key: 'biRads',
        sorter: true,
        render: text => `${text}级`,
      },
      {
        title: '阅片参考',
        align: 'center',
        dataIndex: 'aiPicture',
        key: 'aiPicture',
        render: val => <span>{this.aiPictureStatus(val)}</span>,
      },
      {
        title: '设备号',
        align: 'center',
        dataIndex: 'deviceNo',
        key: 'deviceNo',
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        align: 'center',
        render: (record) => (
          <Fragment>
            <a onClick={() => this.handleReport(true, record)}>预览报告</a>
            <Divider type="vertical" />
            <a href="">查看阅片</a>
          </Fragment>
        ),
      },
    ];

    //筛查阅片-已驳回列表
    const RejectColumns = [
      {
        title: '编号',
        align: 'center',
        dataIndex: 'id',
        key: 'id',
        sorter: true
      },
      {
        title: '姓名',
        align: 'center',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '性别',
        align: 'center',
        dataIndex: 'sex',
        key: 'sex',
      },
      {
        title: '年龄',
        align: 'center',
        dataIndex: 'age',
        key: 'age',
        sorter: true
      },
      {
        title: '民族',
        align: 'center',
        dataIndex: 'nation',
        key: 'nation',
      },
      {
        title: '身份证号',
        align: 'center',
        dataIndex: 'idCardNum',
        key: 'idCardNum',
      },
      {
        title: '手机号码',
        align: 'center',
        dataIndex: 'phoneNum',
        key: 'phoneNum',
      },
      {
        title: '联系地址',
        align: 'center',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '检查时间',
        align: 'center',
        dataIndex: 'examinationDate',
        key: 'examinationDate',
        render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
        sorter: true
      },
      {
        title: '筛查机构',
        align: 'center',
        dataIndex: 'screenInstitutionName',
        key: 'screenInstitutionName',
        sorter: true
      },
      {
        title: '开始时间',
        align: 'center',
        dataIndex: 'doctorStartDate',
        key: 'doctorStartDate',
        render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
        sorter: true
      },
      {
        title: '完成时间',
        align: 'center',
        dataIndex: 'reportDate',
        key: 'reportDate',
        render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
        sorter: true
      },
      {
        title: 'BI_RADS 分级',
        align: 'center',
        dataIndex: 'biRads',
        key: 'biRads',
        sorter: true,
        render: text => `${text}级`,
      },
      {
        title: '阅片参考',
        align: 'center',
        dataIndex: 'aiPicture',
        key: 'aiPicture',
        render: val => <span>{this.aiPictureStatus(val)}</span>,
      },
      {
        title: '设备号',
        align: 'center',
        dataIndex: 'deviceNo',
        key: 'deviceNo',
      },
      {
        title: '操作',
        key: '',
        fixed: 'right',
        align: 'center',
        render: (record) => (
          <Fragment>
            <a href="">查看阅片</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleRejectReason(true, record)}>驳回原因</a>
          </Fragment>
        ),
      },
    ];

    //筛查阅片-已关闭列表
    const CloseColumns = [
      {
        title: '编号',
        align: 'center',
        dataIndex: 'id',
        key: 'id',
        sorter: true
      },
      {
        title: '姓名',
        align: 'center',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '性别',
        align: 'center',
        dataIndex: 'sex',
        key: 'sex',
      },
      {
        title: '年龄',
        align: 'center',
        dataIndex: 'age',
        key: 'age',
        sorter: true
      },
      {
        title: '民族',
        align: 'center',
        dataIndex: 'nation',
        key: 'nation',
      },
      {
        title: '身份证号',
        align: 'center',
        dataIndex: 'idCardNum',
        key: 'idCardNum',
      },
      {
        title: '手机号码',
        align: 'center',
        dataIndex: 'phoneNum',
        key: 'phoneNum',
      },
      {
        title: '联系地址',
        align: 'center',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '检查时间',
        align: 'center',
        dataIndex: 'examinationDate',
        key: 'examinationDate',
        render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
        sorter: true
      },
      {
        title: '筛查机构',
        align: 'center',
        dataIndex: 'screenInstitutionName',
        key: 'screenInstitutionName',
        sorter: true
      },
      {
        title: '开始时间',
        align: 'center',
        dataIndex: 'doctorStartDate',
        key: 'doctorStartDate',
        render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
        sorter: true
      },
      {
        title: '截止时间',
        align: 'center',
        dataIndex: 'closeDate',
        key: 'closeDate',
        render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
        sorter: true
      },
      {
        title: '关闭时间',
        align: 'center',
        key: 'unopenDate',
        render: (record) => record.status === 30 ?
          (record.doctorFeedbackDate ? moment(record.doctorFeedbackDate).format('YYYY-MM-DD HH:mm:ss') : '')
          : record.status === 10 ?
            (record.closeDate ? moment(record.closeDate).format('YYYY-MM-DD HH:mm:ss') : '') : '',
      },
      {
        title: '关闭原因',
        align: 'center',
        key: 'closeReason',
        render: (record) => record.status === 30 ? '医生反馈关闭' : record.status === 10 ? '超时关闭' : '',
      },
      {
        title: '阅片参考',
        align: 'center',
        dataIndex: 'aiPicture',
        key: 'aiPicture',
        render: val => <span>{this.aiPictureStatus(val)}</span>,
      },
      {
        title: '设备号',
        align: 'center',
        dataIndex: 'deviceNo',
        key: 'deviceNo',
      },
      {
        title: '操作',
        key: '',
        fixed: 'right',
        align: 'center',
        render: () => (
          <Fragment>
            <a href="">查看阅片</a>
          </Fragment>
        ),
      },
    ];

    const rejectMethod = {
      handleRejectReason: this.handleRejectReason
    }

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
              onChange={this.waitOnchange}
              columns={WaitColumns}
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
              onChange={this.OtherOnchange}
              columns={ReadingColumns}
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
        {tabsChangeKey === '25' &&
          <Fragment>
            <div className={styles.tableListForm}>{this.renderRejectForm()}</div>
            <Table
              loading={loading}
              rowKey={(record) => record.id}
              columns={RejectColumns}
              onChange={this.OtherOnchange}
              dataSource={data}
              pagination={paginationProps}
              scroll={{ x: 'max-content' }}
            />
            {reasonData && Object.keys(reasonData).length > 0 ?
              <RejectReason
                {...rejectMethod}
                currentReason={reasonData}
                rejectReasonStaus={rejectReasonStaus}
              /> : null}
          </Fragment>}
        {tabsChangeKey === '30' &&
          <Fragment>
            <div className={styles.tableListForm}>{this.renderCloseForm()}</div>
            <Table
              loading={loading}
              rowKey={(record) => record.id}
              onChange={this.OtherOnchange}
              columns={CloseColumns}
              dataSource={data}
              pagination={paginationProps}
              scroll={{ x: 'max-content' }}
            />
          </Fragment>}
      </Fragment>
    );
  }
}

TableList.propTypes = {
  waitReading: PropTypes.object
}
TableList.defaultProps = {
  waitReading: {
    screenList: [],
    addressList: [],
    reasonData: {},
    reportData: {},
    institutionLogo: ''
  },
};

export default TableList;

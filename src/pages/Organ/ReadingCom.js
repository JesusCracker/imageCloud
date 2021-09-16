import React, { PureComponent, Fragment } from 'react';
import { Tree, Button, Row, Modal, Form, Input, Radio, message } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';

const FormItem = Form.Item;

//setForm
@connect(({ menu, loading }) => ({
  loading: loading.models.menu,
  menu,
}))
@Form.create()
class SetForm extends PureComponent {
  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.state = {
      practiceOther: 1,
    };
  }

  handleRadioChange = (e) => {
    this.setState({
      practiceOther: e.target.value
    })
  }

  testMobilephone = (str) => {
    const regex = /^1[3456789]\d{9}$/
    if (!regex.test(str)) {
      return false
    }
    return true
  }

  render() {
    const {
      form,
      modalVisible,
      handleSet,
      currentRecord,
      handleSetModalVisible,
      loading
    } = this.props;

    const { practiceOther } = this.state

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        const fieldData = fieldsValue;
        fieldData.id = currentRecord.id
        handleSet(fieldData, form)
      });
    };

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    const mobilephoneValidate = (rule, value, callback) => {
      // 主要就是添加一个对undefined和空串和null的判断
      if (typeof (value) === 'undefined' || value === '' || value === null) {
        callback()
      } else {
        if (!this.testMobilephone(value)) {
          callback(new Error('请输入正确手机格式'))
        }
        callback()
      }
    }

    // 阅片机构配置需要填的表单
    const setReadingForm = (
      <Form>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="短信发送渠道">
          {form.getFieldDecorator('mesSendType', {
            initialValue: currentRecord.mesSendType
          })(
            <Radio.Group onChange={e => this.handleRadioChange(e, 'practiceOther')}>
              <Radio autoFocus style={radioStyle} value={1}>直接发送到用户</Radio>
              <Radio autoFocus style={radioStyle} value={2}>先发送到管理员
                {practiceOther === 2 || currentRecord.mesSendType === 2 ? (
                  <span>
                    {form.getFieldDecorator('adminPhone', {
                      initialValue: currentRecord.adminPhone,
                      rules: [{ required: true, message: '请输入管理员手机！' }, { validator: mobilephoneValidate }],
                    })(
                      <Input style={{ width: 150, marginLeft: 10 }} placeholder='请输入管理员手机' />
                    )}
                  </span>
                ) : ("")}
              </Radio>
            </Radio.Group>
          )}
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="报告模版">
          {form.getFieldDecorator('aibusTem', {
            initialValue: currentRecord.aibusTem
          })(
            <Radio.Group>
              <Radio value={1}>标准版</Radio>
              <Radio value={2}>专家版</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="报告发布状态">
          {form.getFieldDecorator('aibusReportStatus', {
            initialValue: currentRecord.aibusReportStatus
          })(
            <Radio.Group>
              <Radio value={1}>未发布</Radio>
              <Radio value={2}>已发布</Radio>
            </Radio.Group>
          )}
        </FormItem>
      </Form>
    );
    return (
      <Modal
        maskClosable={false}
        destroyOnClose
        title='参数配置'
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleSetModalVisible()}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading}
      >
        {setReadingForm}
      </Modal>
    );
  }
}


@connect(({ organAll, loading }) => ({
  organAll,
  loading: loading.models.auth,
}))

//机构树组件
class ReadingComList extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      setModalVisible: false,
      currentRecord: null
    };

  }

  //页面初始化
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'organAll/fetchOrganAllList',
      payload: {},
    });
  }

  //选择树中节点
  handleCheck = (checkedKeys) => {
    const currentRecord = checkedKeys;
    if (currentRecord.length > 1) {
      message.error('只能选择一个权限进行编辑或者删除');
    } else {
      this.setState({
        currentRecord,
      });
    }
  };

  //弹出提示框
  renderMessage = content => {
    message.error(content);
  };

  //点击配置按钮
  handleSetModalVisible = (flag) => {
    const { dispatch } = this.props;
    const { currentRecord } = this.state;
    if (currentRecord && currentRecord.length > 0) {
      if (flag) {
        dispatch({
          type: 'organAll/querySelectOrganDetail',
          payload: { id: currentRecord[0] },
        })
      }
      this.setState({
        setModalVisible: !!flag,
      });
    } else {
      this.renderMessage('请选择机构后再配置');
    }
  };

  //配置提交
  handleSet = (fields, form) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organAll/addSet',
      payload: { ...fields },
    }).then(res => {
      if (res && res.status === 1 && res.message === '成功') {
        message.success('配置成功');
        form.resetFields();
        this.handleSetModalVisible();
        dispatch({
          type: 'organAll/fetchOrganAllList',
          payload: {},
        });
      }
    });
  };

  render() {
    const { organAll: { organAllListData, menuDetail }, loading } = this.props;
    const { setModalVisible } = this.state;
    //配置组件调用的方法
    const setMethods = {
      handleSet: this.handleSet,
      handleSetModalVisible: this.handleSetModalVisible,
    };
    //重构得到的树列表的值
    const treeDatas = organAllListData && Array.isArray(organAllListData) && organAllListData.length > 0 ? organAllListData : [];
    const formateData = data => {
      if (Array.isArray(data)) {
        return data.map(item => item.children
          ? {
            title: item.name,
            parentId: item.parentId,
            value: item.id,
            key: item.id,
            id: item.id,
            children: formateData(item.children),
          }
          : {
            title: item.name,
            parentId: item.parentId,
            value: item.id,
            id: item.id,
            key: item.id,
          });
      }
      return [];
    };
    const treeChangeDatas = treeDatas.length > 0 ? formateData(treeDatas) : [];

    return (
      <Fragment>
        <Button
          icon="setting"
          type="primary"
          onClick={() => this.handleSetModalVisible(true)}
        >
          配置
        </Button>
        {menuDetail && Object.keys(menuDetail).length > 0 ? (
          <SetForm
            {...setMethods}
            currentRecord={menuDetail}
            modalVisible={setModalVisible}
            loading={loading}
          />
        ) : null}

        <Row style={{ marginTop: 20 }}>
          <Tree
            onSelect={this.handleCheck}
            treeData={treeChangeDatas}
            checkStrictly
          />
        </Row>
      </Fragment>
    );
  }
}


ReadingComList.propTypes = {
  organAll: PropTypes.object,
};
ReadingComList.defaultProps = {
  organAll: {
    organAllListData: [],
    menuDetail: {}
  },
};

export default ReadingComList;

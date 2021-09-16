import { connect } from 'dva';
import { Button, Col, DatePicker, Form, Input, Radio, Row, Select, Upload, Icon, message } from 'antd';
import React, { PureComponent } from 'react';
import moment from 'moment';
import { imgUrlPath } from '@/global';
import PropTypes from 'prop-types';
import styles from './AccountInfo.less';



const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;


function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}


@connect(({ info, loading }) => ({
  info,
  loading,
}))
@Form.create()
class ChangeInfo extends PureComponent {

  layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      phone: false,
      email: false,
      loading: false,
      showEmail: false,
      phoneLoading: false,
      emailLoading: false,
      time1: 59,
      time2: 59
    };
    this.timer1 = null;
    this.timer2 = null
  }

  handleSubmit = e => {
    const { form } = this.props;
    let data = {};
    e.preventDefault();
    form.validateFields((err, values) => {
      const { birthDate, phone, newPhonePrefix, newPhoneSuffix, ...params } = values;
      params.birthDate = birthDate && moment(birthDate).format('YYYY-MM-DD');
      data = params;
    });
    return data;
  };


  // 显示/隐藏 更换电话的表单
  changePhoneNumber = () => {
    const { phone } = this.state;
    if (phone) {
      this.setState({
        phone: false,
      });
    } else {
      this.setState({
        phone: true,
      });
    }
  };

  // 显示/隐藏 更换邮件的表单
  changeEmail = () => {
    const { email } = this.state;
    if (email) {
      this.setState({
        email: false,
      });
    } else {
      this.setState({
        email: true,
      });
    }
  };

  // 获取电话验证码
  getPhoneVerify = () => {
    const { dispatch, form: { getFieldsValue, validateFields } } = this.props;
    const { phone } = getFieldsValue(['newPhonePrefix', 'newPhoneSuffix', 'phone']);
    validateFields(['phone'], (err) => {
      if (!err) {
        dispatch({
          type: 'info/getPhoneVerify',
          payload: phone,
        });
        this.waitOneMinute('timer1', 'time1', 'phoneLoading');
      }
    });
  };

  // 获取邮箱验证码
  getEmailVerify = () => {
    const { dispatch, form: { getFieldsValue, validateFields } } = this.props;
    const { email, newEmail } = getFieldsValue(['email', 'newEmail']);
    validateFields(['email', 'newEmail'], (err) => {
      if (!err) {
        dispatch({
          type: 'info/getEmailVerify',
          payload: email || newEmail,
        });
        this.waitOneMinute('timer2', 'time2', 'emailLoading')
      }
    });
  };

  // waitOneMinute:等待一分钟
  waitOneMinute = (timer, time, loading) => {
    /*
      timer: string,需要再class的this声明, 保存定时器, 用于组件销毁之前清除定时器
      time: string,需要再state中声明,用于显示倒计时
      loading: string,需要再state中声明, 用于控制按钮loading
    */
    let sec = 59;
    this.setState({
      [loading]: true,
      [time]: sec
    })
    this[timer] = setInterval(() => {
      if(sec > -1) {
        this.setState({
          [time]: sec-=1
        })
      } else {
        clearInterval(this[timer])
        this.setState({
          [loading]: false
        })
      }
    }, 1000)
  }

  // 更换头像
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl) => this.setState({
          imageUrl,
          loading: false,
        }));
    }
  };

  componentWillUnmount = () => {
    clearInterval(this.timer1);
    clearInterval(this.timer2)
  }

  // 主体表单
  renderForm() {
    const { phone, email, showEmail } = this.state;
    const {
      form: { getFieldDecorator },
      info,
    } = this.props;

    return (
      <Form {...this.layout}>
        <FormItem label="姓名">
          {getFieldDecorator('name', {
            initialValue: info.userInfo.name,
            rules: [{ required: true, message: '请输入您的姓名' }],
          })(<Input style={{ width: '50%' }} placeholder="请输入您的姓名" />)}
        </FormItem>
        <FormItem label="性别">
          {getFieldDecorator('sex', { initialValue: info.userInfo.sex })(
            <RadioGroup style={{ width: '100%' }}>
              <Radio value={1}>女</Radio>
              <Radio value={2}>男</Radio>
              <Radio value={0}>保密</Radio>
            </RadioGroup>,
          )}
        </FormItem>
        <Form.Item label="出生年月">
          {getFieldDecorator('birthDate', {
            initialValue: moment(info.userInfo.birthDate),
            rules: [{ required: true, message: '请选择您的出生日期' }],
          })(
            <DatePicker style={{ width: '50%' }} format="YYYY-MM-DD" placeholder="请选择您的出生日期" />,
          )}
        </Form.Item>
        <FormItem label="电话号码">
          {getFieldDecorator('phone', {
            initialValue: info.userInfo.phone,
            rules: [{ required: true, message: '手机号码不能为空' }, { min: 11, max: 11, message: '请输入正确的手机号' }],
            validateTrigger: 'onBlur'
          })(<Input style={{ width: '50%' }} placeholder="请输入您的手机号码" />)}
          <a style={{ marginLeft: '20px' }} onClick={this.changePhoneNumber}> 更换 </a>
        </FormItem>
        {phone && this.renderChangePhoneForm('phone')}
        <FormItem label="电子邮箱">
          {
            info.userInfo.email || showEmail ? (
              <div>
                {getFieldDecorator('email', {
                  initialValue: info.userInfo.email,
                  rules: [{ required: true, message: '邮箱不能为空'}, {pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/, message: '邮箱格式错误'}],
                  validateTrigger: 'onBlur'
                })(<Input style={{ width: '50%' }} placeholder="请输入您的邮箱" />)}
                <a style={{ marginLeft: '23px' }} onClick={this.changeEmail}>更换</a>
              </div>
            ) : (
              <a onClick={this.changeEmail}>绑定</a>
            )
          }
        </FormItem>
        {email && this.renderChangePhoneForm('email')}
      </Form>
    );
  }

  // 更换电话或邮件的表单
  renderChangePhoneForm(type) {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {phoneLoading, emailLoading, time1, time2} = this.state;
    const prefixSelector = getFieldDecorator('newPhonePrefix', {
      initialValue: '086',
    })(
      <Select style={{ width: 70 }}>
        <Option value="086">086</Option>
      </Select>,
    );

    return (
      <div className={styles.formBlock}>
        {
          type === 'phone' ? (
            <div>
              <Row>
                <Col offset={4}>
                  <span style={{ fontSize: '20px', marginRight: '5px' }}>输入新手机号</span>更换成功之后可用新手机号登录
                </Col>
              </Row>
              <Row>
                <Col span={12} offset={4}>
                  <FormItem>
                    {getFieldDecorator('newPhoneSuffix', {
                      rules: [{ required: true, message: '请输入您的手机号' }, { min: 11, max: 11, message: '请输入正确的手机号' }],
                      validateTrigger: 'onBlur'
                    })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('phoneVerify', {
                      rules: [{ required: true, message: '请输入验证码' }]
                    })(<Input prefix={<Icon type="mail" />} style={{ width: 'calc(100% - 110px)' }} placeholder="验证码" />)}
                    <Button style={{ width: '100px', marginLeft: '10px' }} onClick={this.getPhoneVerify} loading={phoneLoading}>
                      {phoneLoading ? `${time1} 秒` : '获取验证码'}
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </div>
          ) : (
            <div>
              <Row>
                <Col span={12} offset={4}>
                  <FormItem>
                    {getFieldDecorator('newEmail', {
                      rules: [{ required: true, message: '邮箱不能为空' }, {pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/, message: '邮箱格式错误'}],
                      validateTrigger: 'onBlur'
                    })(<Input placeholder="电子邮箱" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12} offset={4}>
                  <FormItem>
                    {getFieldDecorator('emailVerify', {
                      rules: [{ required: true, message: '请输入验证码' }]
                    })(<Input prefix={<Icon type="mail" />} style={{ width: 'calc(100% - 110px)' }} placeholder="验证码" />)}
                    <Button style={{ width: '100px', marginLeft: '10px' }} onClick={this.getEmailVerify} loading={emailLoading}>
                      {emailLoading ? `${time2} 秒` : '获取验证码'}
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </div>
          )
        }
      </div>
    );
  }


  render() {
    const { loading, imageUrl } = this.state;
    const { info } = this.props;

    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Row>
          <Col span={4} style={{ color: 'rgba(0, 0, 0, 0.85)', textAlign: 'end' }}>
            头像：
          </Col>
          <Col span={20} style={{ marginBottom: '20px' }}>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={this.handleChange}
            >
              {imageUrl || info.userInfo.headicon ? <img
                src={imageUrl || imgUrlPath + info.userInfo.headicon}
                alt="avatar"
                style={{ width: '100%' }}
              /> : uploadButton}
            </Upload>
          </Col>
        </Row>
        {this.renderForm()}
      </div>
    );
  }
}

ChangeInfo.propsType = {
  info: PropTypes.exact({
    userInfo: PropTypes.object,
    messageList: PropTypes.array,
    messageContent: PropTypes.object,
    messageListTotal: PropTypes.number
  }),
}

ChangeInfo.defaultProps = {
  info: {
    userInfo: {},
    messageList: [],
    messageContent: {},
    messageListTotal: 0
  }
}

export default ChangeInfo;

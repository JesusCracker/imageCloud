import { connect } from 'dva';
import { Form, Input } from 'antd';
import React, { PureComponent } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const FormItem = Form.Item;

@connect(({ info, loading }) => ({
  info,
  loading,
}))
@Form.create()
class ChangePassword extends PureComponent {

  layout = {
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 14,
    },
  };


  handleSearch = e => {
    const { form } = this.props;

    e.preventDefault();
    form.validateFields((err, values) => {
      const { birthday, phone, newPhonePrefix, newPhoneSuffix, ...params } = values;
      params.birthday = birthday && moment(birthday).format('YYYY-MM-DD');
    });
  };

  confirmNewPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('两次密码输入不一致！')
    } else {
      callback()
    }
  }


  render() {
    const { form: { getFieldDecorator } } = this.props;

    return (
      <Form {...this.layout} onSubmit={this.handleSearch}>
        <FormItem label="当前密码">
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '密码不能为空' }],
          })(<Input.Password style={{ width: '50%' }} placeholder="请输入您的密码" />)}
        </FormItem>
        <FormItem label="新密码">
          {getFieldDecorator('newPassword', {
            rules: [{ required: true, message: '密码不能为空'}, { min: 6, max: 16, message: '请输入6-16位密码' }],
            validateTrigger: 'onBlur'
          })(<Input.Password style={{ width: '50%' }} placeholder="请输入您的密码" />)}
        </FormItem>
        <FormItem label="再次确认">
          {getFieldDecorator('confirmNewPassword', {
            rules: [{ required: true, message: '密码不能为空'}, {validator: this.confirmNewPassword}],
            validateTrigger: 'onBlur'
          })(<Input.Password style={{ width: '50%' }} placeholder="请输入您的密码" />)}
        </FormItem>
      </Form>
    );
  }
}
ChangePassword.propsType = {
  info: PropTypes.exact({
    userInfo: PropTypes.object,
    messageList: PropTypes.array,
    messageContent: PropTypes.object,
    messageListTotal: PropTypes.number
  }),
}

ChangePassword.defaultProps = {
  info: {
    userInfo: {},
    messageList: [],
    messageContent: {},
    messageListTotal: 0
  }
}

export default ChangePassword;

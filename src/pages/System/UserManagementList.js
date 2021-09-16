import React, { PureComponent } from 'react';
import {
  Card, Table, Row,
  Col,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Modal,
  Upload,
  message,
  Radio,
  DatePicker, Avatar,
} from 'antd';

import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Wrapper } from '@/utils/utils';
import { imgUrlPath } from '@/global';
import styles from './UserManagementList.less';


const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

class DefaultSrcComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      src: '',
    };
  }

  componentDidMount() {
    const { src } = this.props;
    this.setRenderComponent(imgUrlPath + src);
  }

  setRenderComponent(completeSrc) {
    this.setState({
      src: completeSrc,
    });
  }

  render() {
    const { src } = this.state;
    return <Avatar
      src={src}
      onError={e => {
        if (e) {
          this.setState({
            src: 'https://iph.href.lu/50x50?text=[错误地址]?fg=ffffff&bg=f44336',
          });
        }
      }}
    />;
  }
}

@connect(({ menu, loading }) => ({
  menu,
  loading: loading.models.menu,
}))
@Form.create()
class CreateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      imageUrl: null,
    };
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传JPG/PNG格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大于2MB');
    }
    return isJpgOrPng && isLt2M;
  };

  disabledDate = (current) => current && current > moment().endOf('day');

  render() {
    const { modalVisible, form, handleAdd, handleModalVisible, handleImageUrl, loading, menu: { roleList }, agentList } = this.props;
    const { uploading, imageUrl } = this.state;
    const formateData = data => {
      if (Array.isArray(data)) {
        return data.map(item => item.children
          ? {
            title: item.name,
            value: item.id,
            key: item.id + new Date().getTime(),
            children: formateData(item.children),
          }
          : {
            title: item.name,
            value: item.id,
            key: item.id + new Date().getTime(),
          });
      }
      return [];
    };

    const treeData = roleList.length === 0 ? [] : formateData(roleList);
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        handleAdd(fieldsValue, form);
      });
    };

    const handleChange = info => {
      if (info.file.status === 'uploading') {
        this.setState({ uploading: true });
        return;
      }
      if (info.file.status === 'done') {
        this.getBase64(info.file.originFileObj, imageUrl =>
          this.setState({ imageUrl, uploading: false },
            handleImageUrl(imageUrl),
          ),
        );
      }
    };

    const handleSelect = (object) => {
    };

    return (
      <Modal
        maskClosable={false}
        destroyOnClose
        title="新增用户"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="头像">
          <Upload
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="/empty-item/api/uploadImg"
            onChange={handleChange}
            beforeUpload={this.beforeUpload}
          >
            {imageUrl ? (<img src={imageUrl} alt="image" style={{ width: '100%' }} />) : (
              <div><Icon type={uploading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">添加头像</div>
              </div>
            )}
          </Upload>
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入至多20个字符！', max: 20 }],
          })(<Input placeholder="请输入姓名" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="性别">
          {form.getFieldDecorator('sex', {
            rules: [{ required: false, message: '请选择性别' }],
          })(
            <Radio.Group>
              <Radio value={0}>保密</Radio>
              <Radio value={1}>女</Radio>
              <Radio value={2}>男</Radio>
            </Radio.Group>,
          )}
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="出生日期">
          {form.getFieldDecorator('birthDate', {
            rules: [{ required: false, type: 'object' }],
          })(<DatePicker format="YYYY/MM/DD" disabledDate={this.disabledDate} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号码">
          {form.getFieldDecorator('phone', {
            rules: [{ test: /^1\d{10}$/, message: '请输入正确的手机号码！', max: 11 }],
          })(<Input placeholder="请输入手机号码" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="邮箱">
          {form.getFieldDecorator('email', {})(<Input placeholder="请输入邮箱" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色">
          {form.getFieldDecorator('roleIds', {
            rules: [{ required: true, message: '请选择角色！' }],
          })(
            <Select placeholder="请选择角色" mode="multiple" style={{ width: '100%' }}>
              {treeData &&
              treeData.map(item => (
                <Option value={item.value} key={item.key}>
                  {item.title}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="阅片机构">
          {form.getFieldDecorator('hospitalInfo', {
            rules: [{ required: true, message: '请选择阅片机构！' }],
          })(
            <Select placeholder="选择机构" labelInValue style={{ width: '100%' }} onChange={handleSelect}>
              {agentList && Array.isArray(agentList) && agentList.length > 0 &&
              agentList.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
          {form.getFieldDecorator('remark', {})(<TextArea placeholder="请输入" />)}
        </FormItem>

      </Modal>
    );
  }
}

CreateForm.propTypes = {
  roleList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  })),
};
CreateForm.defaultProps = {
  roleList: [],
};


@Form.create()
class PasswordForm extends PureComponent {
  static defaultProps = {
    handlePassword: () => {
    },
    handlePasswordModalVisible: () => {
    },
    values: {},
    loading: true,
  };

  render() {
    const {
      passwordModalVisible,
      handlePasswordModalVisible,
      handlePassword,
      values,
      form,
      loading,
    } = this.props;

    const okHandle = () => {

      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        if (values.id) {
          handlePassword(fieldsValue, values.id);
        }
      });
    };

    return (
      <Modal
        maskClosable={false}
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="修改密码"
        visible={passwordModalVisible}
        onOk={okHandle}
        onCancel={() => handlePasswordModalVisible(false, values)}
        afterClose={() => handlePasswordModalVisible()}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="当前密码">
          {form.getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入当前密码！' }],
          })(<Input placeholder="请输入当前密码" />)}
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="新密码">
          {form.getFieldDecorator('newPassword', {
            rules: [{ required: true, message: '请输入新密码！' }],
          })(<Input placeholder="请输入新密码" />)}
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="再次输入新密码">
          {form.getFieldDecorator('confirm', {
            rules: [
              { required: true, message: '请再次确认您的密码！' },
              {
                validator(rule, value, callback) {
                  if (!value) {
                    callback();//如果还没填写，则不进行一致性验证
                  }
                  if (value === form.getFieldValue('newPassword')) {
                    callback();
                  } else {
                    callback('两次密码不一致');
                  }
                },
              },
            ],
          })(<Input placeholder="请再次输入新密码" />)}
        </FormItem>
      </Modal>
    );
  }
}


@connect(({ menu, loading }) => ({
  menu,
  loading: loading.models.menu,
}))
@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => {
    },
    handleUpdateModalVisible: () => {
    },
    values: {},
    agentList: [],
    loading: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      imgUrl: null,
    };
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传JPG/PNG格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大于2MB');
    }
    return isJpgOrPng && isLt2M;
  };

  disabledDate = (current) => current && current > moment().endOf('day');

  render() {
    const { uploading } = this.state;
    const {
      updateModalVisible,
      handleUpdateModalVisible,
      handleUpdate,
      values,
      form,
      agentList,
      loading,
      handleImageUrl,
      menu: { roleList, userDetail },
    } = this.props;

    const { headicon, name, sex, phone, email, hospitalId, hospitalName, remark } = values;


    if (headicon) {
      /* this.setState({
         imgUrl: headicon,
       });*/
      handleImageUrl(headicon);
    }
    const formateData = data => {
      if (Array.isArray(data)) {
        return data.map(item => item.children
          ? {
            title: item.name,
            value: item.id,
            key: item.id + new Date().getTime(),
            children: formateData(item.children),
          }
          : {
            title: item.name,
            value: item.id,
            key: item.id + new Date().getTime(),
          });
      }
      return [];
    };
    const treeData = roleList.length === 0 ? [] : formateData(roleList);
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        if (values.id) {
          handleUpdate(fieldsValue, values.id, form);
        }
      });
    };
    const handleChange = info => {
      if (info.file.status === 'uploading') {
        this.setState({ uploading: true });
        return;
      }
      if (info.file.status === 'done') {
        this.getBase64(info.file.originFileObj, imageUrl => {
            this.setState({
              imgUrl: imageUrl,
              uploading: false,
            });
            handleImageUrl(imageUrl);
          },
        );
      }
    };

    if (userDetail) {
      const { roleIds, birthDate } = userDetail;
      const { imgUrl } = this.state;
      return (
        <Modal
          maskClosable={false}
          width={640}
          bodyStyle={{ padding: '32px 40px 48px' }}
          destroyOnClose
          title="编辑角色"
          visible={updateModalVisible}
          onOk={okHandle}
          onCancel={() => handleUpdateModalVisible(false, values)}
          afterClose={() => handleUpdateModalVisible()}
          okText="确定"
          cancelText="取消"
          confirmLoading={loading}
        >
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="头像">
            <Upload
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="/empty-item/api/uploadImg"
              onChange={handleChange}
              beforeUpload={this.beforeUpload}
            >
              {/* eslint-disable-next-line no-nested-ternary */}
              {imgUrl ? (<img src={imgUrl} alt="image" style={{ width: '100%' }} />) : (headicon ? (
                <img src={imgUrlPath + headicon} alt="image" style={{ width: '100%' }} />) : (
                <div><Icon type={uploading ? 'loading' : 'plus'} />
                  <div className="ant-upload-text">添加头像</div>
                </div>
              ))}
            </Upload>
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
            {form.getFieldDecorator('name', {
              initialValue: name,
              rules: [{ required: true, message: '请输入至多20个字符！', max: 20 }],
            })(<Input placeholder="请输入姓名" />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="性别">
            {form.getFieldDecorator('sex', {
              initialValue: sex,
              rules: [{ required: false, message: '请选择性别' }],
            })(
              <Radio.Group>
                <Radio value={0}>保密</Radio>
                <Radio value={1}>女</Radio>
                <Radio value={2}>男</Radio>
              </Radio.Group>,
            )}
          </FormItem>

          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="出生日期">
            {form.getFieldDecorator('birthDate', {
              initialValue: moment(birthDate, 'YYYY-MM-DD'),
              rules: [{ required: false, type: 'object' }],
            })(<DatePicker format="YYYY/MM/DD" disabledDate={this.disabledDate} />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号码">
            {form.getFieldDecorator('phone', {
              initialValue: phone,
              rules: [{ test: /^1\d{10}$/, message: '请输入正确的手机号码！', max: 11 }],
            })(<Input placeholder="请输入手机号码" />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="邮箱">
            {form.getFieldDecorator('email', {
              initialValue: email,
            })(<Input placeholder="请输入邮箱" />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色">
            {form.getFieldDecorator('roleIds', {
              initialValue: roleIds,
              rules: [{ required: true, message: '请选择角色！' }],
            })(
              <Select placeholder="请选择角色" mode="multiple" style={{ width: '100%' }}>
                {treeData &&
                treeData.map(item => (
                  <Option value={item.value} key={item.key}>
                    {item.title}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="阅片机构">
            {form.getFieldDecorator('hospitalInfo', {
              initialValue: { key: hospitalId, label: hospitalName },
              rules: [{ required: true, message: '请选择阅片机构！' }],
            })(
              <Select placeholder="选择机构" labelInValue style={{ width: '100%' }}>
                {agentList && Array.isArray(agentList) && agentList.length > 0 &&
                agentList.map(item => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>

          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
            {form.getFieldDecorator('remark', {
              initialValue: remark,
            })(<TextArea placeholder="请输入" />)}
          </FormItem>
        </Modal>
      );
    }

    return {};

  }
}


@connect(({ users, menu, loading }) => ({
  users,
  menu,
  loading: loading.models.users,
}))
@Form.create()
class List extends React.Component {

  static propTypes = {
    users: PropTypes.object,
    menu: PropTypes.object,
  };

  static defaultProps = {
    users: {
      userList: [],
    },
    menu: {
      agentList: [],
    },
  };

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '用户ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '头像',
        dataIndex: 'headicon',
        key: 'headicon',
        align: 'center',
        render: (record) => {
          if (record) {
            return <DefaultSrcComponent src={record} />;
          }
          return <Avatar
            size={{
              xs: 24,
              sm: 32,
              md: 40,
              lg: 64,
              xl: 80,
              xxl: 100,
            }}
            icon={<Icon type="smile" />}
          />;
        },
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
        render: val => <span>{this.getSexStringByKeys(val)}</span>,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        align: 'center',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
        align: 'center',
      },
      {
        title: '角色',
        dataIndex: 'roleName',
        key: 'roleName',
        align: 'center',
      },
      {
        title: '阅片机构',
        dataIndex: 'hospitalName',
        key: 'hospitalName',
        align: 'center',
      },
      {
        title: '注册时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: text => moment(text).format('YYYY-MM-DD'),
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'stateFr',
        key: 'stateFr',
        align: 'center',
        render: val => <span>{this.renderStatus(val)}</span>,
      },
      {
        title: '操作',
        align: 'center',
        render: (text, record) => (
          <Wrapper>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
            &nbsp;&nbsp;
            <a onClick={() => this.handlePasswordModalVisible(true, record)}>密码</a>
            &nbsp;&nbsp;
            <a
              onClick={() => this.handleChangeStatusConfirm(record)}>{record.stateFr && record.stateFr === 1 ? '停用' : '启用'}</a>
            &nbsp;&nbsp;
            <a onClick={() => this.handleDeleteConfirm(record)}>删除</a>
          </Wrapper>
        ),
      },
    ];

    this.state = {
      allAuth:[],
      addUser: null,
      editUser: null,
      updateModalVisible: false,
      updateFormValues: {},
      passwordModalVisible: false,
      passwordFormValues: {},
      modalVisible: false,
      type: 2,
      imgUrl: null,
      keywords: '',
      params: {
        page: 1,
        limit: 5,
      },
    };

  }

  componentDidMount() {

    const { dispatch, history: { location } } = this.props;
    const { params, keywords, type, addUser, editUser,allAuth } = this.state;
    const { pathname } = location;
    if (typeof localStorage !== 'undefined') {
      const minAuth = JSON.parse(localStorage.getItem('minAuth'));
      if (Array.isArray(minAuth) && minAuth.length > 0) {
        Object.keys(minAuth).forEach(key => {
          if (minAuth[key].path.indexOf(pathname) !== -1) {
            allAuth.push(this.getClassNameArray(minAuth[key].path))
          }
        });
        Object.keys(allAuth).forEach(key=>{
          if(allAuth[key]==='addUser'){
            this.setState({
              addUser:'show'
            })
          }
          if(allAuth[key]==='editUser'){
            this.setState({
              editUser:'show'
            })
          }
        })
      }
    }


    dispatch({
      type: 'users/fetchUserList',
      payload: { ...params, keywords, type },
    });

    dispatch({
      type: 'menu/fetchAgentList',
    });
  }

  getClassNameArray = (routerPath) => routerPath.substring(routerPath.lastIndexOf('/') + 1);


  handleDeleteConfirm = record => {
    Modal.confirm({
      title: '确定删除该用户？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.handleDelete(record);
      },
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    const { id } = record;
    const { params: { limit, page }, type } = this.state;
    dispatch({
      type: 'users/deleteUserById',
      payload: id,
    }).then(res => {
      if (res && res.status === 1 && res.message === '成功') {
        message.success('删除成功');
        dispatch({
          type: 'users/fetchUserList',
          payload: { page, limit, type },
        });
      } else {
        message.error('删除失败');
      }
    });
  };

  handleChangeStatusConfirm = record => {
    Modal.confirm({
      title: `确定${record.stateFr && record.stateFr === 1 ? '停用' : '启用'}该用户？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.handleChangeStatus(record);
      },
    });
  };

  handleChangeStatus = record => {
    const { dispatch } = this.props;
    const { id, stateFr } = record;
    let revertStateFr = null;
    if (stateFr && Number.isInteger(stateFr)) {
      revertStateFr = (stateFr === 1) ? 2 : 1;
    }
    const { params: { limit, page }, type } = this.state;
    dispatch({
      type: 'users/saveUserInfo',
      payload: { id, stateFr: revertStateFr },
    }).then(res => {
      if (res && res.status === 1 && res.message === '成功') {
        message.success(`${stateFr === 1 ? '停用' : '启用'}成功`);
        dispatch({
          type: 'users/fetchUserList',
          payload: { page, limit, type },
        });
      } else {
        message.error(`${stateFr === 1 ? '停用' : '启用'}失败`);
      }
    });

  };

  //change Number(BUT the fk services data is array?) to StringType
  getSexStringByKeys = (sexNumberOrArray) => {
    let sexString = '';
    if (sexNumberOrArray && (typeof sexNumberOrArray === 'string' || typeof sexNumberOrArray === 'number')) {
      if (parseInt(sexNumberOrArray, 10) === 1) {
        sexString = '女';
      } else if (parseInt(sexNumberOrArray, 10) === 2) {
        sexString = '男';
      } else {
        sexString = '保密';
      }
    }
    return sexString;
  };

  renderStatus = (status) => {
    // 阅片系统 1 正常 2 停用
    let stringStatus = '';
    if (status !== null && (typeof status === 'number')) {
      if (status === 1) {
        stringStatus = '启用中';
      } else if (status === 2) {
        stringStatus = '已停用';
      }
    }
    return stringStatus;
  };

  handleTableChange = (current) => {
    const { params, keywords, type } = this.state;
    const { dispatch } = this.props;
    this.setState({
      params: {
        page: current,
        limit: params.limit,
      },
    });
    const newParams = {
      page: current,
      limit: params.limit,
      keywords,
    };
    dispatch({
      type: 'users/fetchUserList',
      payload: { ...newParams, keywords, type },
    });
  };

  handleTableChangePageSize = (current, pageSize) => {
    const { params, keywords, type } = this.state;
    const { dispatch } = this.props;
    this.setState({
      params: {
        limit: pageSize,
      },
    });
    const newParams = {
      page: params.page,
      limit: pageSize,
      keywords,
    };
    dispatch({
      type: 'users/fetchUserList',
      payload: { ...newParams, keywords, type },
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { params: { limit }, type } = this.state;
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        page: 1,
        limit,
      };
      dispatch({
        type: 'users/fetchUserList',
        payload: { ...values, type },
      });
    });
  };

  handleImageUrl = (imageUrl) => {
    this.setState({ imgUrl: imageUrl });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { params, type } = this.state;
    form.resetFields();
    this.setState({
      type: 2,
      keywords: '',
      params: {
        page: 1,
        limit: 5,
      },
    });
    dispatch({
      type: 'users/fetchUserList',
      payload: { page: 1, limit: params.limit, type },
    });

  };

  handleAdd = (fields, form) => {
    const { dispatch } = this.props;
    const params = { ...fields };
    const { imgUrl, params: { limit }, type } = this.state;

    if (imgUrl !== null) {
      params.headicon = imgUrl;
    }
    if (params.birthDate && moment.isMoment(params.birthDate)) {
      params.birthDate = params.birthDate.format();
    }
    if (params.hospitalInfo) {
      params.hospitalId = params.hospitalInfo.key;
      params.hospitalName = params.hospitalInfo.label;
      delete params.hospitalInfo;
    }
    dispatch({
      type: 'users/saveUserInfo',
      payload: { ...params },
    }).then(res => {
      if (res && res.status === 1 && res.message === '成功') {
        message.success('添加成功');
        form.resetFields();
        this.handleModalVisible();
        dispatch({
          type: 'users/fetchUserList',
          payload: { page: 1, limit, type },
        });
      }
    });


  };

  handleModalVisible = flag => {
    //获取角色下拉列表
    const { type } = this.state;
    const { dispatch } = this.props;
    if (flag) {
      dispatch({
        type: 'menu/fetchRoleList',
        payload: { type },
      });
    }
    this.setState({
      modalVisible: !!flag,
    });
  };

  handlePasswordModalVisible = (flag, record) => {
    this.setState({
      passwordModalVisible: !!flag,
      passwordFormValues: record || {},
    });
  };

  handlePassword = (fields, id) => {
    const { params: { limit, page }, type } = this.state;
    const { dispatch } = this.props;
    if (fields) {
      const { confirm } = fields;
      dispatch({
        type: 'users/saveUserInfo',
        payload: { id, password: confirm },
      }).then(res => {
        if (res && res.status === 1 && res.message === '成功') {
          message.success('修改密码成功');
          this.handleModalVisible();
          dispatch({
            type: 'users/fetchUserList',
            payload: { page, limit, type },
          });
        }
      });
    }
    this.handlePasswordModalVisible();
  };

  handleUpdateModalVisible = (flag, record) => {
    const { type } = this.state;
    const { dispatch } = this.props;

    if (flag) {
      dispatch({
        type: 'menu/fetchRoleList',
        payload: { type },
      });
      const { id } = record;
      if (id) {
        //再次获取用户详情？？？？？？为了拿列表里面没有的roleIDs
        dispatch({
          type: 'menu/fetchUserDetail',
          payload: { id },
        });
      }
    }
    this.setState({
      updateModalVisible: !!flag,
      updateFormValues: record || {},
    });
  };

  handleUpdate = (fields, id, form) => {

    const { dispatch } = this.props;
    const params = { ...fields, id };
    const { imgUrl, params: { limit, page }, type } = this.state;
    // console.dir(this.state.imageUrl);

    if (imgUrl !== null) {
      params.headicon = imgUrl;
    }
    if (params.birthDate && moment.isMoment(params.birthDate)) {
      params.birthDate = params.birthDate.format();
    }
    if (params.hospitalInfo) {
      params.hospitalId = params.hospitalInfo.key;
      params.hospitalName = params.hospitalInfo.label;
      delete params.hospitalInfo;
    }
    dispatch({
      type: 'users/saveUserInfo',
      payload: { ...params },
    }).then(res => {
      if (res && res.status === 1 && res.message === '成功') {
        message.success('修改成功');
        form.resetFields();
        this.handleUpdateModalVisible();
        dispatch({
          type: 'users/fetchUserList',
          payload: { page, limit, type },
        });
      }
    });

  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { menu: { agentList } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem>
              {getFieldDecorator('hospitalId')(
                <Select placeholder="机构" style={{ width: '100%' }}>
                  {agentList && Array.isArray(agentList) && agentList.length > 0 &&
                  agentList.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem>
              {getFieldDecorator('keywords')(<Input placeholder="用户ID或姓名" />)}
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
    const { users, loading, menu: { agentList } } = this.props;
    const { userList: { data, dataTotal } } = users;
    const { params, modalVisible, passwordModalVisible, passwordFormValues, updateModalVisible, updateFormValues, addUser, editUser } = this.state;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: () => `共${dataTotal}条`,
      current: params.page,
      pageSize: params.limit,
      total: dataTotal,
      pageSizeOptions: ['5', '10', '15', '20'],
      onChange: (current) => this.handleTableChange(current),
      onShowSizeChange: (current, pageSize) => this.handleTableChangePageSize(current, pageSize),
    };

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleImageUrl: this.handleImageUrl,
    };

    const passwordMethods = {
      handlePasswordModalVisible: this.handlePasswordModalVisible,
      handlePassword: this.handlePassword,
    };

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      handleImageUrl: this.handleImageUrl,
    };

    return (

      <PageHeaderWrapper title="用户列表">
        <Card>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}
                      className={addUser ? styles.show : styles.hide}>
                新增用户
              </Button>
            </div>
            <Table
              loading={loading}
              dataSource={data}
              columns={this.columns}
              pagination={paginationProps}
              rowKey={result => result.id}
              scroll={{ x: 'max-content' }}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} loading={loading} agentList={agentList} />
        <PasswordForm
          {...passwordMethods}
          passwordModalVisible={passwordModalVisible}
          values={passwordFormValues}
          loading={loading}
        />
        <UpdateForm
          {...updateMethods}
          updateModalVisible={updateModalVisible}
          values={updateFormValues}
          agentList={agentList}
          loading={loading}
        />
      </PageHeaderWrapper>
    );
  }
}


export default List;

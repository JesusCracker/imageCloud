import React, { PureComponent } from 'react';
import {
  Table,
  Card,
  Button,
  Form,
  Row,
  Col,
  Input,
  message,
  Modal,
  Tree,
} from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import { Wrapper } from '@/utils/utils';
import styles from '@/pages/System/RoleManagementList.less';

const FormItem = Form.Item;

const { TextArea } = Input;
const { TreeNode } = Tree;

@connect(({ roles, loading }) => ({
  roles,
  loading: loading.models.roles,
}))
@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => {
    },
    handleUpdateModalVisible: () => {
    },
    values: {},
    loading: true,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      updateModalVisible,
      handleUpdateModalVisible,
      handleUpdate,
      values,
      form,
      loading,
      roles: { roleDetail },
    } = this.props;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        if (values.id) {
          handleUpdate(fieldsValue, values.id, form);
        }
      });
    };

    if (roleDetail) {
      const { name, remark } = roleDetail;

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
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名称">
            {form.getFieldDecorator('name', {
              initialValue: name,
              rules: [{ required: true, message: '请输入至多20个字符！', max: 20 }],
            })(<Input placeholder="角色名称" />)}
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

@connect(({ roles, loading }) => ({
  roles,
  loading: loading.models.roles,
}))
@Form.create()
class AuthForm extends PureComponent {

  static defaultProps = {
    handleAuth: () => {
    },
    handleAuthModalVisible: () => {
    },
    values: {},
    loading: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      checkedKeys: [],
    };
  }

  handleCheck = (checkedKeys) => {
    this.setState({
      checkedKeys: checkedKeys.checked.map(item => Number(item)),
    });
  };


  renderTreeNodes = data => data.map(item => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.title} key={item.key} dataRef={item} />;
  });

  render() {
    const {
      authModalVisible,
      handleAuthModalVisible,
      handleAuth,
      values,
      form,
      roles: { authListData, roleDetail },
      loading,
    } = this.props;

    const { checkedKeys } = this.state;
    const { sysAuthoritieIds } = roleDetail;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        if (values.id) {
          handleAuth({ ...fieldsValue, checkedKeys }, values.id, form);
        }
      });
    };

    return (
      <Modal
        maskClosable={false}
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="权限设置"
        visible={authModalVisible}
        onOk={okHandle}
        onCancel={() => handleAuthModalVisible(false, values)}
        afterClose={() => handleAuthModalVisible()}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading}
      >
        <Row style={{ marginTop: 20 }}>
          {sysAuthoritieIds && Array.isArray(sysAuthoritieIds) ?
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名"
                      key={JSON.stringify(sysAuthoritieIds)}>
              {form.getFieldDecorator('authTree', {})(
                <Tree
                  autoExpandParent
                  // checkedKeys={checkedKeys}
                  checkable
                  onCheck={this.handleCheck}
                  checkStrictly
                  selectable={false}
                  defaultCheckedKeys={sysAuthoritieIds.map(String)}
                >
                  {this.renderTreeNodes(authListData)}
                </Tree>,
              )}</FormItem> : ''}


        </Row>
      </Modal>
    );
  }
}


@Form.create()
class CreateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    const { modalVisible, form, handleAdd, handleModalVisible, loading } = this.props;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        handleAdd(fieldsValue, form);
      });
    };

    return (
      <Modal
        maskClosable={false}
        destroyOnClose
        title="新增角色"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading}
      >

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入至多20个字符！', max: 20 }],
          })(<Input placeholder="角色名称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
          {form.getFieldDecorator('remark', {})(<TextArea placeholder="请输入" />)}
        </FormItem>

      </Modal>
    );
  }
}


@connect(({ roles, loading }) => ({
  roles,
  loading: loading.models.roles,
}))
@Form.create()
class List extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      authModalVisible: false,
      authFormValues: {},
      updateModalVisible: false,
      updateFormValues: {},
      modalVisible: false,
      type: 2,
      keywords: '',
      params: {
        page: 1,
        limit: 5,
      },
    };

    this.columns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.id - b.id,

      },
      {
        title: '角色名',
        dataIndex: 'name',
        key: 'name',

      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 400,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: val => <span>{this.getStatusStringByKeys(val)}</span>,

      },
      {
        title: '操作',
        render: (text, record) => (
          <Wrapper>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
            &nbsp;&nbsp;
            <a onClick={() => this.handleAuthModalVisible(true, record)}>权限</a>
            &nbsp;&nbsp;
            <a
              onClick={() => this.handleChangeStatusConfirm(record)}>{record.status && record.status === 1 ? '停用' : '启用'}</a>
          </Wrapper>
        ),
      },

    ];


  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { params, type, keywords } = this.state;
    dispatch({
      type: 'roles/fetchRoleList',
      payload: { ...params, type },
    });

  }

  getStatusStringByKeys = (statusNumber) => {
    let statusString = '';
    if (statusNumber && typeof statusNumber === 'number') {
      if (statusNumber === 1) {
        statusString = '启用中';
      } else {
        statusString = '禁用中';
      }
    }
    return statusString;
  };

  handleChangeStatusConfirm = record => {
    Modal.confirm({
      title: `确定${record.status && record.status === 1 ? '停用' : '启用'}该用户？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.handleChangeStatus(record);
      },
    });
  };

  handleChangeStatus = record => {
    const { dispatch } = this.props;
    const { id, status } = record;
    let revertStatus = null;
    if (status && Number.isInteger(status)) {
      revertStatus = (status === 1) ? 2 : 1;
    }
    const { params: { limit, page }, type } = this.state;
    dispatch({
      type: 'roles/saveRoleInfo',
      payload: { id, status: revertStatus },
    }).then(res => {
      if (res && res.status === 1 && res.message === '成功') {
        message.success(`${status === 1 ? '停用' : '启用'}成功`);
        dispatch({
          type: 'roles/fetchRoleList',
          payload: { page, limit, type },
        });
      } else {
        message.error(`${status === 1 ? '停用' : '启用'}失败`);
      }
    });

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
      type: 'roles/fetchRoleList',
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
      type: 'roles/fetchRoleList',
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
        type: 'roles/fetchRoleList',
        payload: { ...values, type },
      });
    });
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
        // limit: 5,
      },
    });
    dispatch({
      type: 'roles/fetchRoleList',
      payload: { page: 1, limit: params.limit, type },
    });

  };

  handleUpdateModalVisible = (flag, record) => {
    const { dispatch } = this.props;

    if (flag) {
      const { id } = record;
      //角色详情
      if (id) {
        dispatch({
          type: 'roles/fetchRoleDetail',
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
    const { params: { limit, page }, type } = this.state;
    const params = { ...fields, id, type };
    dispatch({
      type: 'roles/saveRoleInfo',
      payload: { ...params },
    }).then(res => {
      if (res && res.status === 1 && res.message === '成功') {
        message.success('角色修改成功');
        form.resetFields();
        this.handleUpdateModalVisible();
        dispatch({
          type: 'roles/fetchRoleList',
          payload: { page, limit, type },
        });
      }
    });

  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = (fields, form) => {
    const { dispatch } = this.props;
    const params = { ...fields };
    const { params: { limit }, type } = this.state;
    dispatch({
      type: 'roles/saveRoleInfo',
      payload: { ...params, type },
    }).then(res => {
      if (res && res.status === 1 && res.message === '成功') {
        message.success('添加角色成功');
        form.resetFields();
        this.handleModalVisible();
        dispatch({
          type: 'roles/fetchRoleList',
          payload: { page: 1, limit, type },
        });
      }
    });
  };

  handleAuthModalVisible = (flag, record) => {
    const { dispatch } = this.props;
    const { type } = this.state;
    if (flag) {
      const { id } = record;
      //权限列表
      dispatch({
        type: 'roles/fetchAuthList',
        payload: { type },
      });
      //获取当前用户的权限
      dispatch({
        type: 'roles/fetchRoleDetail',
        payload: { id },
      });
    }
    this.setState({
      authModalVisible: !!flag,
      authFormValues: record || {},
    });
  };

  handleAuth = (fields, id, form) => {
    const { params: { limit, page }, type } = this.state;
    const { dispatch } = this.props;
    const { checkedKeys } = fields;

    dispatch({
      type: 'roles/saveRoleAuth',
      payload: { sysAuthoritieIds: checkedKeys, type, id },
    }).then(res => {
      if (res && res.status === 1 && res.message === '成功') {
        message.success('添加权限成功');
        form.resetFields();
        this.handleModalVisible();
        dispatch({
          type: 'roles/fetchRoleList',
          payload: { page, limit, type },
        });
      }
    });


    this.handleAuthModalVisible();
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>

          <Col md={8} sm={24}>
            <FormItem>
              {getFieldDecorator('keywords')(<Input placeholder="用户ID或角色名" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24} offset={8}>
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
    const { roles: { roleList }, loading } = this.props;
    const { data, dataTotal } = roleList;
    const { params, type, keywords, modalVisible, updateModalVisible, updateFormValues, authModalVisible, authFormValues } = this.state;

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
    };

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    const authMethods = {
      handleAuthModalVisible: this.handleAuthModalVisible,
      handleAuth: this.handleAuth,
    };

    return (
      <PageHeaderWrapper title="角色列表">
        <Card>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新增角色
              </Button>
            </div>
            <Table
              loading={loading}
              dataSource={data}
              columns={this.columns}
              rowKey={result => result.id}
              pagination={paginationProps}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} loading={loading} />
        <UpdateForm
          {...updateMethods}
          updateModalVisible={updateModalVisible}
          values={updateFormValues}
          loading={loading}
        />
        <AuthForm
          {...authMethods}
          authModalVisible={authModalVisible}
          values={authFormValues}
          loading={loading}
        />
      </PageHeaderWrapper>
    );
  }
}

List.propTypes = {};

export default List;

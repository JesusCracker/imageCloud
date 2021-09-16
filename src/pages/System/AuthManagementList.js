import React, { PureComponent } from 'react';
import { Tree, Button, Card, Row, Modal, Form, Input, TreeSelect, message } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PropTypes from 'prop-types';


const FormItem = Form.Item;
const { TextArea } = Input;

// import styles from './UserManagementList.less';

@connect(({ menu, loading }) => ({
  loading: loading.models.menu,
  menu,
}))
@Form.create()
class CreateForm extends PureComponent {
  static defaultProps = {
    handleAdd: () => {
    },
    handleAddModalVisible: () => {
    },
    menu: {
      parentsMenuData: [],
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      nodeLevel: null,
      nodeKey: null,
    };
  }

  onSelectParentNode = (value, node) => {
    const { level, nodeKey } = node.props;
    this.setState({
      nodeLevel: level,
      nodeKey,
    });
  };

  render() {
    const { form, modalVisible, handleAdd, handleAddModalVisible, loading, menu: { parentsMenuData }, type } = this.props;
    const { nodeLevel, nodeKey } = this.state;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        const fieldData = fieldsValue;
        fieldData.parentId = nodeKey;
        fieldData.type = type;
        Object.keys(fieldsValue).forEach(key => {
          if (key === 'level') {
            fieldData[key] = nodeLevel + 1;
          }
        });
        handleAdd(fieldsValue, form);
      });
    };

    // const filterData = array => array.filter(item => item.resourceType === 'menu');

    // 新建菜单->选择父级菜单时的数据->格式化
    const formateData = data => {
      if (Array.isArray(data)) {
        return data.map(item => item.children
          ? {
            title: item.title,
            level: item.level,
            value: item.key,
            nodeKey: item.key,
            key: item.key + new Date().getTime(),
            children: formateData(item.children),
          }
          : {
            title: item.title,
            level: item.level,
            value: item.key,
            nodeKey: item.key,
            key: item.key + new Date().getTime(),
          });
      }
      return [];
    };
    //获取父级菜单
    const parentTreeData = parentsMenuData.length === 0 ? [] : formateData(parentsMenuData);

    parentTreeData.unshift({
      title: '无',
      value: 0,
      key: 0,
      level: 0,
      nodeKey: 0,
    });

    // 新建菜单需要填的表单
    const menuForm = (
      <Form>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入菜单名称！' }],
          })(<Input placeholder="用于菜单栏中名称显示" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="显示名称">
          {form.getFieldDecorator('title', {
            rules: [{ required: true, message: '请输入显示名称！' }],
          })(<Input placeholder="用于菜单栏中名称显示" />)}
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="上级菜单">
          {form.getFieldDecorator('level', {
            rules: [{ required: true, message: '请选择父级菜单！' }],
          })(
            <TreeSelect
              style={{ width: 300 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={parentTreeData}
              placeholder="请选择"
              treeDefaultExpandAll
              onSelect={this.onSelectParentNode}
            />,
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单URL">
          {form.getFieldDecorator('url', {
            rules: [{ required: true, message: '请输入菜单URL！' }],
          })(<Input placeholder="应与router.config.js中path路径一致" />)}
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="ICON">
          {form.getFieldDecorator('icon', {
            rules: [{ required: false, message: '请输入ICON！' }],
          })(<Input placeholder="请输入菜单icon" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="同级序号">
          {form.getFieldDecorator('orderBy', {
            rules: [{ required: false, message: '请输入权同级序号' }],
          })(<Input placeholder="请输入同级序号" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
          {form.getFieldDecorator('remark', {})(<TextArea placeholder="请输入" />)}
        </FormItem>
      </Form>
    );
    return (
      <Modal
        maskClosable={false}
        destroyOnClose
        title='新建菜单'
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleAddModalVisible()}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading}
      >
        {menuForm}
      </Modal>
    );
  }
}

//updateForm
@connect(({ menu, loading }) => ({
  menu,
  loading: loading.models.menu,
}))
@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    menu: {
      parentsMenuData: [],
    },
    handleUpdate: () => {
    },
    handleUpdateModalVisible: () => {
    },
    currentRecord: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      nodeLevel: null,
      nodeKey: null,
    };
  }

  onUpdateSelectParentNode = (value, node) => {
    const { level, nodeKey } = node.props;

    this.setState({
      nodeLevel: level,
      nodeKey,
    });
  };

  render() {
    const {
      updateModalVisible,
      handleUpdateModalVisible,
      handleUpdate,
      form,
      currentRecord,
      type,
      loading,
      menu: { parentsMenuData },
    } = this.props;


    const { nodeLevel, nodeKey } = this.state;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        const fieldData = fieldsValue;
        if (fieldData && fieldData.parentId !== null) {
          fieldData.parentId = currentRecord && currentRecord.parentId;
        }
        fieldData.parentId = nodeKey;
        fieldData.type = type;
        if (nodeLevel === null) {
          fieldData.level = currentRecord.level;
        } else {
          Object.keys(fieldsValue).forEach(key => {
            if (key === 'level') {
              fieldData[key] = nodeLevel + 1;
            }
          });
        }

        if (currentRecord.id) {
          handleUpdate(fieldData, currentRecord.id, form);
        }
      });
    };


    // 新建菜单->选择父级菜单时的数据->格式化
    const formateData = data => {
      if (Array.isArray(data)) {
        return data.map(item => item.children
          ? {
            title: item.title,
            level: item.level,
            value: item.key,
            nodeKey: item.key,
            key: item.key + new Date().getTime(),
            children: formateData(item.children),
          }
          : {
            title: item.title,
            level: item.level,
            value: item.key,
            nodeKey: item.key,
            key: item.key + new Date().getTime(),
          });
      }
      return [];
    };

    //获取父级菜单
    const parentTreeData = parentsMenuData.length === 0 ? [] : formateData(parentsMenuData);

    parentTreeData.unshift({
      title: '无',
      value: 0,
      key: 0,
      level: 0,
      nodeKey: 0,
    });


    // 编辑菜单需要填的表单
    const menuForm = (
      <Form>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单名称">
          {form.getFieldDecorator('name', {
            initialValue: currentRecord.name,
            rules: [{ required: true, message: '请输入菜单名称！' }],
          })(<Input placeholder="用于菜单栏中名称显示" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="显示名称">
          {form.getFieldDecorator('title', {
            initialValue: currentRecord.title,
            rules: [{ required: true, message: '请输入显示名称！' }],
          })(<Input placeholder="用于菜单栏中名称显示" />)}
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="上级菜单">
          {form.getFieldDecorator('level', {
            initialValue: currentRecord.pName ? currentRecord.pName : '无',
            rules: [{ required: true, message: '请选择父级菜单！' }],
          })(
            <TreeSelect
              style={{ width: 300 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={parentTreeData}
              placeholder="请选择"
              treeDefaultExpandAll
              onSelect={this.onUpdateSelectParentNode}
            />,
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单URL">
          {form.getFieldDecorator('url', {
            initialValue: currentRecord.url,
            rules: [{ required: true, message: '请输入菜单URL！' }],
          })(<Input placeholder="应与router.config.js中path路径一致" />)}
        </FormItem>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="ICON">
          {form.getFieldDecorator('icon', {
            initialValue: currentRecord.icon,
            rules: [{ required: false, message: '请输入ICON！' }],
          })(<Input placeholder="请输入菜单icon" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="同级序号">
          {form.getFieldDecorator('orderBy', {
            initialValue: currentRecord.orderBy,
            rules: [{ required: false, message: '请输入权同级序号' }],
          })(<Input placeholder="请输入同级序号" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
          {form.getFieldDecorator('remark', {
            initialValue: currentRecord.remark,
          })(<TextArea placeholder="请输入" />)}
        </FormItem>
      </Form>
    );


    return (
      <Modal
        maskClosable={false}
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="编辑菜单"
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible(false)}
        afterClose={() => handleUpdateModalVisible()}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading}
      >

        {menuForm}
      </Modal>
    );
  }
}


@connect(({ auth, loading }) => ({
  auth,
  loading: loading.models.auth,
}))

class AuthList extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      addModalVisible: false,
      updateModalVisible: false,
      type: 2,
      currentRecord: null,
    };

  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { type } = this.state;
    dispatch({
      type: 'auth/fetchAuthList',
      payload: { type },
    });
  }

  renderMessage = content => {
    message.error(content);
  };

  handleUpdateModalVisible = (flag, type) => {
    const { dispatch } = this.props;
    const { currentRecord } = this.state;
    if (currentRecord && currentRecord.length > 0) {
      if (flag) {
        dispatch({
          type: 'auth/getAuthorityDetail',
          payload: { id: currentRecord[0], type },
        });
        dispatch({
          type: 'menu/fetchParentsList',
          payload: { type },
        });
      }
      this.setState({
        updateModalVisible: !!flag,
      });
    } else {
      this.renderMessage('请选择节点后再编辑');
    }

  };


  handleAddModalVisible = (flag, type) => {
    const { dispatch } = this.props;
    if (flag) {
      dispatch({
        type: 'menu/fetchParentsList',
        payload: { type },
      });
    }

    this.setState({
      addModalVisible: !!flag,
    });
  };


  handleDeleteConfirm = id => {
    if (id === null) {
      this.renderMessage('请选择节点后再删除');
    } else {
      Modal.confirm({
        title: '确定删除该菜单？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.handleDelete(id);
        },
      });
    }
  };

  handleDelete = (id) => {
    const { dispatch } = this.props;
    const { type } = this.state;
    dispatch({
      type: 'auth/remove',
      payload: id,
    }).then(res => {
      if (res && res.status === 1 && res.message === '成功') {
        message.success('删除成功');
        dispatch({
          type: 'auth/fetchAuthList',
          payload: { type },
        });
      }
    });
  };

  handleCheck = (checkedKeys) => {
    // const currentRecord = checkedKeys.checked.map(item => Number(item)); //当checkable的时候
    const currentRecord = checkedKeys;
    if (currentRecord.length > 1) {
      message.error('只能选择一个权限进行编辑或者删除');
    } else {
      this.setState({
        currentRecord,
      });
    }
  };

  //获取form的数据
  handleAdd = (fields, form) => {
    const { dispatch } = this.props;
    const { type } = this.state;
    dispatch({
      type: 'auth/addAuth',
      payload: fields,
    }).then(res => {
      if (res && res.status === 1 && res.message === '成功') {
        message.success('添加权限成功');
        form.resetFields();
        this.handleAddModalVisible();
        dispatch({
          type: 'auth/fetchAuthList',
          payload: { type },
        });
      }
    });
  };

  //编辑后提交
  handleUpdate = (fields, id, form) => {
    const { dispatch } = this.props;
    const { type } = this.state;
    dispatch({
      type: 'auth/update',
      payload: {
        ...fields,
        id,
      },
    }).then(res => {
      if (res && res.status === 1 && res.message === '成功') {
        message.success('编辑成功');
        form.resetFields();
        this.handleUpdateModalVisible();
        dispatch({
          type: 'auth/fetchAuthList',
          payload: { type },
        });
      }
    });

  };

  filterData = array => array.filter(item => item);

  mapItemToLocals = data => {
    if (Array.isArray(data)) {
      return data.map(item => item.children ? {
          title: item.name,
          value: item.id,
          key: item.id,
          children: this.mapItemToLocals(item.children),
        }
        : {
          title: item.name,
          value: item.id,
          key: item.id,
        });
    }
    return [];
  };


  render() {
    const { auth: { authListData, menuDetail }, loading } = this.props;
    const treeDatas = authListData && Array.isArray(authListData) && authListData.length > 0 ? authListData : [];

    const { addModalVisible, type, updateModalVisible, currentRecord } = this.state;
    const addMethods = {
      handleAdd: this.handleAdd,
      handleAddModalVisible: this.handleAddModalVisible,
    };

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };


    return (

      <PageHeaderWrapper title="权限树">
        <Card>
          <Button
            icon="plus"
            type="primary"
            onClick={() => this.handleAddModalVisible(true, type)}
          >
            新增权限
          </Button>
          <Button
            icon="edit"
            type="primary"
            onClick={() => this.handleUpdateModalVisible(true, type)}
            style={{ marginLeft: 20 }}
          >
            编辑
          </Button>
          <Button
            icon="delete"
            type="primary"
            onClick={() => this.handleDeleteConfirm(currentRecord && currentRecord[0] ? currentRecord[0] : null)}
            style={{ marginLeft: 20 }}
          >
            删除
          </Button>

          <CreateForm {...addMethods} modalVisible={addModalVisible} loading={loading} type={type} />
          {menuDetail && Object.keys(menuDetail).length > 0 ? (
            <UpdateForm
              {...updateMethods}
              currentRecord={menuDetail}
              updateModalVisible={updateModalVisible}
              type={type}
            />
          ) : null}

          <Row style={{ marginTop: 20 }}>
            <Tree
              // checkable
              defaultExpandAll
              // onSelect={onSelect}
              onSelect={this.handleCheck}
              treeData={treeDatas}
              checkStrictly
            />
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}


AuthList.propTypes = {
  auth: PropTypes.object,
};
AuthList.defaultProps = {
  auth: {
    authListData: [],
    menuDetail: {},
  },
};

export default AuthList;

import React, { PureComponent } from 'react';
import { Tree, Card, Button, Row, message, Modal, Form, Input, Radio } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import PropTypes from 'prop-types';
import './ZoneManagementList.less';

const FormItem = Form.Item;
const { TreeNode } = Tree;

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

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="区域名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入区域名称！' }],
          })(<Input placeholder="区域名称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="编码">
          {form.getFieldDecorator('code', {
            rules: [{ required: true, message: '请输入编码！' }],
          })(<Input placeholder="编码" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="同级序号">
          {form.getFieldDecorator('sameCode', {
            rules: [{ required: false }],
          })(<Input placeholder="同级序号" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="上级区域">
          {form.getFieldDecorator('parentCode', {
            rules: [{ required: true, message: '上级区域！' }],
          })(<Input placeholder="上级区域" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态">
          {form.getFieldDecorator('isShow', {
            rules: [{ required: true, message: '请选择' }],
          })(
            <Radio.Group>
              <Radio value={0}>启用</Radio>
              <Radio value={1}>禁用</Radio>
            </Radio.Group>,
          )}
        </FormItem>

      </Modal>
    );
  }
}


@connect(({ zone, loading }) => ({
  zone,
  loading: loading.models.zone,
}))

class List extends PureComponent {
  static propTypes = {
    zone: PropTypes.object,
    zoneTree: PropTypes.arrayOf(PropTypes.shape({
      provinceCode: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      provinceName: PropTypes.string,
    })),
  };

  static defaultProps = {
    zone: {},
    zoneTree: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      params: {},
      type: 2,
      expandedKeys: ['0-0-0', '0-0-1'],
      autoExpandParent: true,
      defaultExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData: [
        /*  { title: 'Expand to load', key: '0' },
          { title: 'Expand to load', key: '1' },
          { title: 'Tree Node', key: '2', isLeaf: true },*/
      ],
    };

  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { params } = this.state;
    dispatch({
      type: 'zone/fetchZoneTree',
      payload: params,
    }).then(res => {
      const { zone: { zoneTree }, loading } = this.props;
      if (res && res.status === 1 && res.message === '成功') {
        this.setState({
          treeData: zoneTree,
        });
      }
    });
  }

  renderMessage = content => {
    message.error(content);
  };

  /*   onExpand = (expandedKeys) => {
      console.log('onExpand-->', expandedKeys);

      dispatch({
        type: `${namespace}/onExpand`,
        payload: {
          expandedKeys,
          autoExpandParent: false,
        }
      });
    }*/


  handleCheck = checkedKeys => {
    if (checkedKeys.checked.length > 1) {
      message.error('只能选择一项区域地址进行操作');
      this.setState({
        checkedKeys: [checkedKeys.checked[0]],
      });
    } else {
      this.setState({ checkedKeys });
    }
  };


  onLoadData = treeNode => {
    const { dispatch } = this.props;
    const { treeData } = this.state;
    const params = {
      key: treeNode.props.dataRef.key,
    };

    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      dispatch({
        type: 'zone/fetchZoneTree',
        payload: params,
      }).then(res => {
        if (res && res.status === 1 && res.message === '成功') {
          const treeNodeObj = treeNode;
          const { zone: { zoneTree } } = this.props;
          if (zoneTree.length === 0) {
            message.error(`当前地址为最小单位地址`);
          } else {
            treeNodeObj.props.dataRef.children = zoneTree;
            this.setState({
              treeData: [...treeData],
            });
          }
        }
      });
      resolve();
    });
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} dataRef={item} />;
    });

  handleDeleteConfirm = () => {
    const { checkedKeys: { checked } } = this.state;
    if (checked === undefined || (checked && checked.length === 0)) {
      this.renderMessage('请选择区域地址后再删除');
    } else if (checked[0].length === 2) {
      this.renderMessage('当前区域禁止删除');
    } else {
      Modal.confirm({
        title: '确定删除该区域吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.handleDelete(...checked);
        },
      });
    }
  };

  handleDelete = (id) => {
    const { dispatch } = this.props;
    const { type, params } = this.state;
    dispatch({
      type: 'zone/deleteZoneById',
      payload: id,
    }).then(res => {
      if (res && res.status === 1 && res.message === '成功') {
        message.success('删除成功');
        dispatch({
          type: 'zone/fetchZoneTree',
          payload: params,
        }).then(result => {
          const { zone: { zoneTree }, loading } = this.props;
          if (result && result.status === 1 && result.message === '成功') {
            this.setState({
              treeData: zoneTree,
            });
          }
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

  };

  render() {

    const { zone: { zoneTree }, loading } = this.props;

    const { expandedKeys, autoExpandParent, defaultExpandParent, checkedKeys, selectedKeys, treeData, type, modalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderWrapper title="区域管理">
        <Card>
          <Button
            icon="plus"
            type="primary"
            onClick={() => this.handleModalVisible(true)}
          >
            新增区域
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
            onClick={() => this.handleDeleteConfirm()}
            style={{ marginLeft: 20 }}
          >
            删除
          </Button>
          <Row style={{ marginTop: 20 }}>
            <Tree
              // onExpand={this.onExpand}
              autoExpandParent={autoExpandParent}
              defaultExpandParent={defaultExpandParent}
              checkedKeys={checkedKeys}
              checkable
              checkStrictly
              selectable={false}
              loadData={this.onLoadData}
              onCheck={this.handleCheck}
            >
              {this.renderTreeNodes(treeData)}
            </Tree>
          </Row>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} loading={loading} />

      </PageHeaderWrapper>
    );
  }
}

List.propTypes = {};

export default List;

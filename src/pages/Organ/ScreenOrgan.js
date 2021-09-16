import React, { PureComponent, Fragment } from 'react';
import { Tree, Button, Row, Modal, Form, Input, Icon, Cascader, TreeSelect, message, Upload, Radio } from 'antd';
import { connect } from 'dva';
import { imgUrlPath } from '@/global';
import PropTypes from 'prop-types';

const FormItem = Form.Item;
const { TextArea } = Input;

//createForm
@connect(({ organ, loading }) => ({
  organ,
  loading: loading.models.organ,
}))
@Form.create()
class CreateForm extends PureComponent {
  static defaultProps = {
    handleAdd: () => {
    },
    handleAddModalVisible: () => {
    },
    handleImageUrl: () => {
    },
    handelAreaChange: () => {
    },
    organ: {
      parentsOrganData: [],
      areaData: [],
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      imageUrl: null,
      araeNode: '',
      areaName: ''
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

  areaOnChange = (value, selectedOptions) => {
    let arrName = [];
    arrName = selectedOptions.map(item => item.label)
    this.setState({
      araeNode: value.join(','),
      areaName: arrName.join(',')
    })
  }

  render() {
    const {
      form,
      modalVisible,
      handleAdd,
      handelAreaChange,
      araeOptionData,
      handleAddModalVisible,
      handleImageUrl,
      loading,
      organ: { parentsOrganData }
    } = this.props;
    const { uploading, imageUrl, araeNode, areaName } = this.state;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        const fieldData = fieldsValue;
        fieldData.areaCode = araeNode;
        fieldData.areaName = areaName;
        handleAdd(fieldsValue, form);
      });
    };

    // 新建机构->选择上级机构时的数据->格式化
    const formateData = data => {
      if (Array.isArray(data)) {
        return data.map(item => item.children
          ? {
            title: item.name,
            parentId: item.parentId,
            value: item.id,
            key: item.id + new Date().getTime(),
            children: formateData(item.children),
          }
          : {
            title: item.name,
            parentId: item.parentId,
            value: item.id,
            key: item.id + new Date().getTime(),
          });
      }
      return [];
    };

    //获取上级机构
    const parentTreeData = formateData(parentsOrganData);

    parentTreeData.unshift({
      title: '无',
      parentId: 0,
      key: 0,
      value: 0,
    });

    const loadData = (selectedOptions) => {
      handelAreaChange(selectedOptions)
    }

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

    // 新建机构需要填的表单
    const addOrganForm = (
      <Form>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="机构logo">
          <Upload
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="/empty-item/api/uploadImg"
            onChange={handleChange}
            beforeUpload={this.beforeUpload}
          >
            {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
            {imageUrl ? (<img src={imageUrl} alt="image" style={{ width: '100%' }} />) : (
              <div><Icon type={uploading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">点击添加logo</div>
              </div>
            )}
          </Upload>
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="机构名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入机构名称！' }],
          })(<Input placeholder="请输入机构名称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="机构简称">
          {form.getFieldDecorator('abbreviation')(
            <Input placeholder="请输入机构简称" />
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="机构编码">
          {form.getFieldDecorator('code')(
            <Input placeholder="请输入机构编码" />
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="上级机构">
          {form.getFieldDecorator('pid')(
            <TreeSelect
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={parentTreeData}
              placeholder="请选择上级机构"
            />,
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="同级序号">
          {form.getFieldDecorator('peerNo', {
            initialValue: '0'
          })(
            <Input />
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="关联区域">
          {form.getFieldDecorator('areaCode', {
            rules: [{ required: true, message: '请选择关联区域！' }],
          })(
            <Cascader
              options={araeOptionData}
              loadData={loadData}
              onChange={this.areaOnChange}
              placeholder="请选择关联区域"
              changeOnSelect
            />
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
          {form.getFieldDecorator('remark', {})(<TextArea placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态">
          {form.getFieldDecorator('status')(
            <Radio.Group>
              <Radio value={1}>启用</Radio>
              <Radio value={0}>禁用</Radio>
            </Radio.Group>,
          )}
        </FormItem>
      </Form>
    );
    return (
      <Modal
        maskClosable={false}
        destroyOnClose
        title='新建机构'
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleAddModalVisible()}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading}
      >
        {addOrganForm}
      </Modal>
    );
  }
}

//updateForm
@connect(({ organ, loading }) => ({
  organ,
  loading: loading.models.organ,
}))
@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    handelAreaChange: () => {
    },
    handleUpdate: () => {
    },
    handleUpdateModalVisible: () => {
    },
    handleImageUrl: () => {
    },
    currentRecord: {},
    organ: {
      parentsOrganData: [],
      areaData: []
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      imgUrl: null,
      araeNode: '',
      areaName: ''
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

  areaOnChange = (value, selectedOptions) => {
    let arrName = [];
    arrName = selectedOptions.map(item => item.label)
    this.setState({
      araeNode: value.join(','),
      areaName: arrName.join(',')
    })
  }

  render() {
    const {
      updateModalVisible,
      handleCloseUpdateModalVisible,
      handleUpdate,
      handleImageUrl,
      form,
      araeOptionData,
      handelAreaChange,
      currentRecord,
      loading,
      organ: { parentsOrganData },
    } = this.props;

    const { uploading, imgUrl, araeNode, areaName } = this.state;
    const { logoUrl } = currentRecord

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        if (currentRecord.id) {
          const fieldData = fieldsValue;
          fieldData.areaCode = araeNode;
          fieldData.areaName = areaName;
          handleUpdate(fieldsValue, currentRecord.id, form);
        }
      });
    };

    // 新建菜单->选择父级菜单时的数据->格式化
    const formateData = data => {
      if (Array.isArray(data)) {
        return data.map(item => item.children
          ? {
            title: item.name,
            parentId: item.parentId,
            value: item.id,
            key: item.id + new Date().getTime(),
            children: formateData(item.children),
          }
          : {
            title: item.name,
            parentId: item.parentId,
            value: item.id,
            key: item.id + new Date().getTime(),
          });
      }
      return [];
    };

    //获取父级菜单
    const parentTreeData = formateData(parentsOrganData);

    parentTreeData.unshift({
      title: '无',
      parentId: 0,
      key: 0,
      value: 0,
    });

    const loadData = (selectedOptions) => {
      handelAreaChange(selectedOptions)
    }

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

    // 编辑菜单需要填的表单
    const menuForm = (
      <Form>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="机构logo">
          <Upload
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="/empty-item/api/uploadImg"
            onChange={handleChange}
            beforeUpload={this.beforeUpload}
          >
            {imgUrl ? (<img src={imgUrl} alt="image1" style={{ width: '100%' }} />) : (logoUrl ? (
              <img src={imgUrlPath + logoUrl} alt="image1" style={{ width: '100%' }} />) : (
                <div><Icon type={uploading ? 'loading' : 'plus'} />
                  <div className="ant-upload-text">添加头像</div>
                </div>
              ))}
          </Upload>
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="机构名称">
          {form.getFieldDecorator('name', {
            initialValue: currentRecord.name,
            rules: [{ required: true, message: '请输入机构名称！' }],
          })(<Input placeholder="请输入机构名称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="机构简称">
          {form.getFieldDecorator('abbreviation', {
            initialValue: currentRecord.abbreviation,
          })(<Input placeholder="请输入机构简称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="机构编码">
          {form.getFieldDecorator('code', {
            initialValue: currentRecord.code,
          })(
            <Input placeholder="请输入机构编码" />
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="上级机构">
          {form.getFieldDecorator('pid', {
            initialValue: currentRecord.pid,
          })(
            <TreeSelect
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={parentTreeData}
              placeholder="请选择上级机构"
            />,
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="同级序号">
          {form.getFieldDecorator('peerNo', {
            initialValue: currentRecord.peerNo ? currentRecord.peerNo : 0,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="关联区域">
          {form.getFieldDecorator('areaCode', {
            initialValue: currentRecord.areaCode.split(','),
            rules: [{ required: true, message: '请选择关联区域！' }],
          })(
            <Cascader
              options={araeOptionData}
              loadData={loadData}
              onChange={this.areaOnChange}
              placeholder=''
              changeOnSelect
            />
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
          {form.getFieldDecorator('remark', {
            initialValue: currentRecord.remark,
          })(<TextArea placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态">
          {form.getFieldDecorator('status', {
            initialValue: currentRecord.status,
          })(
            <Radio.Group>
              <Radio value={1}>启用</Radio>
              <Radio value={0}>禁用</Radio>
            </Radio.Group>
          )}
        </FormItem>
      </Form>
    );

    return (
      <Modal
        maskClosable={false}
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="编辑机构"
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleCloseUpdateModalVisible(false)}
        afterClose={() => handleCloseUpdateModalVisible()}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading}
      >
        {menuForm}
      </Modal>
    );
  }
}

//setForm
@connect(({ organ, loading }) => ({
  organ,
  loading: loading.models.organ,
}))
@Form.create()
class SetForm extends PureComponent {
  static defaultProps = {
    handleSetData: () => {
    },
    handleSetModalVisible: () => {
    },
    currentRecord: {},
    organ: {
      allOrganData: [],
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      practiceReadOther: 1
    };
  }

  handleRadioChange = (e) => {
    this.setState({
      practiceReadOther: e.target.value
    })
  }

  render() {
    const {
      form,
      modalVisible,
      handleSetData,
      currentRecord,
      handleSetModalVisible,
      loading,
      organ: { allOrganData }
    } = this.props;

    const { practiceReadOther } = this.state
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        const fieldData = fieldsValue;
        fieldData.id = currentRecord.id
        fieldData.institutionInfo = JSON.stringify(fieldData.institutionInfo)
        fieldData.technicalSupport = '瀚维智能医疗'
        handleSetData(fieldData, form)
      });
    };

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    // 新建机构->选择上级机构时的数据->格式化
    const formateData = data => {
      if (Array.isArray(data)) {
        return data.map(item => item.children
          ? {
            title: item.name,
            parentId: item.parentId,
            value: item.id,
            key: item.id,
            children: formateData(item.children),
          }
          : {
            title: item.name,
            parentId: item.parentId,
            value: item.id,
            key: item.id,
          });
      }
      return [];
    };

    //获取上级机构
    const parentTreeData = formateData(allOrganData);

    parentTreeData.unshift({
      title: '无',
      parentId: 0,
      key: 0,
      value: 0,
    });

    // 阅片机构配置需要填的表单
    const setReadingForm = (
      <Form>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="阅片分配模式">
          {form.getFieldDecorator('isSysControl', {
            initialValue: currentRecord.isSysControl
          })(
            <Radio.Group onChange={e => this.handleRadioChange(e, 'practiceReadOther')}>
              <Radio style={radioStyle} value={1}>系统分配</Radio>
              <Radio style={radioStyle} value={0}>自由抢单
                {practiceReadOther === 0 || currentRecord.isSysControl=== 0 ? (
                  <span>
                    {form.getFieldDecorator('finishTime', {
                      initialValue: currentRecord.finishTime
                    })(
                      <Input placeholder='多少小时后完成' style={{ width: 150, marginLeft: 10 }} />
                    )}
                  </span>
                ) : ("")}
              </Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="阅片开放范围">
          {form.getFieldDecorator('institutionInfo', {
            initialValue: JSON.parse(currentRecord.institutionInfo)
          })(
            <TreeSelect
              treeCheckable
              maxTagCount={1}
              labelInValue
              treeCheckStrictly
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeDefaultExpandAll
              treeData={parentTreeData}
              placeholder="请选择阅片开放范围"
            />
          )}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="技术支持">
          {form.getFieldDecorator('technicalSupport')(
            <Input disabled placeholder='瀚维智能医疗' />
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

//机构树组件
@connect(({ organ, loading }) => ({
  organ,
  loading: loading.models.organ,
}))
class ScreenOrganList extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      addModalVisible: false,
      updateModalVisible: false,
      setModalVisible: false,
      imgUrl: null,
      currentRecord: null,
      araeOptionData: [],
      iconLoading: false,
      areaNode: '',
      areaName: '',
      areaNum: '',
    };

  }

  //页面初始化
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'organ/fetchOrganList',
      payload: {},
    });
  }

  //弹出提示框
  renderMessage = content => {
    message.error(content);
  };

  handleCloseUpdateModalVisible = (flag) => {
    this.setState({
      updateModalVisible: !!flag
    });
  }

  //点击编辑按钮
  handleUpdateModalVisible = (flag) => {
    const { dispatch } = this.props;
    const { currentRecord, iconLoading } = this.state;
    if (currentRecord && currentRecord.length > 0) {
      if (flag) {
        dispatch({
          type: 'organ/getOrganorityDetail',
          payload: { id: currentRecord[0] },
        }).then((res) => {
          if (res && res.status === 1 && res.message === '成功') {
            const updateData = res.data
            this.setState({
              iconLoading: true,
              areaNum: updateData.areaCode,
              areaNode: updateData.areaCode.split(','),
              areaName: updateData.areaName,
              imgUrl: updateData.logoUrl ? updateData.logoUrl : ''
            })
          }
        });
        dispatch({
          type: 'organ/fetchOrganList',
          payload: {},
        });
        dispatch({
          type: 'organ/fetchRelatedArea',
          payload: {},
        }).then((res) => {
          if (res && res.status === 1 && res.message === '成功') {
            const { areaNode } = this.state
            const provinceList = res.data;
            const provinceOption = provinceList && provinceList.map(item => item.key ? {
              label: item.title,
              value: item.key,
              isLeaf: false
            } : []);
            this.setState({
              araeOptionData: provinceOption,
            });
            this.getCityNode(areaNode[0])
          }
        })
      }
      if (!iconLoading) {
        this.setState({
          updateModalVisible: !flag,
          iconLoading: false
        });
      }

    } else {
      this.renderMessage('请选择机构后再编辑');
    }
  };

  //根据省获取市
  getCityNode = (data) => {
    const { dispatch } = this.props
    const { araeOptionData } = this.state
    let cityArr = []
    araeOptionData.map((item) => {
      if (data === item.value) {
        cityArr = item
      }
      return cityArr
    })
    const targetOption = cityArr
    dispatch({
      type: 'organ/fetchRelatedArea',
      payload: { key: data },
    }).then((res) => {
      if (res && res.status === 1 && res.message === '成功') {
        const { areaNode } = this.state
        const provinceList = res.data;
        targetOption.children = provinceList && provinceList.map(item => item.key ? {
          label: item.title,
          value: item.key,
          isLeaf: false
        } : []);
        this.setState({
          araeOptionData: [...araeOptionData],
        });
        this.getAreaData(areaNode[1])
      }
    })
  }

  //根据市获取区县
  getAreaData = (data) => {
    const { dispatch } = this.props
    const { araeOptionData } = this.state
    let areaArr = []
    araeOptionData.map((item) => {
      if (item.children) {
        item.children.map((e) => {
          if (data === e.value) {
            areaArr = e
          }
          return []
        })
        return areaArr
      }
      return [];
    })
    const targetOption = areaArr
    dispatch({
      type: 'organ/fetchRelatedArea',
      payload: { key: data },
    }).then((res) => {
      if (res && res.status === 1 && res.message === '成功') {
        const provinceList = res.data;
        targetOption.children = provinceList && provinceList.map(item => item.key ? {
          label: item.title,
          value: item.key,
          isLeaf: true
        } : []);
        this.setState({
          araeOptionData: [...araeOptionData],
          iconLoading: false
        });
        this.handleUpdateModalVisible()
      }
    })
  }

  //点击新增按钮
  handleAddModalVisible = flag => {
    const { dispatch } = this.props;
    if (flag) {
      dispatch({
        type: 'organ/fetchOrganListData',
      });
      dispatch({
        type: 'organ/fetchRelatedArea',
        payload: {},
      }).then((res) => {
        if (res && res.status === 1 && res.message === '成功') {
          const provinceList = res.data;
          const provinceOption = provinceList && provinceList.map(item => item.key ? {
            label: item.title,
            value: item.key,
            isLeaf: false
          } : []);
          this.setState({
            araeOptionData: provinceOption,
          });
        }
      })
    }
    this.setState({
      addModalVisible: !!flag,
    });
  };

  //点击删除按钮
  handleDeleteConfirm = id => {
    if (id === null) {
      this.renderMessage('请选择机构后再删除');
    } else {
      Modal.confirm({
        title: '确定删除该机构吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.handleDelete(id);
        },
      });
    }
  };

  //点击配置按钮
  handleSetModalVisible = (flag) => {
    const { dispatch } = this.props;
    const { currentRecord } = this.state;
    if (currentRecord && currentRecord.length > 0) {
      if (flag) {
        dispatch({
          type: 'organ/getOrganorityDetail',
          payload: { id: currentRecord[0] },
        })
        dispatch({
          type: 'organ/fetchOrganAllList',
          payload: {},
        });
      }
      this.setState({
        setModalVisible: !!flag,
      });
    } else {
      this.renderMessage('请选择机构后再配置');
    }
  };

  //删除确认，请求接口
  handleDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organ/remove',
      payload: id,
    }).then(res => {
      if (res && res.status === 1 && res.message === '成功') {
        message.success('删除成功');
        dispatch({
          type: 'organ/fetchOrganList',
          payload: {},
        });
      }
    });
  };

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

  //上传照片，修改state中的值
  handleImageUrl = (imageUrl) => {
    this.setState({ imgUrl: imageUrl });
  };

  //选择区域后继续调用
  handelAreaChange = (selectedOptions) => {
    const { dispatch } = this.props;
    const { araeOptionData } = this.state
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    const params = {
      key: targetOption.value,
    };
    return new Promise((resolve) => {
      targetOption.loading = false;
      dispatch({
        type: 'organ/fetchRelatedArea',
        payload: params,
      }).then(res => {
        if (res && res.status === 1 && res.message === '成功') {
          if (res.data.length === 0) {
            message.error(`当前地址为最小单位地址`);
          } else {
            const provinceList = res.data;
            targetOption.children = provinceList && provinceList.map(item => item.key ? {
              label: item.title,
              value: item.key,
              isLeaf: selectedOptions.length === 2
            } : '');
            this.setState({
              araeOptionData: [...araeOptionData],
            });
          }
        }
      });
      resolve();
    });
  }

  //新增提交
  handleAdd = (fields, form) => {
    const { dispatch } = this.props;
    const params = { ...fields };
    const { imgUrl } = this.state;

    if (imgUrl !== null) {
      params.logoUrl = imgUrl;
    }
    dispatch({
      type: 'organ/addOrgan',
      payload: { ...params },
    }).then(res => {
      if (res && res.status === 1 && res.message === '成功') {
        message.success('添加成功');
        form.resetFields();
        this.handleAddModalVisible();
        dispatch({
          type: 'organ/fetchOrganList',
          payload: {},
        });
      }
    });
  };

  //编辑后提交
  handleUpdate = (fields, id, form) => {
    const { dispatch } = this.props;
    const { areaNum, areaName } = this.state
    const params = { ...fields };
    const { imgUrl } = this.state;

    if (imgUrl !== null) {
      params.logoUrl = imgUrl;
    }
    if (params.areaCode === '') {
      params.areaCode = areaNum
      params.areaName = areaName
    }
    dispatch({
      type: 'organ/update',
      payload: {
        ...params,
        id,
      },
    }).then(res => {
      if (res && res.status === 1 && res.message === '成功') {
        message.success('编辑成功');
        form.resetFields();
        this.handleCloseUpdateModalVisible();
        dispatch({
          type: 'organ/fetchOrganList',
          payload: {},
        });
      }
    });
  };

  //配置保存
  handleSetData = (fields, form) => {
    const { dispatch } = this.props;
    const params = { ...fields };
    dispatch({
      type: 'organ/addOrgan',
      payload: { ...params },
    }).then(res => {
      if (res && res.status === 1 && res.message === '成功') {
        message.success('配置成功');
        form.resetFields()
        this.handleSetModalVisible();
        dispatch({
          type: 'organ/fetchOrganList',
          payload: {},
        });
      }
    });
  };

  render() {
    const { organ: { organListData, menuDetail }, loading } = this.props;
    const { addModalVisible, araeOptionData, updateModalVisible, currentRecord, setModalVisible, iconLoading } = this.state;
    //新增组件调用的方法
    const addMethods = {
      handleAdd: this.handleAdd,
      handleAddModalVisible: this.handleAddModalVisible,
      handleImageUrl: this.handleImageUrl,
      handelAreaChange: this.handelAreaChange
    };
    //编辑组件调用的方法
    const updateMethods = {
      handleCloseUpdateModalVisible: this.handleCloseUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      handleImageUrl: this.handleImageUrl,
      handelAreaChange: this.handelAreaChange
    };
    //配置组件调用的方法
    const setMethods = {
      handleSetModalVisible: this.handleSetModalVisible,
      handleSetData: this.handleSetData
    };

    //重构得到的树列表的值
    const treeDatas = organListData && Array.isArray(organListData) && organListData.length > 0 ? organListData : [];
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
          icon="plus"
          type="primary"
          onClick={() => this.handleAddModalVisible(true)}
        >
          新增机构
        </Button>
        <Button
          icon="poweroff"
          loading={iconLoading}
          type="primary"
          onClick={() => this.handleUpdateModalVisible(true)}
          style={{ marginLeft: 20 }}
        >
          编辑
        </Button>
        <Button
          icon="delete"
          type="danger"
          onClick={() => this.handleDeleteConfirm(currentRecord && currentRecord[0] ? currentRecord[0] : null)}
          style={{ marginLeft: 20 }}
        >
          删除
        </Button>
        <Button
          icon="setting"
          type="primary"
          style={{ marginLeft: 20 }}
          onClick={() => this.handleSetModalVisible(true)}
        >
          配置
        </Button>

        <CreateForm {...addMethods} araeOptionData={araeOptionData} modalVisible={addModalVisible} loading={loading} />
        {menuDetail && Object.keys(menuDetail).length > 0 ? (
          <UpdateForm
            {...updateMethods}
            currentRecord={menuDetail}
            araeOptionData={araeOptionData}
            updateModalVisible={updateModalVisible}
          />
        ) : null}
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


ScreenOrganList.propTypes = {
  organ: PropTypes.object,
};
ScreenOrganList.defaultProps = {
  organ: {
    organListData: [],
    menuDetail: {},
    parentsOrganData: [],
    areaData: [],
    allOrganData: []
  },
};

export default ScreenOrganList;

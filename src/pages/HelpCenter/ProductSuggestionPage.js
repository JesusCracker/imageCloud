import React, { PureComponent } from 'react';
import { Card, Col, Form, Icon, Input, message, Modal, Radio, Row, Upload, Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from 'dva';
import styles from './ProductSuggestion.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ suggestion, loading }) => ({
  loading: loading.models.suggestion,
  suggestion,
}))
@Form.create()

class ProductSuggestionPage extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
    };
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      // eslint-disable-next-line no-param-reassign
      file.preview = await this.getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  // 提交产品建议
  confirmHandle = (e) => {
    e.preventDefault();
    const { form } = this.props;
    const { fileList } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { type, adviseContent, phoneNum } = fieldsValue;
      const fileListArr = fileList.map((file) => this.getBase64(file.originFileObj));
      Promise.all(fileListArr).then((values) => {
        const params = {
          type,
          adviseContent,
          phoneNum,
          pictureList: values,
          userId: localStorage.getItem('id'),
          userName: JSON.parse(localStorage.getItem('name')),
        };
        this.sendAction(params);
      });
    });
  };

  sendAction = (params) => {
    const { form } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'suggestion/productSuggestion',
      payload: params,
    }).then(res => {
      if (res?.status === 1) {
        message.success('提交成功');
        form.resetFields();
      }
    });
  };

  getBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  handleChange = ({ file, fileList }) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传JPG/PNG格式的图片!');
      return;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大于5MB!');
      return;
    }
    this.setState({ fileList });
  };

  render() {
    const { form } = this.props;
    const { previewVisible, previewImage, fileList } = this.state;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    // 新建菜单需要填的表单
    const menuForm = (
      <Form onSubmit={this.confirmHandle}>
        <Row>
          <Col offset={3}>
            <p className={`${styles.note} ${styles.noteMargin}`}>你可以通过访问 <a>「帮助中心」</a> 查看常见问题、产品手册解决问题</p>
          </Col>
        </Row>
        <FormItem {...formItemLayout} label="建议类型">
          {form.getFieldDecorator('type', {
            initialValue: '4',
          })(
            <Radio.Group className={styles.radioSpace}>
              <Radio.Button value="1">读图问题</Radio.Button>
              <Radio.Button value="2">报告问题</Radio.Button>
              <Radio.Button value="3">操作问题</Radio.Button>
              <Radio.Button value="4">其他问题</Radio.Button>
            </Radio.Group>,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="建议内容">
          {form.getFieldDecorator('adviseContent', {
            rules: [{ required: true, message: '请输入建议内容!' }, { min: 5, message: '建议内容字数小于5字!' }, {
              max: 500,
              message: '建议内容字数大于500字!',
            }],
          })(<TextArea
            placeholder="请输入消息内容"
            autoSize={{ minRows: 3 }}
          />)}
          <Row>
            <Col span={8} offset={16}>
              <span style={{ float: 'right' }}>（5-500字）</span>
            </Col>
          </Row>
        </FormItem>
        <FormItem {...formItemLayout} label="上传图片">
          <div className="clearfix">
            <Upload
              // action="/empty-item/api/uploadImg"
              listType="picture-card"
              fileList={fileList}
              onPreview={this.handlePreview}
              onChange={this.handleChange}
              beforeUpload={() => false}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
        </FormItem>
        <FormItem {...formItemLayout} label="联系方式">
          {form.getFieldDecorator('phoneNum')(
            <Input placeholder="请留下联系方式(手机号、邮箱)" />,
          )}
        </FormItem>
        <Row>
          <Col offset={6}>
            <p className={styles.note}>如果你的意见常见而有价值，我们将会精选至帮助中心/常见问题</p>
          </Col>
        </Row>
        <FormItem>
          <Row>
            <Col span={6} offset={16}>
              <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
                确定
              </Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
    );
    return (
      <PageHeaderWrapper title="提交产品建议">
        <Card>
          {menuForm}
        </Card>
      </PageHeaderWrapper>
    );
  }
}


export default ProductSuggestionPage;

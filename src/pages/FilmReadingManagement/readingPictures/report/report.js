import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Radio, Icon, InputNumber, Form, Button, Collapse, message, Input, Menu, Dropdown } from 'antd';
import moment from 'moment'
import { imgUrlPath } from '@/global';
import ViewReportComponent from '@/components/ViewReportComponent'
import noImg from '@/assets/no-img.png';
import styles from './report.less';


const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { Panel } = Collapse;
const { TextArea } = Input;

let luuid = 1;
let ruuid = 1;

@connect(({ readingPictures, loading }) => ({
  readingPictures,
  loading: loading.models.readingPictures,
}))
@Form.create({
  onValuesChange(_, __, allValues) {
    _.dispatch({
      type: 'readingPictures/saveState',
      payload: {resultPic: allValues.resultPic},
    });
  },
})
class Report extends PureComponent {
  constructor(props){
    super(props);
    const {resultPic} = props.readingPictures;
    this.state = {
      lImg: '',
      rImg: '',
      resultPic,
      preview: false
    }
  }

  componentDidMount(){
    const { readingPictures } = this.props;
    const {findDataImgData} = readingPictures;

    let { lImg, rImg } = '';
    if(findDataImgData){
      const data = findDataImgData.filter(v => v.isOK);
      data.map(v => {
        if(v.location === 'L') lImg = v.pictureUrl;
        else if(v.location === 'R') rImg = v.pictureUrl;
        return v;
      })

      this.setState({lImg, rImg})
    }
  }

  componentWillReceiveProps(nextProps){
    const {lImg: lImg1,rImg: rImg1} = this.state;
    const {findDataImgData} = nextProps.readingPictures;
    let { lImg, rImg } = '';
    if(findDataImgData){
      const data = findDataImgData.filter(v => v.isOK);
      data.map(v => {
        if(v.location === 'L') lImg = v.pictureUrl;
        else if(v.location === 'R') rImg = v.pictureUrl;
        return v;
      })
      if(lImg1 !== lImg || rImg1 !== rImg) this.setState({lImg, rImg})
    }
  }
  
  remove = (k, type) => {
    const { form } = this.props;
    const keys = type === 'l' ? form.getFieldValue('leftArr') : form.getFieldValue('rightArr');
    if (keys.length === 1) {
      return;
    }
    if(type === 'l'){
      form.setFieldsValue({
        leftArr: keys.filter((_, i) => i !== k),
      });
    } else {
      form.setFieldsValue({
        rightArr: keys.filter((_, i) => i !== k),
      });
    }
  }

  add = (type) => {
    const { form } = this.props;
    if(type === 'l') {
      luuid += 1;
      const leftArr = form.getFieldValue('leftArr');
      const nextKeys = leftArr.concat(luuid);
      form.setFieldsValue({
        leftArr: nextKeys,
      });
    } else {
      ruuid += 1;
      const rightArr = form.getFieldValue('rightArr');
      const nextKeys = rightArr.concat(ruuid);
      form.setFieldsValue({
        rightArr: nextKeys,
      });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {form} = this.props
    form.validateFields((err, values) => {
      if (err) message.error('请填写完整报告信息！')
      // else console.log(values)
    });
  }

  set = (type) => {
    const {form, readingPictures} = this.props;
    const {resultPic} = readingPictures;
    const { getFieldDecorator, getFieldValue } = form;
    const val = type === 'l' ? getFieldValue(`resultPic.left['囊肿']`) : getFieldValue(`resultPic.right['囊肿']`);
    const label = `resultPic.${type === 'l' ? 'left' : 'right'}['囊肿信息']`;
    const label1 = resultPic[type === 'l' ? 'left' : 'right']['囊肿信息'] || {};
    
    return (val === '1个' || val === '2-3个' || val === '数个') && (
      <div className={styles.data1}>
        <p className={styles.title3}>最大单纯性囊肿部位：</p>
        <div className={styles.data1Con}>
          <FormItem
            label="象限法定位："
          >
            {getFieldDecorator(`${label}.xiangxian`, {
              initialValue: label1.xiangxian,
              rules: [{
                required: true, message: '请选择象限法定位！！！',
              }],
            })(
              <RadioGroup>
                <Radio value='外上'>外上</Radio>
                <Radio value='外下'>外下</Radio>
                <Radio value='内上'>内上</Radio>
                <Radio value='内下'>内下</Radio>
              </RadioGroup>
            )}
          </FormItem>
          
          <FormItem
            className={styles.flex}
            label="最大切面长径(mm)："
          >
            {getFieldDecorator(`${label}.tangent_plane_with`, {
              initialValue: label1.tangent_plane_with,
              rules: [{
                required: true, message: '请填写最大切面长径！！！',
              }],
            })(
              <InputNumber min={0} />
            )}
          </FormItem>

          <FormItem
            className={styles.flex}
            label="最大切面直径(mm)："
          >
            {getFieldDecorator(`${label}.tangent_plane_height`, {
              initialValue: label1.tangent_plane_height,
              rules: [{
                required: true, message: '请填写最大切面直径！！！',
              }],
            })(
              <InputNumber min={0} />
            )}
          </FormItem>

          <FormItem
            label="病灶评估(BI_RADS分类)："
          >
            {getFieldDecorator(`${label}.fenlei`, {
              initialValue: label1.fenlei,
              rules: [{
                required: true, message: '请选择病灶评估(BI_RADS分类)！！！',
              }],
            })(
              <RadioGroup>
                <Radio value={1}>1 类</Radio>
                <Radio value={2}>2 类</Radio>
                <Radio value={3}>3 类</Radio>
                <Radio value={4}>4 类</Radio>
                <Radio value={5}>5 类</Radio>
                <Radio value={0}>0 类</Radio>
              </RadioGroup>
            )}
          </FormItem>
        </div>
      </div>
    )
  }

  setHTML = (label, wz, i, type) => {
    const {form} = this.props;
    const { getFieldDecorator } = form;
    let str;
    if(type){
      str = (
        <div className={styles.data1Con}>
          <FormItem
            label="象限法定位："
          >
            {getFieldDecorator(`${label}[${i}].xiangxian`, {
              rules: [{
                required: true, message: '请选择象限法定位！！！',
              }],
            })(
              <RadioGroup>
                <Radio value='外上'>外上</Radio>
                <Radio value='外下'>外下</Radio>
                <Radio value='内上'>内上</Radio>
                <Radio value='内下'>内下</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            className={styles.flex}
            label="最大切面长径(mm)："
          >
            {getFieldDecorator(`${label}[${i}].tangent_plane_with`, {
              rules: [{
                required: true, message: '请填写最大切面长径！！！',
              }],
            })(
              <InputNumber min={0} />
            )}
          </FormItem>
          
          <FormItem
            className={styles.flex}
            label="最大切面直径(mm)："
          >
            {getFieldDecorator(`${label}[${i}].tangent_plane_height`, {
              rules: [{
                required: true, message: '请填写最大切面直径！！！',
              }],
            })(
              <InputNumber min={0} />
            )}
          </FormItem>
  
          <FormItem
            label="形状："
          >
            {getFieldDecorator(`${label}[${i}].xingtai_${wz}`, {
              rules: [{
                required: true, message: '请选择形状！！！',
              }],
            })(
              <RadioGroup>
                <Radio value='规则'>规则</Radio>
                <Radio value='不规则'>不规则</Radio>
              </RadioGroup>
            )}
          </FormItem>
  
          <FormItem
            label="边界："
          >
            {getFieldDecorator(`${label}[${i}].bianjie_${wz}`, {
              rules: [{
                required: true, message: '请选择边界！！！',
              }],
            })(
              <RadioGroup>
                <Radio value='清晰'>清晰</Radio>
                <Radio value='不清晰'>不清晰</Radio>
              </RadioGroup>
            )}
          </FormItem>
  
          <FormItem
            label="纵横比："
          >
            {getFieldDecorator(`${label}[${i}].fangxiang_${wz}`, {
              rules: [{
                required: true, message: '请选择纵横比！！！',
              }],
            })(
              <RadioGroup>
                <Radio value='>1'>{'>'}1</Radio>
                <Radio value='≤1'>≤1</Radio>
              </RadioGroup>
            )}
          </FormItem>
  
          <FormItem
            label="内部回声："
          >
            {getFieldDecorator(`${label}[${i}].huishengxingzhi_${wz}`, {
              rules: [{
                required: true, message: '请选择内部回声！！！',
              }],
            })(
              <RadioGroup>
                <Radio value='无回声'>无回声</Radio>
                <Radio value='低回声'>低回声</Radio>
                <Radio value='高回声'>高回声</Radio>
                <Radio value='混合回声'>混合回声</Radio>
              </RadioGroup>
            )}
          </FormItem>
  
          <FormItem
            label="后方特征："
          >
            {getFieldDecorator(`${label}[${i}].houfanghuisheng_${wz}`, {
              rules: [{
                required: true, message: '请选择后方特征！！！',
              }],
            })(
              <RadioGroup>
                <Radio value='无变化'>无变化</Radio>
                <Radio value='衰减'>衰减</Radio>
                <Radio value='增强'>增强</Radio>
              </RadioGroup>
            )}
          </FormItem>
  
  
          <FormItem
            label="病灶评估(BI_RADS分类)："
          >
            {getFieldDecorator(`${label}[${i}].fenlei`, {
              rules: [{
                required: true, message: '请选择病灶评估(BI_RADS分类)！！！',
              }],
            })(
              <RadioGroup>
                <Radio value={1}>1 类</Radio>
                <Radio value={2}>2 类</Radio>
                <Radio value={3}>3 类</Radio>
                <Radio value={4}>4 类</Radio>
                <Radio value={5}>5 类</Radio>
                <Radio value={0}>0 类</Radio>
              </RadioGroup>
            )}
          </FormItem>
  
          <FormItem
            label="是否有可疑淋巴结："
          >
            {getFieldDecorator(`${label}[${i}].keyilinbajie_${wz}`, {
              rules: [{
                required: true, message: '请选择是否有可疑淋巴结！！！',
              }],
            })(
              <RadioGroup>
                <Radio value='否'>否</Radio>
                <Radio value='是'>是</Radio>
              </RadioGroup>
            )}
          </FormItem>
          
          { this.set3(label, wz, i) }
        </div>
      )
    } else {
      str = (
        <div className={styles.data1Con}>
          <FormItem
            label="象限法定位："
          >
            {getFieldDecorator(`${label}[${i}].xiangxian`, {
              rules: [{
                required: true, message: '请选择象限法定位！！！',
              }],
            })(
              <RadioGroup>
                <Radio value='外上'>外上</Radio>
                <Radio value='外下'>外下</Radio>
                <Radio value='内上'>内上</Radio>
                <Radio value='内下'>内下</Radio>
                <Radio value='中心区'>中心区</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            label="时钟法定位："
          >
            {getFieldDecorator(`${label}[${i}].shizhong`, {
              rules: [{
                required: true, message: '请选择时钟法定位！！！',
              }],
            })(
              <RadioGroup>
                { [1,2,3,4,5,6,7,8,9,10,11,12,'乳晕'].map(v => <Radio key={v} value={v}>{v}</Radio>) }
              </RadioGroup>
            )}
          </FormItem>
          
          <FormItem
            label="大小："
          >
            {getFieldDecorator(`${label}[${i}].daxiao`, {
              rules: [{
                required: true, message: '请选择大小！！！',
              }],
            })(
              <RadioGroup>
                <Radio value='可测量'>可测量</Radio>
                <Radio value='不可测量'>不可测量</Radio>
              </RadioGroup>
            )}
            { this.set2(label, i) }
          </FormItem>
  
  
          <FormItem
            label="形态："
          >
            {getFieldDecorator(`${label}[${i}].xingtai_${wz}`, {
              rules: [{
                required: true, message: '请选择形态！！！',
              }],
            })(
              <RadioGroup>
                <Radio value='椭圆'>椭圆</Radio>
                <Radio value='圆形'>圆形</Radio>
                <Radio value='不规则'>不规则</Radio>
                <Radio value='分叶状'>分叶状</Radio>
              </RadioGroup>
            )}
          </FormItem>
  
          <FormItem
            label="方向："
          >
            {getFieldDecorator(`${label}[${i}].fangxiang_${wz}`, {
              rules: [{
                required: true, message: '请选择方向！！！',
              }],
            })(
              <RadioGroup>
                <Radio value='纵横比≥1'>纵横比≥1</Radio>
                <Radio value='纵横比≤1'>{'纵横比<1'}</Radio>
              </RadioGroup>
            )}
          </FormItem>
  
          <FormItem
            label="边界："
          >
            {getFieldDecorator(`${label}[${i}].bianjie_${wz}`, {
              rules: [{
                required: true, message: '请选择边界！！！',
              }],
            })(
              <RadioGroup>
                <Radio value='锐利'>锐利</Radio>
                <Radio value='回声晕环'>回声晕环</Radio>
              </RadioGroup>
            )}
          </FormItem>
  
          <FormItem
            label="边缘："
          >
            {getFieldDecorator(`${label}[${i}].bianyuan_${wz}`, {
              rules: [{
                required: true, message: '请选择边缘！！！',
              }],
            })(
              <RadioGroup>
                <Radio value='清晰'>清晰</Radio>
                <Radio value='不清晰'>不清晰</Radio>
              </RadioGroup>
            )}
          </FormItem>
  
          <FormItem
            label="内部回声："
          >
            {getFieldDecorator(`${label}[${i}].nhuisheng_${wz}`, {
              rules: [{
                required: true, message: '请选择内部回声！！！',
              }],
            })(
              <RadioGroup>
                <Radio value='低'>低</Radio>
                <Radio value='等'>等</Radio>
                <Radio value='高'>高</Radio>
                <Radio value='均匀'>均匀</Radio>
                <Radio value='不均匀'>不均匀</Radio>
              </RadioGroup>
            )}
          </FormItem>
  
          <FormItem
            label="后方回声："
          >
            {getFieldDecorator(`${label}[${i}].hhuisheng_${wz}`, {
              rules: [{
                required: true, message: '请选择后方回声！！！',
              }],
            })(
              <RadioGroup>
                <Radio value='无变化'>无变化</Radio>
                <Radio value='衰减'>衰减</Radio>
                <Radio value='增强'>增强</Radio>
              </RadioGroup>
            )}
          </FormItem>
  
          <FormItem
            label="钙化灶："
          >
            {getFieldDecorator(`${label}[${i}].gaikuaizhao_${wz}`, {
              rules: [{
                required: true, message: '请选择钙化灶！！！',
              }],
            })(
              <RadioGroup>
                <Radio value='无'>无</Radio>
                <Radio value='粗大'>粗大</Radio>
                <Radio value='细小'>细小</Radio>
              </RadioGroup>
            )}
          </FormItem>
  
          <FormItem
            label="血流："
          >
            {getFieldDecorator(`${label}[${i}].xueliu_${wz}`, {
              rules: [{
                required: true, message: '请选择血流！！！',
              }],
            })(
              <RadioGroup>
                <Radio value='无'>无</Radio>
                <Radio value='少许'>少许</Radio>
                <Radio value='丰富'>丰富</Radio>
              </RadioGroup>
            )}
          </FormItem>
  
          <FormItem
            label="其他："
          >
            {getFieldDecorator(`${label}[${i}].qita_${wz}`)(
              <TextArea />
            )}
          </FormItem>
  
  
          <FormItem
            label="病灶评估(BI_RADS分类)："
          >
            {getFieldDecorator(`${label}[${i}].fenlei`, {
              rules: [{
                required: true, message: '请选择病灶评估(BI_RADS分类)！！！',
              }],
            })(
              <RadioGroup>
                <Radio value={1}>1 类</Radio>
                <Radio value={2}>2 类</Radio>
                <Radio value={3}>3 类</Radio>
                <Radio value={4}>4 类</Radio>
                <Radio value={5}>5 类</Radio>
                <Radio value={0}>0 类</Radio>
              </RadioGroup>
            )}
          </FormItem>
        </div>
      )
    }
    
    return str
  }

  set1 = (type) => {
    const {form} = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    const val = type === 'l' ? getFieldValue(`resultPic.left['肿块']`) : getFieldValue(`resultPic.right['肿块']`);
    const label = `resultPic.${type === 'l' ? 'left' : 'right'}['肿块信息']`;
    const wz = type === 'l' ? 'left' : 'right';

    let keys;
   
    if(type === 'l'){
      getFieldDecorator('leftArr', { initialValue: [1] });
      keys = getFieldValue('leftArr');
    } else {
      getFieldDecorator('rightArr', { initialValue: [1] });
      keys = getFieldValue('rightArr');
    }

    return (val === '单发' || val === '多发') && keys.map((k,i) => (
      <div key={k}>
        <div className={styles.data1Wrap}>
          <div className={styles.data1}>
            <Collapse>
              <Panel header={`部位${i+1}`} key={k}>
                { this.setHTML(label, wz, i, 1) }
              </Panel>
            </Collapse>
          </div>
          {/* {keys.length > 1 ? (
            <Icon
              className={styles.data1Delete}
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => this.remove(i, type)}
            />
          ) : null} */}
        </div>
        {
          val === '多发' && i === keys.length -1 &&
          <FormItem>
            <Button type="dashed" onClick={() => this.add(type)} style={{width: '100%'}}>
              <Icon type="plus" /> 添加
            </Button>
          </FormItem>
        }
      </div>
    ));
  }

  set2 = (label, i) => {
    const {form} = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    return getFieldValue(`${label}[${i}].daxiao`) === '可测量' &&(
      <div className={styles.set2}>
        <FormItem
          className={styles.flex}
        >
          {getFieldDecorator(`${label}[${i}].with`, {
            rules: [{
              required: true, message: '请填写',
            }],
          })(
            <InputNumber min={0} />
          )}
        </FormItem>
        <span className={styles.span}>mm X</span>
        <FormItem
          className={styles.flex}
        >
          {getFieldDecorator(`${label}[${i}].height`, {
            rules: [{
              required: true, message: '请填写！',
            }],
          })(
            <InputNumber min={0} />
          )}
        </FormItem> mm
      </div>
      )
  }

  set3 = (label, wz, i) => {
    const {form} = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    return getFieldValue(`${label}[${i}].keyilinbajie_${wz}`) === '是' && (
      <>
        <FormItem
          label="病灶位置："
        >
          {getFieldDecorator(`${label}[${i}].keyilinbajie_site_${wz}`, {
            rules: [{
              required: true, message: '请选择病灶位置！！！',
            }],
          })(
            <RadioGroup>
              <Radio value='腋窝'>腋窝</Radio>
              <Radio value='锁骨上'>锁骨上</Radio>
              <Radio value='锁骨下'>锁骨下</Radio>
              <Radio value='内乳'>内乳</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem
          className={styles.flex}
          label="长："
        >
          {getFieldDecorator(`${label}[${i}].keyilinbajie_chang_${wz}`, {
            rules: [{
              required: true, message: '请填写长！！！',
            }],
          })(
            <InputNumber min={0} />
          )}
        </FormItem>
        <FormItem
          className={styles.flex}
          label="直："
        >
          {getFieldDecorator(`${label}[${i}].keyilinbajie_kuan_${wz}`, {
            rules: [{
              required: true, message: '请填写直！！！',
            }],
          })(
            <InputNumber min={0} />
          )}
        </FormItem>
        <FormItem
          label="形状："
        >
          {getFieldDecorator(`${label}[${i}].keyilinbajie_xingzhuang_${wz}`, {
            rules: [{
              required: true, message: '请选择形状！！！',
            }],
          })(
            <RadioGroup>
              <Radio value='正常'>正常</Radio>
              <Radio value='异常'>异常</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          label="融合："
        >
          {getFieldDecorator(`${label}[${i}].keyilinbajie_ronghe_${wz}`, {
            rules: [{
              required: true, message: '请选择融合！！！',
            }],
          })(
            <RadioGroup>
              <Radio value='否'>否</Radio>
              <Radio value='是'>是</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </>
    )
  }

  seeHistoryReport = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'readingPictures/getReportDetail',
      payload: {id}
    });
  }

  render() {
    const {lImg,rImg,resultPic,preview} = this.state;
    const {form, readingPictures} = this.props;
    const {examDetailData, historyList, insData} = readingPictures;
    const { getFieldDecorator } = form;

    const noImgStr = (
      <div className={styles.noImg}>
        <img src={noImg} alt="" />
        <p>您还没有添加报告，请在左侧双击超声图片添加报告</p>
      </div>
    )
    
    const reportInfo = {...examDetailData, ...insData}

    const content = (
      <Menu>
        {historyList.map(v => <Menu.Item key={v.id} onClick={() => this.seeHistoryReport(v.id)}>{moment(v.auditDate).format('YYYY.MM.DD')}</Menu.Item>)}
      </Menu>
    );

    return (
      <Form onSubmit={this.handleSubmit} className={styles.wrap}>
        <div className={styles.title}>
          <p>填写报告</p>
          <Icon type="search" className={styles.icon} onClick={() => this.setState({preview: !preview})} />
          <Icon type="printer" className={styles.icon} />
          <Dropdown overlay={content} trigger={['click']}>
            <Icon type="file-text" className={styles.icon} />
          </Dropdown>
        </div>
        {
          preview ? <ViewReportComponent reportInfo={reportInfo} /> : 
          <>
            <div className={styles.con}>
              <div className={styles.title1}>左侧乳房</div>
              <div className={styles.bgWrap}>
                { lImg ? <img src={imgUrlPath + lImg} alt="" /> : noImgStr }
              </div>

              <FormItem
                label="单纯性囊肿："
              >
                {getFieldDecorator(`resultPic.left['囊肿']`, {
                  initialValue: resultPic.left['囊肿'],
                  rules: [{
                    required: true, message: '请选择单纯性囊肿！！！',
                  }],
                })(
                  <RadioGroup>
                    <Radio value='无'>无</Radio>
                    <Radio value='1个'>1个</Radio>
                    <Radio value='2-3个'>2-3个</Radio>
                    <Radio value='数个'>数个</Radio>
                  </RadioGroup>
                )}
              </FormItem>
              { this.set('l') }
              <FormItem
                label="非单纯性囊肿或实性病灶："
              >
                {getFieldDecorator(`resultPic.left['肿块']`, {
                  initialValue: resultPic.left['肿块'],
                  rules: [{
                    required: true, message: '请选择非单纯性囊肿或实性病灶！！！',
                  }],
                })(
                  <RadioGroup>
                    <Radio value='无'>无</Radio>
                    <Radio value='单发'>单发</Radio>
                    <Radio value='多发'>多发</Radio>
                  </RadioGroup>
                )}
              </FormItem>
              { this.set1('l') }
              <FormItem
                label="BI-RADS分类："
              >
                {getFieldDecorator(`resultPic.left['分类']`, {
                  initialValue: resultPic.left['分类'],
                  rules: [{
                    required: true, message: '请选择BI-RADS分类！！！',
                  }],
                })(
                  <RadioGroup>
                    <Radio value={1}>1 类</Radio>
                    <Radio value={2}>2 类</Radio>
                    <Radio value={3}>3 类</Radio>
                    <Radio value={4}>4 类</Radio>
                    <Radio value={5}>5 类</Radio>
                    <Radio value={0}>0 类</Radio>
                  </RadioGroup>
                )}
              </FormItem>



              <div className={styles.title1}>右侧乳房</div>
              <div className={styles.bgWrap}>
                { rImg ? <img src={imgUrlPath + rImg} alt="" /> : noImgStr }
              </div>

              <FormItem
                label="单纯性囊肿："
              >
                {getFieldDecorator(`resultPic.right['囊肿']`, {
                  initialValue: resultPic.right['囊肿'],
                  rules: [{
                    required: true, message: '请选择单纯性囊肿！！！',
                  }],
                })(
                  <RadioGroup>
                    <Radio value='无'>无</Radio>
                    <Radio value='1个'>1个</Radio>
                    <Radio value='2-3个'>2-3个</Radio>
                    <Radio value='数个'>数个</Radio>
                  </RadioGroup>
                )}
              </FormItem>
              { this.set('r') }
              <FormItem
                label="非单纯性囊肿或实性病灶："
              >
                {getFieldDecorator(`resultPic.right['肿块']`, {
                  initialValue: resultPic.right['肿块'],
                  rules: [{
                    required: true, message: '请选择非单纯性囊肿或实性病灶！！！',
                  }],
                })(
                  <RadioGroup>
                    <Radio value='无'>无</Radio>
                    <Radio value='单发'>单发</Radio>
                    <Radio value='多发'>多发</Radio>
                  </RadioGroup>
                )}
              </FormItem>
              { this.set1('r') }
              <FormItem
                label="BI-RADS分类："
              >
                {getFieldDecorator(`resultPic.right['分类']`, {
                  initialValue: resultPic.right['分类'],
                  rules: [{
                    required: true, message: '请选择BI-RADS分类！！！',
                  }],
                })(
                  <RadioGroup>
                    <Radio value={1}>1 类</Radio>
                    <Radio value={2}>2 类</Radio>
                    <Radio value={3}>3 类</Radio>
                    <Radio value={4}>4 类</Radio>
                    <Radio value={5}>5 类</Radio>
                    <Radio value={0}>0 类</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </div>

            <FormItem className={styles.bottom}>
              <Button type="primary" htmlType="submit">保存</Button>
            </FormItem>
          </>
        }
      </Form>
    )
  }
}

export default Report;
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Collapse, Empty, Modal, message, Row, Col } from 'antd';
import { readingPicturesPath, imgUrlPath } from '@/global';
import Item from '@/components/FilmReadingItem';
import ModelVideo from '../modelVideo';
import styles from './bottom.less';

function getData(data){
  const direction = data.videoPath.includes('left') ? 'L' : 'R';
  const videoSrc = readingPicturesPath + data.videoPath.split('home/')[1];
  const imgSrc = readingPicturesPath + data.picturePath.split('home/')[1];
  const strip = data.videoPath.split('inner')[1].slice(0, 1);
  const frame = data.frameId;
  const desc = `第${strip}条，第${frame}帧`;
  return {direction, src: imgSrc, desc, videoSrc, strip, frame, type: 1}
}

function getData2(data){
  const {location,videoUrl,strip,frame} = data;
  const imgSrc = imgUrlPath + data.pictureUrl;
  const desc = `第${data.strip}条，第${data.frame}帧`;
  return {direction: location, src: imgSrc, desc, videoSrc: videoUrl, strip, frame, type: 2}
}

let count = 0;

@connect(({ readingPictures, loading }) => ({
  readingPictures,
  loading: loading.models.readingPictures,
}))
class Bottom extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      tabs: ['AI辅助', '存图', '历史'],
      activeNum: 1,
      visible: false,
      modelList: [{}],
      modelNum: 0
    }

  }

  
  /**
   * Item点击事件
   *
   * @param { string } str  区分点击什么
   * @param { string | number} index  当前点击哪一个
   * @param { number | boolean } type 区分是AI辅助列表还是存图列表
   * 
   */
  clickEvent = (str, index, type, location) => {
    if(str === 'isActive') {
      count += 1;
      setTimeout(()=> {
        if(count === 1){
          this.setAiPicture(str, index, type);
        } else if(count === 2){
          // this.seeModel(index, type)
        }
        count = 0;
      }, 300)
    } else this.setAiPicture(str, index, type, location);
  }
  
  setAiPicture = (str, index, type, location) => {
    const { dispatch, readingPictures } = this.props;
    let { aiPicture, findDataImgData } = readingPictures;

    if(type === 1) {
      findDataImgData = findDataImgData.map((v, i) => {
        const item = v;
        if(str === 'isActive') item[str] = i === index ? !item[str] : false;
        else if(str === 'isOK') {
          if(item.location === location) item[str] = i === index ? !item[str] : false;
        } else if(i === index && str === 'delete'){
          dispatch({
            type: 'readingPictures/deleteReportImg',
            payload: {id: v.id},
          }).then(res => {
            if (res && res.status === 1 && res.message === '成功') {
              message.success('删除成功');
              dispatch({
                type: 'readingPictures/findDataImg',
                payload: {dataId: readingPictures.id},
              })
            } else message.error('删除失败');
          });
        }
        return item
      })
    } else {
      aiPicture = aiPicture.map((v, i) => {
        const item = v;
        
        if(str === 'isActive') item[str] = i === index ? !item[str] : false;
        if(i === index && str !== 'isActive') {
          item[str] = !item[str];
          if(str === 'isOK') item.isNO = false;
          else if(str === 'isNO') item.isOK = false;
        }
        return item
      })
    }
    
    dispatch({
      type: 'readingPictures/saveState',
      payload: {aiPicture, findDataImgData},
    });
  }

  seeModel = (modelNum, type) => {
    const { readingPictures } = this.props;
    const { aiPicture, findDataImgData } = readingPictures;
    
    const modelList = type === 1 ? findDataImgData.map(v => getData2(v)) : aiPicture.map(v => getData(v));
    this.setState({
      visible: true,
      modelList,
      modelNum
    });
  }

  render() {
    const { tabs, activeNum, visible, modelList, modelNum } = this.state;
    const { readingPictures } = this.props;
    const { hisExamData, findDataImgData, aiPicture } = readingPictures;
    
    const tabsStr = tabs.map((item, index) => <div key={item} className={activeNum === index ? styles.active : ''} onClick={() => this.setState({activeNum: index})}>{item}</div>)
    let tabCon;
    if(activeNum === 0){
      tabCon = aiPicture ? aiPicture.map((item, index) => {
        const data = {
          ...getData(item),
          isActive: item.isActive,
          isOK: item.isOK,
          isNO: item.isNO,
          clickEvent: () => this.clickEvent('isActive', index),
          okEvent: () => this.clickEvent('isOK', index),
          noEvent: () => this.clickEvent('isNO', index),
          seeEvent: () => this.seeModel(index),
          tips: 3
        }
        return <Col key={item.picturePath} span={8}><Item {...data} /></Col>
    }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    } else if(activeNum === 1) {
      tabCon = findDataImgData ? findDataImgData.map((item, index) => {
        const data = {
          ...getData2(item),
          isActive: item.isActive,
          isOK: item.isOK,
          clickEvent: () => this.clickEvent('isActive', index, 1),
          okEvent: () => this.clickEvent('isOK', index, 1, item.location),
          deleteEvent: () => this.clickEvent('delete', index, 1),
          seeEvent: () => this.seeModel(index, 1),
          tips: 4
        }
        return <Col key={item.id} span={8}><Item {...data} /></Col>
      }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    } else {
      tabCon = hisExamData ? (
        <Collapse defaultActiveKey={['1']} onChange={this.collapseCallback}>
          {
            hisExamData.map(item => (
              <Collapse.Panel header={item.examinationDate} key={item.examinationDate}>
                {/* <Item direction="L" src="" desc="aaa" /> */}
              </Collapse.Panel>
            ))
          }
        </Collapse>
      )  : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    }

    return (
      <div className={styles.wrap}>
        <div className={styles.tabs}>
          { tabsStr }
        </div>
        <div className={activeNum === 2 ? '' : styles.con}>
          <Row gutter={16}>
            { tabCon }          
          </Row>
        </div>
        <Modal
          title={null}
          footer={null}
          visible={visible}
          mask={false}
          bodyStyle={{padding: 0}}
          wrapClassName={styles.modalWrap}
          className={styles.modalCon}
          onCancel={() => this.setState({visible: false})}
        >
          <ModelVideo modelList={modelList} modelNum={modelNum} />
        </Modal>
        
        
      </div>
    )
  }
}

export default Bottom;

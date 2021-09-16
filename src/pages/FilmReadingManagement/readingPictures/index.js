import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import { readingPicturesPath } from '@/global';
import Header from './header';
import Report from './report';
import Read from './read';
import styles from './style.less';

//页面解决json中$ref问题
function changeRef(d){
  const darr=[];
  if(d && d.length) {
    d.forEach(v => {
      if(v.$ref) darr.push(d[v.$ref.slice(2, -1)]);
      else darr.push(v);
    })
  }
  return darr;
}
// 获取乳头位置
function getTeat(d, json, num){
  const teat = {
    x: 0,
    y: 0,
  }
  d.forEach((v, i) => {
    const val = Math.abs(json[num].x - v[0].dx);
    if(!teat.xVal || teat.xVal > val) {
      teat.xVal = val;
      teat.x = i;
    }
  })
  d[teat.x].forEach((v, i) => {
    const val = Math.abs(json[num].y - v.dy);
    if(!teat.yVal || teat.yVal > val) {
      teat.yVal = val;
      teat.y = i;
    }
  })
  return teat
}

@connect(({readingPictures, loading}) => ({
  readingPictures,
  loading: loading.models.readingPictures
}))
class Index extends PureComponent {
  constructor(props){
    super(props);
    const {id, type} = props.match.params;
    this.state = {
      id,
      type
    }
  }

  componentDidMount(){
    const { dispatch } = this.props;
    const { id: id1 } = this.state;
    dispatch({
      type: 'readingPictures/getExamDetail',
      payload: {id: id1},
    }).then(res => {
      if (res && res.status === 1 && res.message === '成功') {
        const {id, idCardNum, filePath, leftVideoNum, rightVideoNum, examinationAddress} = res.data;
        dispatch({
          type: 'readingPictures/hisExam',
          payload: {id, 'id_card_num': idCardNum},
        })
        dispatch({
          type: 'readingPictures/findDataImg',
          payload: {dataId: id},
        })
        dispatch({
          type: 'readingPictures/getExamImgDetail',
          payload: {'file_path': `/home${filePath}`, 'left_video_num': leftVideoNum, 'right_video_num': rightVideoNum},
        }).then(res1 => {
          if (res1 && res1.status === 1 && res1.message === '成功') {
            const d = res1.data;

            const examImgDetailData = {
              left: [],
              right: []
            }
            Object.keys(d).forEach(v => {
              if(v.includes('.json')) examImgDetailData[v.split('_')[0]][v.slice(-10, -9)] = changeRef(JSON.parse(d[v]));
              else examImgDetailData[v] = JSON.parse(d[v]);
            })

            examImgDetailData.teat = {
              left: getTeat(examImgDetailData.left, examImgDetailData.nipplesJson, 1),
              right: getTeat(examImgDetailData.right, examImgDetailData.nipplesJson, 0)
            };

            const videoSrc = `${readingPicturesPath + filePath}/right/${rightVideoNum > 3 ? 'outer' : 'inner'}${rightVideoNum}.mp4`;
            dispatch({
              type: 'readingPictures/saveState',
              payload: {examImgDetailData, videoSrc, strip: rightVideoNum, id, idCardNum},
            })
          }
        })

        dispatch({
          type: 'readingPictures/getReportHistory',
          payload: idCardNum,
        })

        dispatch({
          type: 'readingPictures/getInstitutionById',
          payload: {id: examinationAddress}
        })
        
        
      } else message.error('获取详情失败');
    });

  }

  componentWillReceiveProps(nextProps) {
    this.setState({type: nextProps.match.params.type})
  }


  render() {
    const { type } = this.state;
    const { readingPictures } = this.props;
    return (
      <div className={styles.wrap}>
        <Header type={type} {...readingPictures.examDetailData} />
        {type === 'read' ? <Read {...readingPictures} /> : <Report {...readingPictures} />}
      </div>
    )
  }
}

export default Index;
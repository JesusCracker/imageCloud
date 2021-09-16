import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { imgUrlPath } from '@/global';
import ModelVideo from '../modelVideo';

function getData2(data){
  const {location,videoUrl,strip,frame} = data;
  const imgSrc = imgUrlPath + data.pictureUrl;
  const desc = `第${data.strip}条，第${data.frame}帧`;
  return {direction: location, src: imgSrc, desc, videoSrc: videoUrl, strip, frame, type: 2}
}

@connect(({ readingPictures, loading }) => ({
  readingPictures,
  loading: loading.models.readingPictures,
}))
class Top extends PureComponent {
  constructor(props){
    super(props);

    let { videoSrc, frame, strip } = props.readingPictures;
    const { findDataImgData } = props.readingPictures;
    if(findDataImgData){

      const data = findDataImgData.filter(v => v.isActive);
      if(data.length) {
        const {videoUrl: videoSrc1, frame: frame1, strip: strip1} = data[0]
        videoSrc = videoSrc1;
        frame = frame1;
        strip = strip1;
      }
      
    }
    this.state = {
      modelList: [{videoSrc, frame, strip, type: 1}],
      modelNum: 0
    }
  }

  componentWillReceiveProps(nextProps){
    const { findDataImgData } = nextProps.readingPictures
    if(!findDataImgData) return;
    let modelNum = 0;
    let lang = 0;
    const modelList = findDataImgData.map((v, i) => {
      if(v.isActive) {
        modelNum = i;
        lang += 1;
      }
      return getData2(v)
    });
    if(!lang) return;
    this.setState({ modelList, modelNum })
  }

  render() {
    const { modelList, modelNum } = this.state;
    return (
      <div style={{height: '50%'}}>
        <ModelVideo modelList={modelList} modelNum={modelNum} titleHide="true" />
      </div>
    )
  }
}

export default Top;
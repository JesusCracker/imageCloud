import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Icon } from 'antd';
import VideoFrame from './read/VideoFrame.min';
import styles from './modelVideo.less';

@connect(({ readingPictures, loading }) => ({
  readingPictures,
  loading: loading.models.readingPictures,
}))
class modelVideo extends PureComponent {
  constructor(props){
    super(props);
    const {modelList, modelNum} = props;
    this.state = {
      isPlay: false,
      modelList,
      modelNum,
      strip: modelList[modelNum].strip,
      frame: modelList[modelNum].frame
    }

    this.videoObj = React.createRef();
  }
  
  componentDidMount(){
    const{modelList,modelNum} = this.state;
    const mdoelThis = this;
    this.video = new VideoFrame({
      id: 'video1',
      callback(frame, type) {
        if(type === 'frame') mdoelThis.setState({frame})
      }
    })
    this.video.listen('frame');
    this.video.seekTo({frame: modelList[modelNum].frame})

    this.videoObj.current.addEventListener('ended', () => { 
      this.setState({isPlay: false})
    }, false);
  }

  componentWillReceiveProps(nextProps) {
    const { modelList, modelNum } = nextProps;
    const { modelList: modelList1, modelNum: modelNum1 } = this.state;
    if(modelList[0].type !== modelList1[0].type || modelNum !== modelNum1) {
      this.video.seekTo({frame: modelList[modelNum].frame})
      this.setState({
        modelList, modelNum,
        isPlay: false,
        strip: modelList[modelNum].strip,
        frame: modelList[modelNum].frame
      });
    }
  }

  playVideo = () => {
    const { isPlay } = this.state;

    if(isPlay) {
      this.videoObj.current.pause();
    }else this.videoObj.current.play();
    
    this.setState({isPlay: !isPlay})
  }

  setVideo = (type) => {
    let {frame} = this.state;
    if(type === 'go') {
      frame = +frame + 1;
      this.video.seekForward();
    } else {
      if(!frame) return
      frame = +frame - 1;
      this.video.seekBackward();
    }
    
    this.videoObj.current.pause();
    this.setState({isPlay: false, frame});
  }

  btnVideo = type => {
    const { modelList, modelNum: num } = this.state;
    let modelNum = num;
    if(type === 'prev') modelNum -= 1;
    else if(type === 'next') modelNum += 1;

    this.video.seekTo({frame: modelList[modelNum].frame})

    this.videoObj.current.pause();
    this.setState({isPlay: false, modelNum, strip: modelList[modelNum].strip, frame: modelList[modelNum].frame});
  }

  render() {
    const { isPlay, modelList, modelNum, strip, frame } = this.state;
    const {titleHide} = this.props;
    return (
      <div className={styles.videoWrap}>
        { titleHide ? '' : <div className={styles.videoTitle}>第{strip}条, 第{frame}帧</div> }
        <video className={styles.video} src={modelList[modelNum].videoSrc} ref={this.videoObj} id="video1">
          <track
            default
            kind="captions"
          />
        </video>
        <div className={styles.btns}>
          <Button shape="round" ghost onClick={this.btnVideo}>回到截图位置</Button>

          <div className={styles.btnsMiddle}>
            <Button type="link" onClick={() => this.setVideo('back')}>
              <Icon type="backward" className={styles.icon} />
            </Button>
            
            <Button type="link" onClick={this.playVideo}>
              {
                isPlay ? <Icon type="stop" className={styles.icon} /> : <Icon type="caret-right" className={styles.icon} />
              }
            </Button>
            <Button type="link" onClick={() => this.setVideo('go')}>
              <Icon type="forward" className={styles.icon} />
            </Button>
          </div>
          
          <div className={styles.btnsRight}>
            {
              modelNum !== 0 && <Button shape="round" ghost onClick={() => this.btnVideo('prev')}>上一张</Button>
            }
            {
              modelNum !== modelList.length-1 && <Button shape="round" ghost onClick={() => this.btnVideo('next')}>下一张</Button>
            }
            
          </div>
        </div>
      </div>
    )
  }
}

export default modelVideo;
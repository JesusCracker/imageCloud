import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Button, Menu, Dropdown, message, Tooltip, Popover, Slider, InputNumber } from 'antd';
import VideoFrame from './VideoFrame.min';
import styles from './middle.less';
import base64 from './base64';

let canvas = null;
let ctx = null;
let types = 0;
// 0 无标注 1 随机图形  2 画笔  3 测量

const xingzhuangarr = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
const diandianarr = [
  {"icolor":"#ff9900","iclass":"yuan"},{"icolor":"#00cc65","iclass":"sanjiao"},{"icolor":"#0099ff","iclass":"fangxing"},
  {"icolor":"#00cc65","iclass":"yuan"},{"icolor":"#0099ff","iclass":"sanjiao"},{"icolor":"#ff9900","iclass":"fangxing"},
  {"icolor":"#0099ff","iclass":"yuan"},{"icolor":"#ff9900","iclass":"sanjiao"},{"icolor":"#00cc65","iclass":"fangxing"},   
];


class Canvas extends PureComponent {
  constructor(props){
    super(props);

    this.canvas = React.createRef();
  }

  componentDidMount(){
    this.draw();
  }

  draw = () => {
    canvas = this.canvas.current;
    ctx = canvas.getContext('2d');
    canvas.width = 1260
    canvas.height = 357
  }

  mouseDown = (e) => {  
    if(!types) return;
    /*找到鼠标（画笔）的坐标*/  
    const startX = e.clientX - canvas.getBoundingClientRect().x;  
    const startY = e.clientY - canvas.getBoundingClientRect().y;

    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillStyle="#1e4aff";
    ctx.font="12px 微软雅黑";

    ctx.lineCap = 'round';  
    ctx.lineJoin ="round";  
    ctx.strokeStyle = '#1e4aff';     //画笔颜色  
    ctx.lineWidth = '1';      //画笔粗细 

    if(types === 1){
      // ctx.fillStyle="#FF0000";
      ctx.beginPath();

      // 正方形
      ctx.fillRect(startX, startY, 8, 8);

      // 圆形
      // ctx.arc(startX, startY, 4, 0, 2*Math.PI);

      // 三角形
      // ctx.moveTo(startX,startY-4);
      // ctx.lineTo(startX-(Math.sqrt(2)*3), startY+4);
      // ctx.lineTo(startX+(Math.sqrt(2)*3), startY+4);

      ctx.fill();
      ctx.stroke();
    } else if(types === 2){
      ctx.beginPath();    //开始本次绘画  
      ctx.moveTo(startX, startY);   //画笔起始点  
       

      canvas.onmousemove = (ex) => {  
        /*找到鼠标（画笔）的坐标*/  
        const moveX = ex.clientX - canvas.getBoundingClientRect().x;  
        const moveY = ex.clientY - canvas.getBoundingClientRect().y;
        ctx.lineTo(moveX, moveY);     //根据鼠标路径绘画  
        ctx.stroke();   //立即渲染  
      }
      
      canvas.onmouseup = (ex) => {
        const moveX = ex.clientX - canvas.getBoundingClientRect().x;  
        const moveY = ex.clientY - canvas.getBoundingClientRect().y;
        ctx.lineTo(moveX, moveY);     //根据鼠标路径绘画  
        ctx.stroke();   //立即渲染  
        ctx.closePath();    //结束本次绘画
        canvas.onmousemove = null;  
        canvas.onmouseup = null;
      }  
      
      canvas.mouseleave = () => {
        ctx.closePath();
        canvas.onmousemove = null;
        canvas.onmouseup = null;
      }
    } else if(types === 3){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.beginPath();    //开始本次绘画  
      ctx.moveTo(startX, startY);   //画笔起始点  

      ctx.arc(startX, startY,3,0,2*Math.PI);

      ctx.fillText(1, startX - 12, startY - 5);

      
      // canvas.onmousemove = (ex) => {  
      //   /*找到鼠标（画笔）的坐标*/  
      //   const moveX = ex.clientX - canvas.getBoundingClientRect().x;  
      //   const moveY = ex.clientY - canvas.getBoundingClientRect().y;
      //   ctx.lineTo(moveX, moveY);     //根据鼠标路径绘画  
      //   ctx.stroke();   //立即渲染  
      //   ctx.closePath();    //结束本次绘画
      // }
      
      canvas.onmouseup = (ex) => {
        const moveX = ex.clientX - canvas.getBoundingClientRect().x;  
        const moveY = ex.clientY - canvas.getBoundingClientRect().y;
        ctx.lineTo(moveX, moveY);     //根据鼠标路径绘画  
        ctx.arc(moveX, moveY, 3, 0,2*Math.PI);

        ctx.fill();
        ctx.stroke();   //立即渲染  
        ctx.closePath();    //结束本次绘画
        canvas.onmousemove = null;  
        canvas.onmouseup = null;
      }  
    }
  }
    
  

  render () {
    return (
      <>
        {/* <CanvasDraw ref={this.canvas} loadTimeOffset={1} lazyRadius={1} brushRadius={1} hideGrid /> */}
        <canvas
          className={styles.canvas}
          ref={this.canvas}
          // ontouchstart={this.touchStart}
          // ontouchmove={this.touchMove}
          // ontouchend={this.touchEnd}
          onMouseDown={e => this.mouseDown(e)}
          // onMouseMove={e => this.mouseMove(e)}
          // onMouseUp={e => this.mouseUp(e)}
          // onMouseLeave={e => this.mouseLeave(e)}
        />
      </>
    )
  }
}




@connect(({ readingPictures, loading }) => ({
  readingPictures,
  loading: loading.models.readingPictures,
}))
class Middle extends PureComponent {
  constructor(props){
    super(props);
    const {videoSrc, strip, location} = props.readingPictures;
    this.state = {
      multiple: '倍数',
      isPlay: false,
      videoSrc,
      strip,
      location,
      inputValue1: 0,
      inputValue2: 1,
      inputValue3: 1
    };

    this.videoObj = React.createRef();
  }
  
  componentDidMount(){
    console.log(this.videoObj.current.clientWidth)
    const { setFrame } = this.props;
    this.video = new VideoFrame({
      id: 'video',
      callback(time, type) {
        if(type === 'frame') setFrame(time);
      }
    })
    this.video.listen('frame');
    
    this.setFrameAnimation();
  }

  componentWillReceiveProps(nextProps) {
    const {videoSrc, location, strip } = nextProps.readingPictures;
    const { videoSrc: videoSrc1 } = this.state;
    if(videoSrc !== videoSrc1) {
      this.setState({videoSrc, isPlay: false, location, strip});
    }
  }
  
  componentDidUpdate(){
    const {frame } = this.props;
    const {isPlay} = this.state;
    if(!isPlay) this.video.seekTo({frame});
  }

  setFrameAnimation = () => {
    const { dispatch, setFrame } = this.props;
    this.videoObj.current.addEventListener('ended', () => { 
      const { location, multiple } = this.state;
      let { strip, videoSrc } = this.state;
      
      if(location === 'R') {
        strip = strip > 1 ? strip-=1 : 5;
        videoSrc = `${videoSrc.split('right/')[0]}right/${strip > 3 ? 'outer' : 'inner'}${strip}.mp4`;
      } else {
        strip = strip < 5 ? strip+=1 : 1;
        videoSrc = `${videoSrc.split('left/')[0]}left/${strip > 3 ? 'outer' : 'inner'}${strip}.mp4`;
      }

      setFrame(1);
      dispatch({
        type: 'readingPictures/saveState',
        payload: {strip, videoSrc}
      });
      if((location === 'R' && strip !== 5) || (location === 'L' && strip !== 1)) {
        this.videoObj.current.play();
        this.setState({isPlay: true});
        this.videoObj.current.playbackRate = multiple === '倍数' ? 1.0 : multiple;
      } else this.setState({isPlay: false});
    }, false);
  }

  playVideo = () => {
    const { isPlay, multiple } = this.state;

    if(isPlay) {
      this.videoObj.current.pause();
    } else {
      this.videoObj.current.play();
      this.videoObj.current.playbackRate = multiple === '倍数' ? 1.0 : multiple;
    }
    
    this.setState({isPlay: !isPlay})
  }

  setVideo = (type) => {
    const {dispatch} = this.props;
    let {frame} = this.props
    if(type === 'go') {
      frame = +frame + 1;
      this.video.seekForward();
    } else {
      if(!frame) return
      frame = +frame - 1;
      this.video.seekBackward();
    }
    
    this.videoObj.current.pause();
    this.setState({isPlay: false});
    dispatch({
      type: 'readingPictures/saveState',
      payload: {frame}
    });
  }

  setMultiple = (e) => {
    const multiple = e.key.slice(0, e.key.length - 1);
    this.setState({multiple});
    this.videoObj.current.playbackRate = multiple;
  }

  savePic = () => {
    const {dispatch, readingPictures, frame} = this.props;
    const {strip, videoSrc, location, id} = readingPictures
    dispatch({
      type: 'readingPictures/saveReportImg',
      payload: {
        dataId: id,
        pictureUrl: base64,
        strip,
        frame,
        location,
        videoUrl: videoSrc
      },
    }).then(res => {
      if (res && res.status === 1 && res.message === '成功') {
        message.success('存图成功');
        dispatch({
          type: 'readingPictures/findDataImg',
          payload: {dataId: id}
        })
      } else message.error('存图失败');
    })
  }

  setType = (num) => {
    const {isPlay} = this.state;
    if(isPlay){
      message.warning('暂停视频才能标注')
      return
    }
    types = num;
  }

  render() {
    const { multiple, isPlay, videoSrc, inputValue1, inputValue2, inputValue3 } = this.state;

    const menu = (
      <Menu onClick={this.setMultiple}>
        <Menu.Item key="4.0X">4.0X</Menu.Item>
        <Menu.Item key="3.0X">3.0X</Menu.Item>
        <Menu.Item key="2.0X">2.0X</Menu.Item>
        <Menu.Item key="1.0X">1.0X</Menu.Item>
        <Menu.Item key="0.75X">0.75X</Menu.Item>
        <Menu.Item key="0.5X">0.5X</Menu.Item>
      </Menu>
    );

    const content = (
      <div className={styles.contentWrap}>
        <div className={styles.contentItem}>
          <div className={styles.title}>
            <span>灰度</span>
            <InputNumber
              min={0}
              max={1}
              step={0.01}
              value={inputValue1}
              onChange={value => this.setState({inputValue1: value})}
            />
          </div>
          <Slider
            min={0}
            max={1}
            onChange={value => this.setState({inputValue1: value})}
            value={typeof inputValue1 === 'number' ? inputValue1 : 0}
            step={0.01}
          />
        </div>
        <div className={styles.contentItem}>
          <div className={styles.title}>
            <span>亮度</span>
            <InputNumber
              min={0}
              max={2}
              step={0.01}
              style={{ marginLeft: 16 }}
              value={inputValue2}
              onChange={value => this.setState({inputValue2: value})}
            />
          </div>
          <Slider
            min={0}
            max={2}
            onChange={value => this.setState({inputValue2: value})}
            value={typeof inputValue2 === 'number' ? inputValue2 : 0}
            step={0.01}
          />
        </div>
        <div className={styles.contentItem}>
          <div className={styles.title}>
            <span>对比度</span>
            <InputNumber
              min={0}
              max={2}
              step={0.01}
              style={{ marginLeft: 16 }}
              value={inputValue3}
              onChange={value => this.setState({inputValue3: value})}
            />
          </div>
          <Slider
            min={0}
            max={2}
            onChange={value => this.setState({inputValue3: value})}
            value={typeof inputValue3 === 'number' ? inputValue3 : 0}
            step={0.01}
          />
        </div>
      </div>
    );

    return (
      <div className={styles.wrap}>
        <div className={styles.videoWrap}>
          <Canvas />
          {/* <canvas className={styles.canvas} style={{top: `${top}px`, left: `${left}px`}} onClick={() => console.log(1111)} /> */}
          <video className={styles.video} src={videoSrc} ref={this.videoObj} id="video" style={{filter: `grayscale(${inputValue1}) brightness(${inputValue2}) contrast(${inputValue3})`}}>
            <track
              default
              kind="captions"
            />
          </video>
          <div className={styles.btns}>
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
            
            <div className={styles.operation}>
              <Button shape="round" ghost>开始</Button>
              <Button shape="round" ghost>结束</Button>
              <Dropdown overlay={menu}>
                <Button shape="round" ghost>{multiple}{multiple !== '倍数' && 'X'}</Button>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className={styles.toolWrap}>
          <Tooltip placement="right" title="存图">
            <Icon type="picture" className={styles.icon} onClick={this.savePic} />
          </Tooltip>
          <Popover content={content} trigger="click" placement="right">
            <Icon type="book" className={styles.icon} />
          </Popover>
          <Tooltip placement="right" title="放大">
            <Icon type="picture" className={styles.icon} />
          </Tooltip>
          <Tooltip placement="right" title="随机形状标注">
            <Icon type="picture" className={styles.icon} onClick={() => this.setType(1)} />
          </Tooltip>
          <Tooltip placement="right" title="画笔">
            <Icon type="picture" className={styles.icon} onClick={() => this.setType(2)} />
          </Tooltip>
          <Tooltip placement="right" title="测量">
            <Icon type="picture" className={styles.icon} onClick={() => this.setType(3)} />
          </Tooltip>
          <Tooltip placement="right" title="隐藏/显示 标注">
            <Icon type="picture" className={styles.icon} />
          </Tooltip>
        </div>
      </div>
    )
  }
}

export default Middle;
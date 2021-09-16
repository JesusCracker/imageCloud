import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import { readingPicturesPath } from '@/global';
import bobotuL from '@/assets/bobotu_l.png'
import bobotuR from '@/assets/bobotu_r.png'
import styles from './right.less';

@connect(({ readingPictures, loading }) => ({
  readingPictures,
  loading: loading.models.readingPictures,
}))
class Right extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      tabs: ['右侧乳房', '左侧乳房'],
      activeNum: 0
    }

    this.bzCon = React.createRef();
  }
  
  chooseTab = (activeNum) => {
    this.setState({activeNum});

    const { readingPictures } = this.props;
    const { examDetailData } = readingPictures;
    const num = activeNum ? 1 : examDetailData.rightVideoNum;
    this.chooseVideo(examDetailData, activeNum, num)
  }

  chooseVideo = (data, activeNum, num, e) => {
    const location = activeNum ? 'L' : 'R';
    const videoSrc = `${readingPicturesPath + data.filePath}/${activeNum ? 'left' : 'right'}/${num > 3 ? 'outer' : 'inner'}${num}.mp4`;
    const { dispatch, setFrame } = this.props;
    if(e) {
      const { readingPictures } = this.props;
      const { examImgDetailData } = readingPictures;

      const {clientY, currentTarget} = e;
      const {top} = currentTarget.parentNode.getBoundingClientRect();

      const height = 157 / (activeNum ? examImgDetailData.left[num].length : examImgDetailData.right[num].length);
      setFrame(Math.round((clientY-top)/height));

    } else setFrame(1);
    dispatch({
      type: 'readingPictures/saveState',
      payload: {videoSrc, strip: num, location},
    });
  }

  locationTeat = () => {
    const {activeNum} = this.state;
    const { readingPictures, setFrame, dispatch } = this.props;
    const { examDetailData, examImgDetailData } = readingPictures;
    const {left, right} = examImgDetailData.teat;

    let {videoSrc, strip} = '';

    if(activeNum){
      videoSrc = `${readingPicturesPath + examDetailData.filePath}/left/${left.x > 3 ? 'outer' : 'inner'}${left.x}.mp4`;
      strip = left.x;
      setFrame(left.y);
    } else {
      videoSrc = `${readingPicturesPath + examDetailData.filePath}/right/${right.x > 3 ? 'outer' : 'inner'}${right.x}.mp4`;
      strip = right.x;
      setFrame(right.y);
    }
    dispatch({
      type: 'readingPictures/saveState',
      payload: {videoSrc, strip}
    });
  }

  locationStar = () => {
    const {activeNum} = this.state;
    const { readingPictures, setFrame, dispatch } = this.props;
    const { examDetailData } = readingPictures;

    const strip = activeNum ? 1 : examDetailData.rightVideoNum;
    const videoSrc = `${readingPicturesPath + examDetailData.filePath}/${activeNum ? 'left' : 'right'}/${strip > 3 ? 'outer' : 'inner'}${strip}.mp4`;

    setFrame(1);
    dispatch({
      type: 'readingPictures/saveState',
      payload: {videoSrc, strip}
    });
  }

  numChangeArray = num => [...new Array(num)].map((a, b) => b)

  render() {
    const { tabs, activeNum } = this.state;
    const { readingPictures, frame } = this.props;
    const { examDetailData, strip, examImgDetailData } = readingPictures;
    const tabsStr = tabs.map((item, index) => <div key={item} className={activeNum === index ? styles.active : ''} onClick={() => this.chooseTab(index)}>{item}</div>)
    let {teatTop, teatLeft, speedTop, speedLeft, speedWidth} = 0;
    let {quadrant, distance} = '';
    if(examImgDetailData){
      const {left, right} = examImgDetailData.teat;
      if(activeNum) {
        // left
        const width = 110 / (examImgDetailData.left.length - 1);
        const height = 157 / examImgDetailData.left[left.x].length;
        teatLeft = width  * left.x - (width / 2 + 4);
        teatTop = height * left.y;
        speedTop = frame * 157 / examImgDetailData.left[strip].length;
        speedLeft = width * (strip - 1);
        speedWidth = width -1;

        quadrant = strip > left.x ? '外' : '内';
        quadrant += frame > left.y ? '下' : '上';

        const {dx, dy} = examImgDetailData.left[strip][frame];
        const {x, y} = examImgDetailData.nipplesJson[1];
        distance = Math.sqrt(Math.abs(dx - x)**2 + Math.abs(dy - y)**2).toFixed(2);
      } else {
        //  right 
        const width = 110 / (examImgDetailData.right.length - 1);
        const height = 157 / examImgDetailData.right[right.x].length;
        teatLeft = width * (examImgDetailData.right.length - right.x) - (width / 2 + 4);
        teatTop = height * right.y;
        speedTop = frame * 157 / examImgDetailData.right[strip].length;
        speedLeft = width * (examImgDetailData.right.length - 1 - strip);
        speedWidth = width -1;

        quadrant = strip < right.x ? '内' : '外';
        quadrant += frame > right.y ? '下' : '上';

        const {dx, dy} = examImgDetailData.right[strip][frame];
        const {x, y} = examImgDetailData.nipplesJson[0];
        distance = Math.sqrt(Math.abs(dx - x)**2 + Math.abs(dy - y)**2).toFixed(2);
      }
    }

    let bzTop;
    let bzCon;
    if(examDetailData){
      const numArr = activeNum ? this.numChangeArray(examDetailData.rightVideoNum) : this.numChangeArray(examDetailData.leftVideoNum);
      bzTop = numArr.map(v => <span key={v}>{activeNum ? v+1 : numArr.length -v}</span>);
      bzCon = numArr.map(v => <div key={v} onClick={e => this.chooseVideo(examDetailData, activeNum, activeNum ? v+1 : numArr.length -v, e)} />);
    }
    return (
      <div className={styles.wrap}>
        <div className={styles.tabs}>
          { tabsStr }
        </div>
        <div className={styles.con}>
          <div className={styles.bobotuWrap}>
            <img src={activeNum ? bobotuR : bobotuL} alt="1" />
            <div className={styles.tipsWrap}>
              <div className={styles.bzTop}>
                { bzTop }
              </div>
              <div className={styles.bzCon} ref={this.bzCon}>
                { bzCon }
                <span className={styles.teat} style={{left: `${teatLeft}px`, top: `${teatTop}px`}} />
                <span className={styles.teat1} style={{top: `${teatTop + 4}px`}} />
                <span className={styles.teat2} style={{left: `${teatLeft + 4}px`}} />

                <span className={styles.speed} style={{left: `${speedLeft}px`, top: `${speedTop}px`, width: `${speedWidth}px`}} />
              </div>
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <span className={styles.button} onClick={this.locationTeat}>
              <Icon type="play-circle" className={styles.mr5} />
              定位到乳头
            </span>
            <span className={styles.button} onClick={this.locationStar}>
              <Icon type="play-circle" className={styles.mr5} />
              定位到开始
            </span>
          </div>
          <div className={styles.address}>
            <p>
              <Icon type="environment-o" className={styles.mr5} />
              位置：第{strip}条 {frame}帧
            </p>
            <p>
              <Icon type="scan" className={styles.mr5} />
              象限：{quadrant}
            </p>
            <p>
              <Icon type="swap" className={styles.mr5} />
              距离乳头：{distance}mm
            </p>
          </div>
          <div className={styles.bzWrap}>
            <p className={styles.bzTitle}>
              标注信息
              <Icon type="close-circle" />
            </p>
          </div>
        </div>
      </div>
    )
  }
}

export default Right;
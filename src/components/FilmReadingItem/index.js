import React from 'react';
import { Icon, Popover } from 'antd';
import styles from './index.less';

const tips1 = (
  <div className={styles.tipsWrap}>
    <p>① 单击选中图片</p>
    <p>② 双击或点击 <Icon type="search" /> 打开图片弹框</p>
    <p>③ 点击 <Icon type="check-circle" /> 表示AI诊断正确</p>
    <p>④ 点击 <Icon type="close-circle" /> 表示AI诊断错误</p>
    <p>⑤ <span className={styles.tipsIcon}>R</span> “Right” 表示右侧乳房</p>
    <p>⑥ <span className={styles.tipsIcon}>L</span> “Left” 表示左侧乳房</p>
  </div>
);

const tips2 = (
  <div className={styles.tipsWrap}>
    <p>① 单击选中图片</p>
    <p>② 双击或点击 <Icon type="search" /> 打开图片弹框</p>
    <p>③ 点击 <Icon type="delete" /> 删除当前截图</p>
    <p>③ <span className={styles.tipsIcon}>R</span> “Right” 表示右侧乳房</p>
    <p>④ <span className={styles.tipsIcon}>L</span> “Left” 表示左侧乳房</p>
  </div>
);

const tips3 = (
  <div className={styles.tipsWrap}>
    <p>① 单击选中图片，并同步切换到当前帧</p>
    <p>② 双击添加到报告</p>
    <p>③ 点击 <Icon type="search" /> 打开图片弹框</p>
    <p>④ 点击 <Icon type="check-circle" /> 表示AI诊断正确</p>
    <p>⑤ 点击 <Icon type="close-circle" /> 表示AI诊断错误</p>
    <p>⑥ <span className={styles.tipsIcon}>R</span> “Right” 表示右侧乳房</p>
    <p>⑦ <span className={styles.tipsIcon}>L</span> “Left” 表示左侧乳房</p>
  </div>
);

const tips4 = (
  <div className={styles.tipsWrap}>
    <p>① 单击选中图片，并同步切换到当前帧</p>
    <p>② 双击添加到报告</p>
    <p>③ 点击 <Icon type="search" /> 打开图片弹框</p>
    <p>③ 点击 <Icon type="delete" /> 删除当前截图</p>
    <p>④ <span className={styles.tipsIcon}>R</span> “Right” 表示右侧乳房</p>
    <p>⑥ <span className={styles.tipsIcon}>L</span> “Left” 表示左侧乳房</p>
  </div>
);


export default ({ src, desc, direction, isActive, isOK, isNO, clickEvent, okEvent, noEvent, seeEvent, deleteEvent, tips, style }) => {
  let content;
  if(tips === 1) content = tips1;
  else if(tips === 2) content = tips2;
  else if(tips === 3) content = tips3;
  else if(tips === 4) content = tips4;
  
  return (
    <div className={isActive ? styles.wsActive : styles.ws} style={style}>
      <div className={styles.wrap}>
        <div className={styles.icon}>{direction}</div>
        <img className={styles.img} src={src} alt={desc} onClick={clickEvent} />
        <div className={styles.operation}>
          <Icon type="search" className={styles.operationIcon} onClick={seeEvent} />
          {
            (tips === 2 || tips === 4) && <Icon type="delete" className={styles.operationIcon} onClick={deleteEvent} />
          }
          {
            isOK ? <Icon type="check-circle" className={styles.operationIcon} theme="filled" style={{color: '#108EE9'}} onClick={okEvent} />
            : <Icon type="check-circle" className={styles.operationIcon} onClick={okEvent} />
          }
          {
            (tips === 1 || tips === 3) && (isNO ? <Icon type="close-circle" className={styles.operationIcon} theme="filled" style={{color: 'red'}} onClick={noEvent} />
            : <Icon type="close-circle" className={styles.operationIcon} onClick={noEvent} />)
          }
          
          <Popover placement="right" content={content}>
            <Icon type="exclamation-circle" />
          </Popover>
        </div>
      </div>
      {desc && <div className={styles.desc}>{desc}</div>}
    </div>
)};

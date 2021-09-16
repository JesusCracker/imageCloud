import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Button } from 'antd';
import logo from '@/assets/logo.png';
import styles from './style.less';

class Header extends PureComponent {
  switch = () => {
    const {type, id} = this.props;
    router.push(`/filmReading/readingPictures/${id}/${type === 'read' ? 'report' : 'read'}`);
  }

  render() {
    const {type, sex, age, orId, nation, examinationDate} = this.props;
    return (
      <header className={styles.header}>
        <img src={logo} alt="logo" />
        <div>
          <span>编号：{orId}</span>
          <span>性别：{sex}</span>
          <span>年龄：{age}</span>
          <span>民族：{nation}</span>
          <span>检查日期：{examinationDate}</span>
          <span>病史信息 {'>'} </span>
        </div>
        <Button icon={type === 'read' ? 'folder' : 'picture'} onClick={this.switch} type="primary">{type === 'read' ? '报告' : '读图'}</Button>
        <Button icon="upload" type="primary">提交</Button>
        <Button icon="question-circle-o">帮助</Button>
        <Button icon="mail">反馈</Button>
        <Button icon="rollback">返回</Button>
      </header>
    )
  }
}

export default Header;
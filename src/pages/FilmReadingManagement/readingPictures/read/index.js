import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import Header from '../header';
import Left from './left';
import Middle from './middle';
import Right from './right';
import styles from './index.less';

@connect(({ readingPictures, loading }) => ({
  readingPictures,
  loading: loading.models.readingPictures
}))
class List extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      frame: 1
    }
  }

  setFrame = frame => this.setState({frame});

  render() {
    const {frame} = this.state;
    return (
      // <div className={styles.wrap}>
      //   <Header type="1" />
      <div className={styles.con}>
        <div className={styles.left}>
          <Left />
        </div>
        <div className={styles.middle}>
          <Middle frame={frame} setFrame={this.setFrame} />
        </div>
        <div className={styles.right}>
          <Right frame={frame} setFrame={this.setFrame} />
        </div>
      </div>
      // </div>
    );
  }
}

export default List;

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import ViewReportComponent from '@/components/ViewReportComponent'
// import Header from '../header';
import Top from './top';
import Bottom from './bottom';
import Report from './report';

import styles from './index.less';

@connect(({ readingPictures, loading }) => ({
  readingPictures,
  loading: loading.models.readingPictures,
}))
class List extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      preview: true
    }
  }

  render() {
    const {preview} = this.state;
    return (
      // <div className={styles.wrap}>
      //   <Header type="2" />
      <div className={styles.con}>
        <div className={styles.left}>
          {
            preview ? <ViewReportComponent /> : 
            <>
              <Top />
              <Bottom />
            </>
          }
          
        </div>
        <Report />
      </div>
      // </div>
    )
  }
}

export default List;
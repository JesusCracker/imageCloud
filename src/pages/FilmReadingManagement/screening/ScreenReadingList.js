import React, { PureComponent } from 'react';
import { Card, Tabs } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './ScreenReadingList.less';
import TableList from './WaitReadingList'

const { TabPane } = Tabs;

@connect(({ waitReading, loading }) => ({
  waitReading,
  loading: loading.models.waitReading,
}))
class ContentList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabsChangeKey: '3'
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'waitReading/fetchListTotal',
    })
  }

  handleTab = (key) => {
    this.setState({
      tabsChangeKey: key
    });
  }

  render() {
    const { waitReading: { listToatl } } = this.props
    const { tabsChangeKey } = this.state
    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Tabs defaultActiveKey="3" onChange={this.handleTab}>
              <TabPane tab="待读图" key="3">
                {tabsChangeKey === '3' && <TableList tabsChangeKey={tabsChangeKey} />}
              </TabPane>
              <TabPane tab={`读图中（${listToatl && listToatl.readingNum ? listToatl.readingNum : '0'}）`} key="10">
                {tabsChangeKey === '10' && <TableList tabsChangeKey={tabsChangeKey} />}
              </TabPane>
              <TabPane tab='已完成' key="20">
                {tabsChangeKey === '20' && <TableList tabsChangeKey={tabsChangeKey} />}
              </TabPane>
              <TabPane tab="已驳回" key="25">
                {tabsChangeKey === '25' && <TableList tabsChangeKey={tabsChangeKey} />}
              </TabPane>
              <TabPane tab="已关闭" key="30">
                {tabsChangeKey === '30' && <TableList tabsChangeKey={tabsChangeKey} />}
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ContentList;

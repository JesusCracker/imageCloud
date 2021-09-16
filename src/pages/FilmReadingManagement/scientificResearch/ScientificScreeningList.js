import React, { PureComponent } from 'react';
import { Card, Tabs } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './ScientificScreeningList.less';
import ScientificList from './ScientificReading'

const { TabPane } = Tabs;

@connect(({ scientReading, loading }) => ({
  scientReading,
  loading: loading.models.scientReading,
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
      type: 'scientReading/fetchListTotal',
    })
  }

  handleTab = (key) => {
    this.setState({
      tabsChangeKey: key
    });
  }

  render() {
    const { scientReading: { listToatl } } = this.props
    const { tabsChangeKey } = this.state
    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Tabs defaultActiveKey="3" onChange={this.handleTab}>
              <TabPane tab={`全部（${listToatl && listToatl.aisonoUserNum ? listToatl.aisonoUserNum : '0'}）`} key="3">
                {tabsChangeKey === '3' && <ScientificList tabsChangeKey={tabsChangeKey} />}
              </TabPane>
              <TabPane tab={`读图中（${listToatl && listToatl.readingNum ? listToatl.readingNum : '0'}）`} key="10">
                {tabsChangeKey === '10' && <ScientificList tabsChangeKey={tabsChangeKey} />}
              </TabPane>
              <TabPane tab={`已完成（${listToatl && listToatl.finishedNum ? listToatl.finishedNum : '0'}）`} key="20">
                {tabsChangeKey === '20' && <ScientificList tabsChangeKey={tabsChangeKey} />}
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ContentList;

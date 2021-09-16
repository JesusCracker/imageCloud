import React, { PureComponent } from 'react';
import { Card, Tabs } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ScreenOrganList from './ScreenOrgan'
import ReadingComList from './ReadingCom'

const { TabPane } = Tabs;

class OrangManage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabsChangeOrgan: '1'
    }
  }

  handleTab = (key) => {
    this.setState({
      tabsChangeOrgan: key
    });
  }

  render() {
    const { tabsChangeOrgan } = this.state
    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div>
            <Tabs defaultActiveKey="1" onChange={this.handleTab}>
              <TabPane tab="阅片机构" key="1">
                {tabsChangeOrgan==='1'&& <ScreenOrganList />}
              </TabPane>
              <TabPane tab="筛查机构" key="2">
                {tabsChangeOrgan==='2'&& <ReadingComList />}
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default OrangManage;

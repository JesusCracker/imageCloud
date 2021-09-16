import React, { PureComponent } from 'react';
import { Typography } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { Title, Paragraph } = Typography;

class Reading extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <PageHeaderWrapper title="如何阅片">
        <Typography>
          <Title>Introduction</Title>
          <Paragraph>
            In the process of internal desktop applications development, many different design specs and
            implementations would be involved, which might cause designers and developers difficulties and
            duplication and reduce the efficiency of development.
          </Paragraph>
        </Typography>
      </PageHeaderWrapper>
    );
  }
}

export default Reading

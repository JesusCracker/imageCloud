import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { Spin, Tag, Menu, Icon, Dropdown, Avatar, Tooltip, Modal } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import { imgUrlPath } from '@/global'
import router from 'umi/router';
import NoticeIcon from '../NoticeIcon';
// import HeaderSearch from '../HeaderSearch';
import SelectLang from '../SelectLang';
import styles from './index.less';
import ProductSuggestion from '../../pages/HelpCenter/ProductSuggestion'

export default class GlobalHeaderRight extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      showSuggest: false
    }
  }

  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(newNotice.datetime).fromNow();
      }
      if (newNotice.content && newNotice.status === 2) {
        newNotice.title = (
          <div>
            <Tag color="#f50" style={{ marginRight: 0 }}>
              未读
            </Tag>
            {newNotice.title}
          </div>
        );
      }
      return newNotice;
    }).sort((a) => a.status === 2 ? -1 : 1);
    return groupBy(newNotices, 'type');
  }

  showSuggest = ()=>{
    this.setState({showSuggest: true})
  }

  hideSuggest = () => {
    this.setState({
      showSuggest: false,
    })
  }

  sendAction = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'suggestion/productSuggestion',
      payload: params,
    }).then(res => {
      if (res?.status === 1) {
        this.hideSuggest();
      }
    });
  }

  changeNoticeStatus(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/changeMessageStatus',
      payload: id
    }).then(res => {
      if(res && res.status === 1) {
        dispatch({
          type: 'global/fetchAllNotices',
        });
      }
    })
  }

  render() {
    const {
      currentUser,
      fetchingNotices,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      theme,
    } = this.props;
    const { showSuggest } = this.state
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userCenter">
          <Icon type="user" />
          <FormattedMessage id="menu.accountInfo" defaultMessage="account center" />
        </Menu.Item>
        {/*<Menu.Item key="userinfo">*/}
        {/*  <Icon type="setting" />*/}
        {/*  <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />*/}
        {/*</Menu.Item>*/}
        <Menu.Item key="triggerError">
          <Icon type="close-circle" />
          <FormattedMessage id="menu.account.trigger" defaultMessage="Trigger Error" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        {/*站内搜索*/}
        {/*<HeaderSearch*/}
        {/*  className={`${styles.action} ${styles.search}`}*/}
        {/*  placeholder={formatMessage({ id: 'component.globalHeader.search' })}*/}
        {/*  dataSource={[*/}
        {/*    formatMessage({ id: 'component.globalHeader.search.example1' }),*/}
        {/*    formatMessage({ id: 'component.globalHeader.search.example2' }),*/}
        {/*    formatMessage({ id: 'component.globalHeader.search.example3' }),*/}
        {/*  ]}*/}
        {/*  onSearch={value => {*/}
        {/*    console.log('input', value); // eslint-disable-line*/}
        {/*  }}*/}
        {/*  onPressEnter={value => {*/}
        {/*    console.log('enter', value); // eslint-disable-line*/}
        {/*  }}*/}
        {/*/>*/}
        {/* 使用文档 */}
        <NoticeIcon
          className={styles.action}
          count={currentUser.notifyCount}
          onItemClick={(item) => {
            // console.log(item, tabProps); // eslint-disable-line
            router.push({pathname: '/accountInfo', state: {messageId: item.id} })
            this.changeNoticeStatus(item.id)
          }}
          locale={{
            emptyText: formatMessage({ id: 'component.noticeIcon.empty' }),
            clear: formatMessage({ id: 'component.noticeIcon.clear' }),
          }}
          onClear={onNoticeClear}
          onPopupVisibleChange={onNoticeVisibleChange}
          loading={fetchingNotices}
          popupAlign={{ offset: [20, -16] }}
          clearClose
        >
          <NoticeIcon.Tab
            showClear={false}
            list={noticeData['1'] && noticeData['1'].slice(0, 10)}
            title={formatMessage({ id: 'component.globalHeader.notification' })}
            name="notification"
            emptyText={formatMessage({ id: 'component.globalHeader.notification.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
          />
          <NoticeIcon.Tab
            showClear={false}
            list={noticeData['2'] && noticeData['2'].slice(0,10)}
            title={formatMessage({ id: 'component.globalHeader.message' })}
            name="message"
            emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          />
        </NoticeIcon>
        <Tooltip title={formatMessage({ id: 'component.globalHeader.help' })}>
          <a
            target="_blank"
            href="../helpCenter/helpCenter"
            rel="noopener noreferrer"
            className={styles.action}
          >
            <Icon type="question-circle-o" />
          </a>
        </Tooltip>
        <Tooltip title={formatMessage({ id: 'component.globalHeader.suggest' })}>
          <a className={styles.action} onClick={this.showSuggest}>
            <Icon type="exception" />
          </a>
        </Tooltip>

        {/*// 产品建议*/}
        <ProductSuggestion showSuggest={showSuggest} hideSuggest={this.hideSuggest} sendAction={this.sendAction} />

        {currentUser.name ? (
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              {
                currentUser.headicon ? (
                  <Avatar
                    size="small"
                    className={styles.avatar}
                    src={imgUrlPath + currentUser.headicon}
                    alt="avatar"
                    onError={e => {
                      if (e) {
                        // console.dir(e);
                      }
                    }}
                  />
                ) : (
                  <Avatar
                    size="small"
                    className={styles.avatar}
                    alt="avatar"
                  >
                    {currentUser.name[0]}
                  </Avatar>
                )
              }
              <span className={styles.name}>{currentUser.name}</span>
            </span>
          </Dropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
        <SelectLang className={styles.action} />
      </div>
    );
  }
}

import React, { PureComponent } from 'react';
import {
  Row,
  Col,
  Card,
  Divider,
  Spin
} from 'antd';
import moment from 'moment'
import QRCode from 'qrcode.react'
import { imgUrlPath, reportImgUrlPath } from '@/global'
import ReportLogo from '@/assets/report.png'
import styles from './index.less'

class ReportCard extends PureComponent {

  emptyImg = () => <img src="data:image/png;base64,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" alt="" width="100%" height="100%" />


   render() {
     // loading: ????????????????????????
     // institutionLogo: ??????logo
     // QRCodeUrl: ???????????????????????????????????????????????????????????????
    const {reportInfo, loading, institutionLogo, QRCodeUrl} = this.props;

    const {
      screenInstitutionName, // ??????????????????
      auditDate, // ???????????????
      name, // ????????????
      sex, // ????????????
      age, // ????????????
      orId, // ??????id
      deviceNo, // ????????????
      image1, // ??????????????????
      image2, // ??????????????????
      results, // ????????????
      notices, // ????????????
      doctorName, // ????????????
      reportDate // ?????????????????????
    } = reportInfo;
    return (
      <Spin spinning={loading}>
        <Card className={styles.reportBox}>
          <Row>
            <Col span={16}>
              {institutionLogo ? <img src={imgUrlPath + institutionLogo} alt="" style={{display: 'inline-block', width: '60px', height: '60px'}} /> : <div style={{display: 'inline-block', width: '60px', height: '60px'}}>{this.emptyImg()}</div>}
              <span style={{display: 'inline-block', height: '60px', lineHeight: '60px'}}>{screenInstitutionName || ''}</span>
            </Col>
            <Col span={8} style={{textAlign: 'end', display: 'inline-block', height: '60px', lineHeight: '60px'}}>{auditDate ? moment(auditDate).format('YYYY.MM.DD HH:mm') : ''}</Col>
          </Row>
          <div className={styles.reportTitle}>{'????????????????????????'.split('').map(item => <span key={item}>{item}</span>)}</div>
          <Row>
            <img src={ReportLogo} alt="?????????????????????????????????" width="100%" />
          </Row>
          <Divider style={{background: '#000'}} />
          <Row className={styles.baseInfo}>
            <Row className={styles.line1}>
              <Col span={8}>?????????{name || ''}</Col>
              <Col span={8}>?????????{sex || ''}</Col>
              <Col span={8}>?????????{age || ''}</Col>
            </Row>
            <Row>
              <Col span={8}>????????????{orId || ''}</Col>
              <Col span={8}>???????????????????????????</Col>
              <Col span={8}>???????????????{deviceNo || ''}</Col>
            </Row>
          </Row>
          <Divider style={{background: '#000'}} />
          <Row className={styles.picture} gutter={10}>
            <Col span={12}>
              <span>?????????</span>
              { image1 ? (<img src={reportImgUrlPath + image1} alt="??????????????????" width="100%" />) : this.emptyImg()}
            </Col>
            <Col span={12}>
              <span>?????????</span>
              { image2 ? (<img src={reportImgUrlPath + image2} alt="??????????????????" width="100%" />) : this.emptyImg()}
            </Col>
          </Row>
          <Row className={styles.results}>
            <Col>
              <span>???????????????</span>
              <div className={styles.contentBox}>
                <p>{results && results.split('@@@@')[0]}</p>
                <p>{results && results.split('@@@@')[1]}</p>
              </div>
            </Col>
          </Row>
          <Row className={styles.notices}>
            <Col>
              <span>???????????????</span>
              <div className={styles.contentBox}>
                <p>{notices && notices.split('@@@@')[0]}</p>
                <p>{notices && notices.split('@@@@')[1]}</p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={12}>???????????????{doctorName}</Col>
            <Col span={12} style={{textAlign: 'end'}}>???????????????{reportDate ? moment(reportDate).format('YYYY.MM.DD') : ''}</Col>
          </Row>
          <Divider style={{background: '#000'}} />
          <Row className={styles.footer}>
            <Col span={12}>????????????????????????????????????????????????</Col>
            <Col span={12} className={styles.qrCode}>
              <QRCode
                value={QRCodeUrl || 'http://www.aisono.cn:8081/user/login'}
                size={64}
                bgColor="#ffffff"
                fgColor="#000000"
                level="L"
                includeMargin={false}
                renderAs="svg"
              />
            </Col>
          </Row>
        </Card>
      </Spin>
    )
  }

}

ReportCard.defaultProps = {
  loading: false,
  reportInfo: {
    screenInstitutionName: '',
    auditDate: '',
    name:'',
    sex: '',
    age: '',
    orId: '',
    deviceNo: '',
    image1: '',
    image2: '',
    results: '',
    notices: '',
    doctorName: '',
    reportDate: ''
  },
  QRCodeUrl: '',
  institutionLogo: ''
}

export default ReportCard;

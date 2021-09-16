import mockjs from 'mockjs';

const getNotice = {
  "status":1,
  "message":"成功",
  "date":null,
  "data":[
    {
      id: 1,
      name: "乌珠珠",
      sex: '女',
      phone: '182 8888 3351',
      job: '阅片医生',
      lastloginDate: 1607345550000,
      lastAddress: '四川成都',
      lastIp: '192.168.0.1'
    },
    {
      id: 2,
      name: "乌珠珠",
      sex: '女',
      phone: '182 8888 3351',
      job: '阅片医生',
      lastloginDate: 1607345540000,
      lastAddress: '四川成都',
      lastIp: '192.168.0.1'
    },
    {
      id: 3,
      name: "乌珠珠",
      sex: '女',
      phone: '182 8888 3351',
      job: '阅片医生',
      lastloginDate: 1607345560000,
      lastAddress: '四川成都',
      lastIp: '192.168.0.1'
    },
    {
      id: 4,
      name: "乌珠珠",
      sex: '女',
      phone: '182 8888 3351',
      job: '阅片医生',
      lastloginDate: 1607345560000,
      lastAddress: '四川成都',
      lastIp: '192.168.0.1'
    },
    {
      id: 5,
      name: "乌珠珠",
      sex: '女',
      phone: '182 8888 3351',
      job: '阅片医生',
      lastloginDate: 1607345560000,
      lastAddress: '四川成都',
      lastIp: '192.168.0.1'
    },
    {
      id: 6,
      name: "乌珠珠",
      sex: '女',
      phone: '182 8888 3351',
      job: '阅片医生',
      lastloginDate: 1607345560000,
      lastAddress: '四川成都',
      lastIp: '192.168.0.1'
    },
    {
      id: 7,
      name: "乌珠珠",
      sex: '女',
      phone: '182 8888 3351',
      job: '阅片医生',
      lastloginDate: 1607345560000,
      lastAddress: '四川成都',
      lastIp: '192.168.0.1'
    },
    {
      id: 8,
      name: "乌珠珠",
      sex: '女',
      phone: '182 8888 3351',
      job: '阅片医生',
      lastloginDate: 1607345560000,
      lastAddress: '四川成都',
      lastIp: '192.168.0.1'
    },
    {
      id: 9,
      name: "乌珠珠",
      sex: '女',
      phone: '182 8888 3351',
      job: '阅片医生',
      lastloginDate: 1607345560000,
      lastAddress: '四川成都',
      lastIp: '192.168.0.1'
    },
    {
      id: 10,
      name: "乌珠珠",
      sex: '女',
      phone: '182 8888 3351',
      job: '阅片医生',
      lastloginDate: 1607345560000,
      lastAddress: '四川成都',
      lastIp: '192.168.0.1'
    },
    {
      id: 11,
      name: "乌珠珠",
      sex: '女',
      phone: '182 8888 3351',
      job: '阅片医生',
      lastloginDate: 1607345560000,
      lastAddress: '四川成都',
      lastIp: '192.168.0.1'
    }
  ],
  "dataTotal":11
};

export default {
  'POST /api/user/sysUser/query2' : (req, res) => {
    res.send( getNotice );
  }
};

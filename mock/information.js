import mockjs from 'mockjs';

const getNotice = {
  "status":1,
  "message":"成功",
  "date":null,
  "data":[
    {
      id: 1,
      sender: "管理员",
      messageNotification: '阅片通知',
      messageContent: '系统功能上新培训讲解，今晚18:00，链接...',
      time: 1607411228000
    },
    {
      id: 2,
      sender: "管理员",
      messageNotification: '阅片通知',
      messageContent: '系统功能上新培训讲解，今晚18:00，链接...',
      time: 1602143689000
    },
    {
      id: 3,
      sender: "管理员",
      messageNotification: '阅片通知',
      messageContent: '系统功能上新培训讲解，今晚18:00，链接...',
      time: 1570521289000
    },
    {
      id: 4,
      sender: "管理员",
      messageNotification: '阅片通知',
      messageContent: '系统功能上新培训讲解，今晚18:00，链接...',
      time: 1607327720000
    },
    {
      id: 5,
      sender: "管理员",
      messageNotification: '阅片通知',
      messageContent: '系统功能上新培训讲解，今晚18:00，链接...',
      time: 1607411228000
    },
    {
      id: 6,
      sender: "管理员",
      messageNotification: '阅片通知',
      messageContent: '系统功能上新培训讲解，今晚18:00，链接...',
      time: 1607411228000
    },
    {
      id: 7,
      sender: "管理员",
      messageNotification: '阅片通知',
      messageContent: '系统功能上新培训讲解，今晚18:00，链接...',
      time: 1607411228000
    },
    {
      id: 8,
      sender: "管理员",
      messageNotification: '阅片通知',
      messageContent: '系统功能上新培训讲解，今晚18:00，链接...',
      time: 1607411228000
    },
    {
      id: 9,
      sender: "管理员",
      messageNotification: '阅片通知',
      messageContent: '系统功能上新培训讲解，今晚18:00，链接...',
      time: 1607411228000
    },
    {
      id: 10,
      sender: "管理员",
      messageNotification: '阅片通知',
      messageContent: '系统功能上新培训讲解，今晚18:00，链接...',
      time: 1607411228000
    },
    {
      id: 11,
      sender: "管理员",
      messageNotification: '阅片通知',
      messageContent: '系统功能上新培训讲解，今晚18:00，链接...',
      time: 1607411228000
    },
  ],
  "dataTotal":11
};
const getNotice2 = {
  "status":1,
  "message":"成功",
  "date":null,
  "data":[
    {
      id: 2,
      sender: "管理员",
      messageNotification: '阅片通知',
      messageContent: '系统功能上新培训讲解，今晚18:00，链接...',
      time: 1602143689000
    },
    {
      id: 3,
      sender: "管理员",
      messageNotification: '阅片通知',
      messageContent: '系统功能上新培训讲解，今晚18:00，链接...',
      time: 1570521289000
    },
    {
      id: 4,
      sender: "管理员",
      messageNotification: '阅片通知',
      messageContent: '系统功能上新培训讲解，今晚18:00，链接...',
      time: 1607327720000
    },
    {
      id: 5,
      sender: "管理员",
      messageNotification: '阅片通知',
      messageContent: '系统功能上新培训讲解，今晚18:00，链接...',
      time: 1607411228000
    },
    {
      id: 6,
      sender: "管理员",
      messageNotification: '阅片通知',
      messageContent: '系统功能上新培训讲解，今晚18:00，链接...',
      time: 1607411228000
    },
    {
      id: 7,
      sender: "管理员",
      messageNotification: '阅片通知',
      messageContent: '系统功能上新培训讲解，今晚18:00，链接...',
      time: 1607411228000
    },
    {
      id: 8,
      sender: "管理员",
      messageNotification: '阅片通知',
      messageContent: '系统功能上新培训讲解，今晚18:00，链接...',
      time: 1607411228000
    },
    {
      id: 9,
      sender: "管理员",
      messageNotification: '阅片通知',
      messageContent: '系统功能上新培训讲解，今晚18:00，链接...',
      time: 1607411228000
    },
    {
      id: 10,
      sender: "管理员",
      messageNotification: '阅片通知',
      messageContent: '系统功能上新培训讲解，今晚18:00，链接...',
      time: 1607411228000
    },
    {
      id: 11,
      sender: "管理员",
      messageNotification: '阅片通知',
      messageContent: '系统功能上新培训讲解，今晚18:00，链接...',
      time: 1607411228000
    },
  ],
  "dataTotal":10
};

export default {
  'POST /api/user/hisMessage/getMessageList2' : (req, res) => {
    res.send( getNotice );
  },
  'POST /api/deleteInformation' : (req, res) => {
    res.send( getNotice2 );
  }
};

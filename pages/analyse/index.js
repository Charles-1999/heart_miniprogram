import request from '../../utils/request';

Page({
  data: {
    onInitChart: null,
    onInitRadar: null,
    data: []
  },
  onLoad: function (options) {

    this.getDateData()
    this.setData({
      onInitChart: this.onInitChart,
      onInitRadar: this.onInitRadar
    })
  },
  onShow: function () {

  },
  async getDateData() {
    const res = await request({
      url: "/data/date"
    })
    this.setData({
      data: res
    })
    console.log(res)
  },
  onInitChart(F2, config) {
    const data = [
      [0, 0, 10],
      [0, 1, 19],
      [0, 2, 8],
      [0, 3, 24],
      [0, 4, 67],
      [0, 5, 18],
      [0, 6, 18],
      [1, 0, 92],
      [1, 1, 58],
      [1, 2, 78],
      [1, 3, 117],
      [1, 4, 48],
      [1, 5, 48],
      [1, 6, 48],
      [2, 0, 35],
      [2, 1, 15],
      [2, 2, 123],
      [2, 3, 64],
      [2, 4, 52],
      [2, 5, 52],
      [2, 6, 52],
      [3, 0, 72],
      [3, 1, 25],
      [3, 2, 114],
      [3, 3, 19],
      [3, 4, 16],
      [3, 5, 16],
      [3, 6, 16],
      [4, 0, 38],
      [4, 1, 5],
      [4, 2, 8],
      [4, 3, 117],
      [4, 4, 115],
      [4, 5, 115],
      [4, 6, 115],
      [5, 0, 88],
      [5, 1, 32],
      [5, 2, 12],
      [5, 3, 6],
      [5, 4, 60],
      [5, 5, 23],
      [5, 6, 2],
      [6, 0, 13],
      [6, 1, 44],
      [6, 2, 88],
      [6, 3, 98],
      [6, 4, 96],
      [6, 5, 96],
      [6, 6, 96],
      [7, 0, 31],
      [7, 1, 1],
      [7, 2, 82],
      [7, 3, 32],
      [7, 4, 40],
      [7, 5, 10],
      [7, 6, 30],
      [8, 0, 85],
      [8, 1, 97],
      [8, 2, 123],
      [8, 3, 64],
      [8, 4, 0],
      [8, 5, 84],
      [8, 6, 84],
      [9, 0, 47],
      [9, 1, 114],
      [9, 2, 31],
      [9, 3, 48],
      [9, 4, 91],
      [9, 5, 10],
      [9, 6, 91]
    ];
    const source = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const obj = {};
      obj.week = item[0];
      obj.day = item[1];
      obj.sales = item[2];
      source.push(obj);
    }
    console.log(source)

    for (let i = 0; i < 50; i++) {

    }

    const chart = new F2.Chart({
      ...config,
      pixelRatio: wx.getStorageSync('dpr')
    });
    chart.source(source, {
      week: {
        type: 'cat',
        values: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
      },
      day: {
        type: 'cat',
        values: ['Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sta.', 'Sun.']
      }
    });

    chart.polygon()
      .position('week*day')
      .color('sales', '#BAE7FF-#1890FF-#0050B3-#ffffff')
      .style({
        lineWidth: 1,
        stroke: '#fff'
      })
      .animate({
        appear: {
          animation: 'fadeIn',
          duration: 800
        }
      });
    chart.render();
  },
  onInitRadar(F2, config) {

    const data = [{
      item: '压力',
      user: wx.getStorageSync('userInfo').nickName,
      score: 70
    }, {
      item: '运动量',
      user: wx.getStorageSync('userInfo').nickName,
      score: wx.getStorageSync('sportsData')
    }, {
      item: '睡眠',
      user: wx.getStorageSync('userInfo').nickName,
      score: wx.getStorageSync('sleepData')
    }, {
      item: '疲劳感',
      user: wx.getStorageSync('userInfo').nickName,
      score: wx.getStorageSync('tiredData')
    }, {
      item: '愉悦感',
      user: wx.getStorageSync('userInfo').nickName,
      score: wx.getStorageSync('happyData')
    }, {
      item: 'HRV',
      user: wx.getStorageSync('userInfo').nickName,
      score: 70
    }];
    const chart = new F2.Chart({
      ...config,
      pixelRatio: wx.getStorageSync('dpr')
    });

    chart.coord('polar');
    chart.source(data, {
      score: {
        min: 0,
        max: 100,
        nice: false,
        tickCount: 3
      }
    });
    chart.tooltip(true)
    chart.tooltip({
      showItemMarker: false,
      alwaysShow: true,
      custom: false, // 自定义 tooltip 内容框
      onChange: function onChange(obj) {
        const legend = chart.get('legendController').legends.top[0];
        const tooltipItems = obj.items;
        const legendItems = legend.items;
        const map = {};
        legendItems.forEach(function (item) {
          map[item.name] = _.clone(item);
        });
        tooltipItems.forEach(function (item) {
          const name = item.name;
          const value = item.value;
          if (map[name]) {
            map[name].value = value;
          }
        });
        legend.setItems(_.values(map));
      },
      onHide: function onHide() {
        const legend = chart.get('legendController').legends.top[0];
        legend.setItems(chart.getLegendItems().country);
      }
    });
    chart.area().position('item*score').color('user')
      .animate({
        appear: {
          animation: 'groupWaveIn'
        }
      });
    chart.line().position('item*score').color('user')
      .animate({
        appear: {
          animation: 'groupWaveIn'
        }
      });
    chart.guide().tag({
      textStyle: {
        fontSize: 120,
        fill: '#fff'
      }, 
    })
    chart.point().position('item*score').color('user')
      .style({
        stroke: '#fff',
        lineWidth: 1
      })
      .animate({
        appear: {
          delay: 300
        }
      });

    chart.render();
  }
})
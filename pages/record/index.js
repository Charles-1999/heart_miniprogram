import request from '../../utils/request';
import { formatTime } from '../../utils/util';

let chart

Page({
  data: {
    dataList: [],
    onInitChart: null,
    current: 0,
    preview_data: null,
    limit: 20
  },
  onShow() {
    if (!wx.getStorageSync('openid')) {
      wx.showModal({
        title: "提示",
        content: "请登陆后查看个人历史记录",
        cancelColor: 'cancelColor',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/index',
            })
          }
        }
      })
    } else {
      this.getHistory();
      this.getTips();
      this.setData({
        onInitChart: this.onInitChart
      })
    }
  },
  handleSwitch(e) {
    const current = e.currentTarget.dataset['index'];
    const { dataList } = this.data;
    const data = [];
    if (current == 0) {
      /**
       * 心率
       */
      dataList.forEach(item => {
        data.push({ x: item.timeStamp, y: item.hr_avg, ...item })
      })
      chart.clear();
      chart.source(data, {
        x: {
          type: 'timeCat',
          mask: 'MM/DD',
          tickCount: 5,
        }
      });
      chart.tooltip({
        showItemMarker: false,
        alwaysShow: true,
        onShow(ev) {
          const items = ev.items;
          items[0].name = '心率';
          const val_hr = items[0].origin['hr_avg'];
          const date = new Date(items[0].origin['timeStamp']);
          items[0].value = val_hr + '次/分  ' + formatTime(date);
        },
        onChange: (ev) => {
          this.setData({
            preview_data: ev.items[0].origin
          })
        }
      });
      chart.interaction('pan');
      chart.interval().position('x*y').animate({
        appear: {
          animation: 'shapesScaleInY'
        }
      }).style({
        radius: 10
      }).color('#ff3054');
      // chart.scrollBar({
      //   mode: 'x',
      //   xStyle: {
      //     offsetY: -5,
      //     size: 0
      //   }
      // });
    } else if (current == 1) {
      /**
       * 范围
       */
      dataList.forEach(item => {
        data.push({ x: item.timeStamp, y: [item.hr_min, item.hr_max], ...item })
      })
      chart.clear();
      chart.source(data, {
        x: {
          type: 'timeCat',
          mask: 'MM/DD',
          tickCount: 5,
        }
      });
      chart.tooltip({
        showItemMarker: false,
        alwaysShow: true,
        onShow(ev) {
          const items = ev.items;
          items[0].name = '范围';
          const val_y = items[0].origin['y'];
          const date = new Date(items[0].origin['timeStamp']);
          items[0].value = val_y[0] + '-' + val_y[1] + '次/分  ' + formatTime(date);
        },
        onChange: (ev) => {
          this.setData({
            preview_data: ev.items[0].origin
          })
        }
      });
      chart.interaction('pan');
      chart.interval().position('x*y').animate({
        appear: {
          animation: 'shapesScaleInY'
        }
      }).style({
        radius: 10
      }).color('#ff3054');
      // chart.scrollBar({
      //   mode: 'x',
      //   xStyle: {
      //     offsetY: -5,
      //     size: 0
      //   }
      // });
    } else if (current == 2) {
      /**
       * HRV
       */
      dataList.forEach(item => {
        data.push({ x: item.timeStamp, y: item.hrv, ...item })
      })
      chart.clear();
      chart.source(data, {
        x: {
          type: 'timeCat',
          mask: 'MM/DD',
          tickCount: 5,
        }
      });
      chart.tooltip({
        showItemMarker: false,
        alwaysShow: true,
        onShow(ev) {
          const items = ev.items;
          items[0].name = 'HRV';
          items[1].name = '日期';
          const val_hrv = items[0].origin['hrv'];
          const date = new Date(items[0].origin['timeStamp']);
          items[0].value = val_hrv + '毫秒  ';
          items[1].value = formatTime(date)
        },
        onChange: (ev) => {
          this.setData({
            preview_data: ev.items[0].origin
          })
        }
      });
      chart.line().position('x*y').color('#ff3054');
      chart.point().position('x*y').style({
        lineWidth: 1,
        stroke: '#ff3054'
      }).color('#fff');
      chart.interaction('pan');
    }
    // chart.changeData(data);
    chart.render();
    this.setData({
      current,
    })
  },
  async getHistory() {
    const { limit } = this.data;
    try {
      const dataList = await request({ url: `/data?limit=${limit}` })
      dataList.forEach(data => {
        const date = new Date(data.timeStamp);
        data.date = date.getDate();
        data.time = formatTime(date, 'h:m');
      })
      this.setData({
        dataList,
        preview_data: dataList[0]
      })
    } catch (err) {
      console.log(err);
    }
  },
  async getTips() {
    try {
      const tip = await request({ url: '/tips' });
      this.setData({
        tip: tip[0]
      })
    } catch (err) {
      console.log(err)
    }
  },
  onInitChart(F2, config) {
    chart = new F2.Chart({
      ...config,
    });
    const data = [];
    const { dataList } = this.data;
    dataList.forEach((item, index) => {
      data.push({ x: item.timeStamp, y: item.hr_avg, ...item })
    })
    chart.source(data, {
      x: {
        type: 'timeCat',
        mask: 'MM/DD',
        tickCount: 5,
      }
    });
    chart.tooltip({
      showItemMarker: false,
      alwaysShow: true,
      onShow(ev) {
        const items = ev.items;
        items[0].name = '心率';
        const val_hr = items[0].origin['hr_avg'];
        const date = new Date(items[0].origin['timeStamp']);
        items[0].value = val_hr + '次/分  ' + formatTime(date);
      },
      onChange: (ev) => {
        this.setData({
          preview_data: ev.items[0].origin
        })
      }
    });
    chart.interaction('pan');
    chart.interval().position('x*y').animate({
      appear: {
        animation: 'shapesScaleInY'
      }
    }).style({
      radius: 10
    }).color('#ff3054');
    // chart.scrollBar({
    //   mode: 'x',
    //   xStyle: {
    //     offsetY: -5,
    //     size: 1
    //   }
    // });
    chart.render();
    // 注意：需要把chart return 出来
    return chart;
  }
})
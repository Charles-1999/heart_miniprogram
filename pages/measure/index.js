var wxCharts = require("../../utils/wxcharts");
import request from '../../utils/request';
import fitter from '../../utils/polyfit';
import PeakCount from '../../utils/PeakCounter';
import getHeartRate from '../../utils/heartRate';

Page({
  data: {
    counter: 12,  // measure duration
    id: 0,
    res: null,  // data from serve
    data: [],   // data to serve
    grey_list: [], 
    draw_data: [],  // data for draw
    cameraReady: false,
    afterMeasure: false,
    window_size: 75,
    value: 0,
    gradientColor: {
      '0%': '#7ca6fa',
      '100%': '#1c2d50',
    },
  },
  onLoad(options) {
    const { type } = this.options;
    let { data, draw_data, window_size, grey_list } = this.data;
    let cameraReady = false;
    const ctx = wx.createCameraContext();

    const listener = ctx.onCameraFrame(frame => {
      const buf = frame.data;
      const rgba_arr = new Uint8Array(buf);
      // console.log('before')
      // 计算一帧画面的RBGA
      let red = 0, green = 0, blue = 0, grey = 0;
      if (rgba_arr[0] === 0) {
        return;
      }
      for (let i = 0; i < rgba_arr.length; i += 4) {
        red += rgba_arr[i];
        green += rgba_arr[i + 1];
        blue += rgba_arr[i + 2];
      }
      grey = parseInt((red * 299 + blue * 587 + blue * 114) / 1000);

      // 开始倒计时测量
      if (!cameraReady) {
        cameraReady = true;
        const id = setInterval(() => {
          this.setCounter();
        }, 1000)

        this.setData({
          id,
          type
        })
      }
      // console.log(red)
      if (draw_data.length >= window_size) {
        draw_data.shift()
      }
      if (red > 100000) draw_data.push(red);
      this.getMothElectro();
      data.push([red, green, blue]);
      grey_list.push(grey);
    })

    this.setData({
      listener
    })
  },
  onReady() {
    let { listener } = this.data;
    setTimeout(() => {
      listener.start();
    }, 1000)
  },
  async setCounter() {
    let { id, counter, value, listener, data, grey_list, type, draw_data } = this.data;
    counter--;
    this.setData({
      counter,
      value: Math.ceil((12 - counter) / 12*100),
      
    })

    if (counter == 0) {
      clearInterval(id);
      listener.stop();

      // if (type == 2) {
        // 本机计算
        console.log(grey_list);
        const fit_grey = fitter(grey_list);
        const fix_grey = [];
        for (let i = 0; i < fit_grey.length; i++) {
          fix_grey.push(grey_list[i] - fit_grey[i]);
        }
        const fps = grey_list.length / 12;
        const peak = PeakCount(fix_grey.splice(parseInt(fps), parseInt(fps) * 11));
        const heart_rate = getHeartRate(peak, fps);
        // console.log(heart_rate);
      // } else {
        // 服务器计算
        try {
          const res = await request({
            url: '/data',
            method: 'post',
            body: {
              data: JSON.stringify(data),
              type
            }
          })
          if (res) {
            // console.log(res)
            this.setData({
              afterMeasure: true,
              res: res.data[0]
            })
          }
        } catch (err) {
          console.log(err)
        }
      // }
    }
  },
  handleCancle() {
    const { id, listener } = this.data;
    clearInterval(id);
    listener.stop();
    wx.navigateBack({
      delta: 1,
    })
  },
  getMothElectro: function () {
    const { draw_data, window_size } = this.data;
    const id = new Array(window_size).fill('')
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    let yuelineChart = new wxCharts({
      canvasId: 'yueEle',
      type: 'line',
      categories: id,
      animation: false,
      width: 375,
      height: 175,
      dataLabel: false,
      dataPointShape: false,
      legend: false,
      series: [{
        name: '振幅',
        data: draw_data,
      },
      ],
      xAxis: {
        disableGrid: true,
      },
      yAxis: {
        disabled: true,
        gridColor: '#fff'
      },
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  nextOneStep(){
    wx.navigateTo({
      url: '/pages/collect/index'
    })
  }
})
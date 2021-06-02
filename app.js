// app.js
import request from './utils/request';

App({
  onLaunch() {
    const getPixelRatio = () => {
      let pixelRatio = 0
      wx.getSystemInfo({
        success: function (res) {
          pixelRatio = res.pixelRatio
          wx.setStorageSync('dpr', pixelRatio)
        },
        fail: function () {
          pixelRatio = 0
        }
      })
      return pixelRatio
    }
    getPixelRatio()
  },
  globalData: {
    userInfo: null
  }
})

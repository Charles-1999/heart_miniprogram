// pages/collect/index.js
import Toast from '/@vant/weapp/toast/toast';
Page({
  data: {
    currentValue1: 50,
    currentValue2: 50,
    currentValue3: 50,
    currentValue4: 50,
  },

  handleConfirm(){
    Toast.success('提交成功');
    var that = this
    wx.setStorageSync('sleepData', that.data.currentValue1)
    wx.setStorageSync('sportsData', that.data.currentValue2)
    wx.setStorageSync('happyData', that.data.currentValue3)
    wx.setStorageSync('tiredData', that.data.currentValue4)
    // wx.request({
    //   url: 'url',
    //   method: 'POST',
    //   data: {
    //     'sleep': that.data.currentValue1,
    //     'sports': that.data.currentValue2,
    //     'happy': that.data.currentValue3,
    //     'tired': that.data.currentValue4,
    //   },
    //   success(res){
      
    //   }
    // })
    setTimeout(()=> {
      wx.navigateBack({
        delta: 2,
      })
    }, 1000)
  },

  onDrag1(event) {
    this.setData({
      currentValue1: event.detail.value,
    });
  },
  onDrag2(event) {
    this.setData({
      currentValue2: event.detail.value,
    });
  },
  onDrag3(event) {
    this.setData({
      currentValue3: event.detail.value,
    });
  },
  onDrag4(event) {
    this.setData({
      currentValue4: event.detail.value,
    });
  },
});
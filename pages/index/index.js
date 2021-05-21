import request from '../../utils/request';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    today: null,
    yesterday: null,
  },
  onShow() {
    this.getData();
  },
  handleClick(e) {
    if (!wx.getStorageSync('openid')) {
      wx.showModal({
        title: "提示",
        content: "请登陆后进行测量",
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
      wx.navigateTo({
        url: '/pages/measure/index?type=' + e.currentTarget.dataset.type,
      })
    }
  },
  async getData() {
    try {
      const dataList = await request({ url: '/indexData' });
      this.setData({
        today: dataList[0],
        yesterday: dataList[1]
      })
    } catch (err) {
      console.log(err);
    }
  }
})
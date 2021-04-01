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
    wx.navigateTo({
      url: '/pages/measure/index?type=' + e.currentTarget.dataset.type,
    })
  },
  async getData() {
    try {
      const dataList = await request({ url: '/indexData' });
      this.setData({
        today: dataList[0],
        yesterday: dataList[1]
      })
    } catch(err) {
      console.log(err);
    }
  }
})
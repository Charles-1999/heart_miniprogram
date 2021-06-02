const BASE_URL = 'https://heart.ozozai.com'; 
// const BASE_URL = 'http://localhost:7002'

export default function request(options) {
  const { url, body, method = 'GET', header } = options;
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      method: method.toUpperCase(),
      data: body,
      header: {
        ...header,
        openid: wx.getStorageSync('openid')
      },
      success: res => {
        console.log('res', res);
        if (res.statusCode === 200) {
          resolve(res.data);
        }
        else
          reject(res);
      },
      fail: err => {
        reject(err);
      }
    })
  })
}
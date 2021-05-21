// const BASE_URL = 'http://192.168.31.25:7002';
// const BASE_URL = 'http://172.20.10.12:7002';
// const BASE_URL = 'http://10.20.49.23:7002';
// const BASE_URL = 'http://114.215.176.39:7002';
const BASE_URL = 'https://heart.ozozai.com'; 

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
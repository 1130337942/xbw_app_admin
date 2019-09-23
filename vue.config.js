// const API_URL = 'http://app.backstage.xunbaowang.net'
const API_URL = 'http://app.backstage.api.xunbaowang.net'

// module.exports = {
//   lintOnSave: false,
//   devServer: {
//     proxy: {
//       '/interface/v1/': {
//         target: API_URL,
//         ws: true,
//         changeOrigin: true
//       },
//       // 'https://xbw-app.oss-cn-hangzhou.aliyuncs.com': {
//       //   target: API_URL,
//       //   ws: true,
//       //   changeOrigin: true
//       // }
//     }
//   },
//   // baseUrl: process.env.NODE_ENV === 'production' ? './' : '/',
//   // productionSourceMap: process.env.NODE_ENV === 'production' ? false : true
//   // pwa: { 
//   //   iconPaths: { 
//   //     favicon32: 'tx.png', 
//   //     favicon16: 'tx.png', 
//   //     appleTouchIcon: 'tx.png', 
//   //     maskIcon: 'tx.png', 
//   //     msTileImage: 'tx.png' 
//   //   } 
//   // } 
// }
module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/interface/v1/': {
        target: API_URL,
        ws: true,
        changeOrigin: true
      },
      '/oss/upload/': {
        target: API_URL,
        ws: true,
        changeOrigin: true
      }
    }
  }
}

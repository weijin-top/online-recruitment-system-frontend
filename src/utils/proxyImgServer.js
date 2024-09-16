/*
 * @Author: 魏进 3413105907@qq.com
 * @Date: 2024-09-07 13:42:56
 * @LastEditors: 魏进 3413105907@qq.com
 * @LastEditTime: 2024-09-07 21:59:10
 * @FilePath: \online-recruitment-system\src\utils\proxyImgServer.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
app.use(cors()) // 允许跨域请求
const targetUrlBase = 'https://online-recruitment-system.oss-cn-chengdu.aliyuncs.com'
app.get('/recruitment/:url', async(req, res) => {
  try {
    const imageUrl = decodeURIComponent(req.params.url)
    const fullTargetUrl = `${targetUrlBase}/${imageUrl}`
    const response = await axios({
      method: 'GET',
      url: fullTargetUrl,
      responseType: 'arraybuffer'
    })

    // 设置正确的响应头
    res.set({
      'Content-Type': 'image/jpeg', // 或者根据实际情况设置正确的 Content-Type
      'Content-Length': Buffer.byteLength(response.data),
      'Cache-Control': 'public, max-age=31536000' // 设置缓存控制
    })

    res.send(Buffer.from(response.data))
  } catch (error) {
    console.error('Error fetching image:', error)
    res.status(500).send('Failed to fetch image')
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`)
})


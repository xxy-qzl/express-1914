// 引入之前下好的express
const express = require('express')
const app = express()


// 引入新增文章那个表的model文件（post model）
const PostModel = require('./models/post')


// 要用req.body 必须使用它的两个中间件
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.post('/api/posts', async (req, res) => {
    // console.log(req.body)

    // 如何将数据插入到数据库？
    // 1.先获取传入的实例
    const post = new PostModel(req.body)

    // 将拿到是数据写入数据库
    try {
        const data = await post.save()
        console.log(data)
        console.log('写入成功')
        res.send({
            code: 1,
            msg: "OK"
        })
    } catch (error) {
        console.log('写入失败')
        console.log(error)
        res.send({
            code: -1,
            msg: "写入失败"
        })
    }




    // res.send('新增文章')
})

app.listen(8080)
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


// 文章新增
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



// 文章查询
app.get('/api/posts', async (req, res) => {

    //1. 获取前端传递过来的参数
    let pageNum = Number(req.query.pageNum) || 1
    let pageSize = Number(req.query.pageSize) || 5
    let title = req.query.title


    //2. 获取文章的总条数
    const count = await PostModel.find({
        // 用正则来模糊查询
        title: new RegExp(title)
    }).countDocuments()


    // 3.获取文章列表
    const posts = await PostModel.find({
        title: new RegExp(title)
    }).skip((pageNum - 1) * pageSize).limit(pageSize)
    console.log(posts)


    // 响应给前端
    res.send({
        code: 0,
        msg: "OK",
        data: {
            list: posts,
            count
        }
    })



})



// 文章删除
app.delete('/api/posts/:id', async (req, res) => {
    // 1.获取需要删除的文章的id
    let id = req.params.id

    // 删除文章
    await PostModel.deleteOne({
        _id: id
    })

    // 响应
    res.send({
        code: 0,
        msg: "OK"
    })
})



// 文章修改
app.put('/api/posts/:id/update', async (req, res) => {
    // 1.获取需要修改的文章的id
    let id = req.params.id

    // 2.取出要修改的内容
    let title = req.body.title

    // 3.找到对应的文章并修改
    await PostModel.updateOne({
        _id: id
    }, req.body)

    // 响应
    res.send({
        code: 0,
        msg: "OK"
    })
})










app.listen(8080)
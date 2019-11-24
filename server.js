// 引入之前下好的express
const express = require('express')
const bcryptjs = require('bcryptjs')
const path = require('path')
const app = express()


// 引入新增文章那个表的model文件（post model）
const PostModel = require('./models/post')
// 引入用户注册那个表的model文件（user model）
const UserModel = require('./models/user')

// 使用哪些模板引擎，模板页面的存放路径
app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, './views'))


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



// 用户注册
app.post('/api/users', async (req, res) => {
    // 如何将数据插入到数据库？
    // 1.先获取传入的实例
    let username = req.body.username
    let password = req.body.password
    password = await bcryptjs.hash(password, 12)
    const user = new UserModel({
        username,
        password
    })

    // 将拿到是数据写入数据库

    await user.save()

    res.send({
        code: 0,
        msg: "OK"
    })
})



// 用户登录
app.post('/api/login', async (req, res) => {
    let username = req.body.username
    let password = req.body.password

    // 1.先判断该用户是否存在

    const user = await UserModel.findOne({
        username
    })
    // console.log(user)
    if (!user) {
        res.send({
            code: -1,
            msg: "该用户不存在"
        })
        return
    }

    // 2.如果该用户存在，在比较他们的密码
    const isOk = await bcryptjs.compare(password, user.password)
    if (isOk) {
        res.send({
            code: 0,
            msg: "登录成功",
            data: {
                userId: user._id,
                username: user.username
            }
        })
    } else {
        res.send({
            code: -1,
            msg: "密码错误"
        })
    }


})



// 文章列表页
app.get('/posts', async (req, res) => {
    // 1.获取分页参数
    let pageNum = Number(req.query.pageNum || 1)
    let pageSize = Number(req.query.pageSize || 5)

    // 2.获取数据
    const posts = await PostModel.find().skip((pageNum - 1) * pageSize).limit(pageSize)
    const count = await PostModel.find().countDocuments()
    const totalPages = Math.ceil(count / pageSize)
    res.render('post/index', {
        posts,
        totalPages,
        pageNum
    })
    console.log(posts)
})


// 文章新增页
app.get('/posts/create', async (req, res) => {
    res.render('post/create')
})


// 文章详情页
app.get('/posts/:id', async (req, res) => {
    res.render('post/show')
})










app.listen(8080)
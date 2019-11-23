// 我这个 js 是建表的 js，要想连接mongodb数据库，就得引入db.js
const mongoose = require('../conf/db')


// 我要实例化一个schema对象，里面的东西是我对这张数据库表的参数的要求，这里我们要求必须传参所以 required 为true
const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
})

// 我要生成一个名为 post 的 model 也就是表，用于文章新增
// 第一个参数是我这个表的名字的单数形式，建表时，系统会默认在后面给你加s，所以生成的表的名字名为posts
const model = mongoose.model('post', schema)


// 建表完成后，我要将他暴露出去，这样其他文件才能引用我这个模块（模块化思想）
module.exports = model

// 以上完成后做一个简单的提交
// 这个js文件的作用是用来连接 mongodb 数据库的，要是我想建数据表，那建表那个文件就必须要引入我暴露出的模块，这样才能连接数据库
// 反正只要是要连接数据库的，就要引入我这个模块


// 引入下载好的mongoose（默认下载路径是在1914这个文件夹里面）
const mongoose = require('mongoose')


// 自定义一个地址（按照接口文档的地址来，不然出错了我估计你要凉）
const uri = 'mongodb://127.0.0.1:27017/express'


// 通过mongoose.connect()方法去连接数据库，该方法会返回一个promise对象，所以你懂的  .then(成功该做的事).catch(失败该做的事)
mongoose.connect(uri).then(() => {
    console.log('数据库连接成功')
}).catch(error => {
    console.log('数据库连接失败')
    console.log(error)
})


// 将该方法暴露出去，不然别的咋连接数据库，个个都再写一遍也是够呛，此时再次@模块化思想
// 个人觉得，模块化思想就跟函数封装是一样一样的，错了别打我，这只是我认为
module.exports = mongoose
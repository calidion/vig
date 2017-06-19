# vig [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

## vig与其它框架单机性能测试对照

详细见文章 [  一个支持async的超高性能的基于node.js的Web业务框架](https://t1bao.com/thread/visit/11)

![](http://res.cloudinary.com/dawjytvkn/image/upload/v1494714446/sosos_ubpueo.png)


> vig是一个Web业务框架，本身并不想处理Web协议层面的事情。
> 但是因为协议与上层的业务是紧密关联的，所以未来可能会参与到协议层框架的开发上去。
> 原因很简单，虽然vig相对于express的折损只有1%多点。但是如果基于koa的也只折损1%，那么vig的性能就会大大的提高。


## 缘起

详见 · [缘起](https://github.com/calidion/vig/wiki) ·

## 关于vig

是一个专注于Web业务逻辑的组件化框架，主要关心：

1. 精减Web业务处理的代码
2. 简化常规Web业务的处理
3. 加速项目的开发
4. 是一个简化Web业务处理的Web框架
5. 将Web的业务逻辑标准化，可重用化是vig的主要目标

目标是：

1. 模块化(Modular)
2. 可插件化(Pluggable)
3. 可重入化(Reenterable)
4. 可集成化(Integratable)

# 功能列表

1. 组件化，所的功能都是组件级的
2. 简化的路由机制
3. 简洁，而强大的数据输入校检
4. 方便的权限验证功能
5. 框架内的事件机制
6. 实用的VIG API规范支持
7. 简单的文件上传机制
8. 简单的模型定义方式（基于waterline）
9. 统一的错误处理机制（基于Errorable）
10. 组件配置支持与全局配置支持
11. 模板支持


## 快速上手

1、创建一个test.ts文件(推荐使用TS）

```sh
vi test.ts
```

2、添加如下代码

```js/ts

import { VHandler } from "vig";
let app = require('express')();
const handler = new VHandler();

handler.set({
  prefix: '/demo',
  urls: ['/', '/hello'],
  routers: {
    get: function (req, res) {
      res.send('Hello world!');
    }
  }
});
handler.attach(app);

app.listen(10000, function () {
  console.log('server running on http://localhost:10000');
});
```

3、执行

```sh

npm install --save vig
npm install --save express

```

4、测试

```
npm test
```

## 教程
详见·[教程](https://github.com/calidion/vig/wiki/%E6%95%99%E7%A8%8B)

## 关于async/await支持的几点说明

vig对async/await的支持依赖于用户的开发环境本身，与vig框架无关。  
但是开发者需要注意的是:

1. async/await无法实现对事件的支持,所以回调函数与async/await是不同的。
2. 回调函数不会消失，async/await也无法适用于所有的场景

所以在使用vig框架时需要注意事件与IO回调的区别。  

下面再将事件与常规的IO调用的差别说明一下。

1. IO的调用本身也是事件。  
2. IO调用本身也是可以不定期的，比如网络IO。  
3. 对于时间与任务明确的IO调用，推荐async/awati，比如数据库访问，文件访问等。  
4. 对于不明确的事件应该使用回调，比如有些网络IO，一些硬件的IO事件，如键盘事件，鼠标事件等。  
5. async/await无法取代回调函数  

## 安装

```sh
$ npm install --save vig
$ yarn add vig
```

## 项目地址

https://github.com/calidion/vig


## License

Apache-2.0 © [calidion](https://github.com/calidion)


[npm-image]: https://badge.fury.io/js/vig.svg
[npm-url]: https://npmjs.org/package/vig
[travis-image]: https://travis-ci.org/calidion/vig.svg?branch=master
[travis-url]: https://travis-ci.org/calidion/vig
[daviddm-image]: https://david-dm.org/calidion/vig.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/calidion/vig
[coveralls-image]: https://coveralls.io/repos/calidion/vig/badge.svg
[coveralls-url]: https://coveralls.io/r/calidion/vig

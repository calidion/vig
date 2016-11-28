# vig [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

## 介绍

> A web logic focused web framework, inspired by sails.  
> modular, pluggable,reenterable and integratable.  

> 一个基于专注于web逻辑的框架，受sailsjs启发  
> 可模块化，可插件化，可重入，可集成  

> vig是一个受sailsjs启发的框架，目标是将Web的常规业务功能标准化。  
> 集中精力做Web中的C端，即将Web的MVC业务模型拆分开，将C端细化。  
> 不会再重复造服务器的轮子，  
> 服务器默认采用最流行，最符合Web的逻辑的web框架express  
> ORM默认采用waterline（balderdash出品）  
> HTML模板会采用强大的nunjucks（Mozilla出品） 


## 关于async/await支持的几点说明

vig/express对async/await的支持依赖于用户的开发环境本身与框架无关。  
async/await无法实现对事件的支持,所以不是万能的，回调函数是不可能消失的。  
http请求本身是一种事件，所以对于http请求的处理应该是基于事件。  
所以在使用vig/express框架时需要注意事件与IO回调的区别。  

下面再将事件与常规的IO调用的差别说明一下。
1、IO的调用本身也是事件。  
2、IO调用本身也是可以不定期的，比如网络IO。  
3、对于时间与任务明确的IO调用，推荐async/awati，比如数据库访问，文件访问等。  
4、对于不明确的事件应该使用回调，比如网络IO，用户的IO事件，如键盘事件，鼠标事件等。  
5、async/await无法取代回调函数  

## 安装

```sh
$ npm install --save vig
$ yarn add vig
```

## 使用



### 生成错误

```js
// errors.js
var common = require('errorable-common');
var errorable = require('errorable');
var Generator = errorable.Generator;
var errors = new Generator(common, 'zh-CN').errors;
module.exports = errors;

```

### 设定路由及处理函数

```js
// handlers.js
module.exports = [{
  prefix: '/prefix',  // 最后不能接'/'
  urls: ['/', '/:id', '/user/:id'],   // 必须以'/'开头

  /**
   * 路由处理定义，只要熟悉nodejs的req, res都知道如何处理了
   */
  // @方式一
  routers: {
    get: function (req, res) {
      res.errorize(res.errors.Success);
    },
    post: function (req, res) {
      res.restify(res.errors.Failure);
    }
  },
  // @方式二
  routers: {
    all: function (req, res) {
      res.errorize(res.errors.Success);
    }
  },
  /**
   * 策略定义，成功调用next(true),失败调用next(false);
   */
  policies: {
    get: function (req, res, next) {
      next(true);
    },
    post: function (req, res, next) {
      next(true);
    }
  },
  /**
   * 检验条件定义，如果需要校验调用next(true),如果不需要校验调用next(false);
   */
  conditions: {
    get: function (req, res, next) {
      next(true);
    }
  },
  /**
   * 失败统一处理机制
   */
  failures: {
    validation: function(error, req, res) {
      // res.status(403).send('Access Denied');
    },
    condition: function(error, req, res) {
      // res.status(403).send('Access Denied');
    },
    policy: function(error, req, res) {

    }
  },
  /**
   * 检验规则，即可添加函数自己编写，可以直接对query, params, body进行规则编写.
   * 一个handler只能有一种数据格式，暂时不支持文件检验
   */
  validations: {
    get: function (req, res, next) {
      next(true);
    },
    post: {
      required: ['query'],  // 指定必须有内容，并且必须匹配的属性,
                            // 默认validations的属性并不是强制必须传输的
      query: {
        username: {
          type: 'string',
          required: true,
          maxLength: 30,
          minLength: 2
        },
        password: {
          type: 'string',
          required: true,
          minLength: 6,
          maxLength: 30
        }
      },
      params: {
        id: {
          type: 'int',
          required: true
        }
      },
      body: {
        value: {
          type: 'int',
          required: true
        }
      }
    }
  }，
  /**
   * 事件定义，无URL无关，可以在任何一个Handler里定义
   */
  events: {
    names: ['@event1', '@event2', 'bad'],
    handlers: {
      '@event1': function (next) {
        next('@event1');
      },
      '@event2': function (next) {
        next('@event2');
      }
    }
  },
}];

```

### 调用vig框架

```js
var vig = require('vig');
    vig.init(app, errors);
    vig.addHandlers(app, handlers);
```

## 基于waterline的ORM技术

### 添加orm目录
vig的models放在指定的目录，需要手动转入目录告诉vig，然后调用vig.models.addDir添加。
代码如下：

```js
var path = require('path');
var dir = path.resolve(__dirname, './models/');
vig.models.addDir(dir);
```
### 编写一个model
详细使用请查看waterline的文档。
```js
// User.js
module.exports = {
  identity: 'user',  // 需要唯一
  attributes: {      // 所有的字段
    firstName: 'string',
    lastName: 'string',
  }
};
```

### 初始化orm,必须在指定dir之后才能生效

```js
var config = {
  adapters: {
    memory: sailsMemoryAdapter
  },
  connections: {
    default: {
      adapter: 'memory'
    }
  }
};
var options = {
  connection: 'default'
};
vig.models.init(config, options,
  function (error, models) {
    if (error) {
      throw error;
    }
    // models.User.find()
  });
```
上面的`models`就是定义的全部ORM模型。
这时你可以通过`models.User`来访问他。
`User`是去掉了`.js`的文件名。
这样你的orm功能就可以使用了。
详细的模型的使用方法参考[waterline](https://github.com/balderdashy/waterline-docs)

### 文件上传与云上传

文件上传使用的是skipper。
文件的云上传使用的是file-cloud-uploader。

使用req.file调用skipper。
使用req.cloud调用的是file-cloud-uploader。
比如提交一个字段名为txt的文件，代码如下：
```js
    app.post('/file/upload', function (req, res) {
      req.cloud('txt', {
        type: 'disk',
        config: {
          dir: path.resolve(__dirname, './uploaded/'),
          base: 'http://localhost'
        }
      }).then(function (files) {
        res.send(String(files.length));
      });
    });
```
1. req.cloud(filedName, options)
2. req.cloud返回文件数组的Promise
3. 通过
```js
var file = files[i];
var ulr = file.url;
```
来获取文件访问信息。



## License

Apache-2.0 © [calidion]()


[npm-image]: https://badge.fury.io/js/vig.svg
[npm-url]: https://npmjs.org/package/vig
[travis-image]: https://travis-ci.org/calidion/vig.svg?branch=master
[travis-url]: https://travis-ci.org/calidion/vig
[daviddm-image]: https://david-dm.org/calidion/vig.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/calidion/vig
[coveralls-image]: https://coveralls.io/repos/calidion/vig/badge.svg
[coveralls-url]: https://coveralls.io/r/calidion/vig


# 说明
目前的底层web框架相对较多，有express, koa, restify, loopback等。
但是上层的框架相对较少。
并且都是基于MVC理论的。
而MVC理论并不是一个精细的理论。
所以我们在这里会将MVC精细化，整理出一个更加符合Web的框架理论或者原型。

# Web基本的业务模型内容与vig的完成目标与进度

对于现在常见的Web模型，他通常包括如下的内容：

1. 请求与返回（Request & Response）  
[由基础Web框架提供]  
2. 前端与后端（Frontend & Backend） 
[vig只关心后端，将会提供传统的HTML模板能力与API提供能力，其它的前端功能不会再提供]
3. 数据库抽象与业务逻辑的连接（Database Design & Business Logic analystics）  
[vig不提供直接的M层支持, 但是基于waterline，提供了优秀的ORM机制]
4. 安全策略与权限管理（Security & Privileges）  
[已经完成]  
5. 共享用户与单点登录（User Sharing & Autchenication)  
6. 配置动态化与自动化( Configuration & Automation）  
7. 标准化接口（API Standardization）  
[基于errorable-express提供标准输出API]  
8. 模块化与独立化，可分布式化（Modulization，Indepency， Distribution）  
9. 错误返回（Error Response)  
[已经完成]  
10. 文件上传与云传输（Cloud File Distribution）  
[已经完成]
11. 数据输入的过滤与校验(Input Data Filtering and Validation)  
[已经完成]  
12. 将控制器、模型、业务、库、路由更方便的进行标准化。  
13. HTML页面模板  
[由第三方提供，vig只提供接入方法]  
14. 接入socket.io，提供WebSocket的能力  

所以我们在设计这个框架时，将会着重关注以上的几点。  
并努力的将这些核心内容接口化，标准化，从而方便迁移与升级。

# vig框架的原型
vig 框架的原型已经在forim框架有所体现。  
但是vig未来会加强forim里的原型代码的模块化并且会适时的更新到forim上去验证。  
forim项目地址：  
https://github.com/calidion/forim/  
原型代码地址：  
https://github.com/calidion/forim/tree/master/lib/v2  

# vig的现有组成

## 基础web框架

目前会以express的接口为标准，未来如果有可能会进行标准化。
所以测试框架会优先选择express,
由于vig的目标是基础框架无关的关注Web业务逻辑的框架，
所以只要是基于express接口标准的框架都可以轻松的与vig配合使用。

express项目地址：
http://expressjs.com/

## ORM模型

ORM模型
优先选择waterline  
项目地址：  
https://github.com/balderdashy/waterline

## 错误标准

会使用errorable的错误规范  
项目地址：  
https://github.com/calidion/errorable  

## api标准

目前称为egg api，不会考虑restful api，
因为vig是偏向Web业务的框架，所以使用偏向于业务的egg api，而不是偏向资源的RESTful API。
未来egg api会修改为 vig api
项目地址：
https://github.com/calidion/egg

## 云存储

采用file cloud uploader
项目地址：
https://github.com/calidion/file-cloud-uploader

## 数据校验

可以一次性方便的对输入数据进行检验。

采用集成node-form-validator的方式进行

https://github.com/calidion/node-form-validator

## 参考框架

sailsjs

项目地址：
http://sailsjs.org/

# 为什么要使用vig，而不直接使用sailsjs
sailsjs是一个很前卫的框架，但是sailsjs的集成度过高，不利用于Web业务的拆分。
同时因为nodejs本身的积累相对比较少，模块的成熟度并不高，因些有时候模块的可替换能力是非常重要的。
所以vig会尽量优先考虑降低耦合性，目标将几大模块的接口进行标准化。
目前我们在使用sailjs的时候已经发现了很多因为集成度过度导致的问题，所以解耦合是这个框架的主要目标之一。
而vig项目的原因就是我们使用了sails框架，会受到sailsjs的束缚。

# 目标
vig 框架是一个致力于标准化Web接口，解耦合模块的框架。
让他即能够在小企业里方便的使用，也能在大企业里自如的开发。
如果你也喜欢这些理念，并且也发现了现在所使用的框架的问题，欢迎加入一起开发。

# 预期什么时候能完成？

vig将会保持持续不断的的完善。由于vig是会立刻应该到线上的。所以它会不断的完善，但是现在暂时不会有完整的RoadMap。
它会跟根据我的实际需求不断的完善。

# 未来可以看到的基于vig的项目
forim

# 项目地址
https://github.com/calidion/vig

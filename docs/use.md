
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


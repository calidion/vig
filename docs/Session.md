VIG的Session与express的Session是一样的。
唯一的不同就是VIG支持不同的页面使用不同的Session配置，而在express下面这种配置不同是无法实现的。
下面我们介绍如何在VIG中配置Session。

### Session的配置位置
如果是直接通过VHandler设计的话，那么位置在`configs.session.middleware`;

也就是当你使用VHandler进行目录配置时,目录是`/configs/session.ts`

这时session.ts的内容示例如下：

```
import * as session from "express-session";
export = {
  middleware: session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  })
};
```

这里的session就是express的session。可以随便的根本需要修改。

如果是直接通过VHandler的set函数进行设置的话，代码是这样的。
```
import * as session from "express-session";
import { VHandler } from "vig";
const vhandler = new VHandler();

vhandler.set({
  configs: {
    session: {
      middleware: session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
      })
    }
  }
});
vhandler.attach(app);

```

这样Session的配置就完成，配置好之后就可以根据需要在适当的地方使用了。

### Session使用

session的使用可以根本HTTP的方便来编写。

比如我们要对get使用session.

#### 文件

那么配置路径是`sessions.get`;

如果是`sessions/get.ts`文件。
这时`get.ts`的内容示例如下：

```
export = {
  session: true
};
```

这样，当每次get请求发起时，系统都会启动session机制获得相关的session信息了。
其它方法的使用情况与这个是完全一样的。只需要修改一下文件名比如`post.ts`

如果要让所有的HTTP方法都使用Session，只需要提供`all.ts`即可。里面的内容跟`get.ts`中一样。

#### 变量
如果是直接通过VHandler的set函数进行设置的话，代码是这样的。
```
import * as session from "express-session";
import { VHandler } from "vig";
const vhandler = new VHandler();

vhandler.set({
  sessions: {
    get: {
      session: true
    },
    post: {
      session: true
    }
  }
});
vhandler.attach(app);

```

### Cookies
如果你只需要Cookies，但是不需要Session.
你可以这样写。

```
import * as session from "express-session";
import { VHandler } from "vig";
const vhandler = new VHandler();

vhandler.set({
  sessions: {
    get: {
      cookies: true
    }
  }
});
vhandler.attach(app);

```






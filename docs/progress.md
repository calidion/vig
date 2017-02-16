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

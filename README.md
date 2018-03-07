
Read me
===


## 简介
前端


## 使用说明

### 1) 


### 2) 环境变量


* 环境变量读取规则

    * 默认先读 .env 文件
    * 如果 .env 文件中有相应的值，那么将采用该值，并同时设置 process.env[var] = 该值。
    * 如果 .env 文件中没有相应的值，那么将采用默认值


* 环境变量的设置

    * ① Windows 项目根目录下，set 环境变量=值【没有引号】
    * ② Ubuntu 采用 export 的方式
    * ③ 以上均不采用。项目根目录下，新建一个 .env 文件，在里面添加需要的环境变量。
    * 注意：在跑 CI 的环境中，需要先手动设置一下 NODE_ENV。 config/env/test.js 已经设置了默认值。


* 新增环境变量

    * 在 ./config/env/环境变量.js 文件中，添加。
        * PORT: env.port('PORT', 3000)
        * env.port “port” 是匹配类型
        * “3000” 是默认值
    * 除了./config/env/base.js ./config/env/dev.js, ./config/env/test.js 其余环境文件不能设置默认值。


* NODE_ENV 的分类

    * 开发环境[dev]
    * 测试环境[staging]
    * 生产环境[prod]
    * CI[test]


### 3) 自动化任务
###### 每次执行自动化任务前，程序都会先监测环境变量，如果环境变量设置的内容不对，那么程序将终止。

* 命令


    * npm run assets
        * 打包静态资源，包括压缩、下载、编译 .scss、md5


    * npm run assets_dev
        * 打包静态资源，包括压缩、下载、编译 .scss、文件名称不变


    * npm run watch
        * 监测文件变化（不包括新添加的和新删除的）


    * npm run ci
        * 跑单元测试(也是在 CI 中跑的)



### 4) 起服务
###### 每次起服务前，程序都会先监测环境变量，如果环境变量设置的内容不对，那么程序将终止。

* 命令

    * gulp develop
    * node bin/www
    * npm start


### 5) 项目目录说明

* ./controllers 负责渲染模板
* ./models 负责请求数据
* ./views 静态文件模板
* ./swig 自定义 swig 标签
* .public 静态文件存在处。
    * css 存在 .scss .css 等样式文件
    * js 存放 JavaScript 文件
    * img 存放图片资源
    * widget 组件存放处。比如 widget/slide/slide.min.js, widget/slide/slide.min.css



### 6) html 模板中静态文件的引用和说明

* {% static '/js/app.js' %}
* {% static '/css/index.scss' %}
* 每执行一次打包命令，会在 ./hash 下生成的相应的文件。通关 static 标签引用静态文件的时候，它会先去 ./hash 文件夹下找该文件对应的 json 文件。



### 7) ./views/macros 使用方式

* 模板中导入 {% import 'macros/form.html' as form %}
* 在需要form表单元素的地方 {{ form.button() }}




## 关于模板引擎 swig
参考 http://paularmstrong.github.io/swig/



## 使用 npm 下载前端需要的包
* ./public 文件夹下添加package.json 的文件，把需要的第三方库添加到 dependencies 里面
    * 例如 "bootstrap": "3.3.6"
* 通过命令 npm install --prefix ./public 进行安装
* 文件都会下载到 ./public/node_modules 这个文件夹下
    


## 关于 bower
* bower.json dependencies 中添加
    * 例如 "Framework7": "https://github.com/nolimits4web/Framework7.git"



## 通过 bower 下载
### 通过 bower 下载的文件，不进行压缩处理，所以引用的时候，直接引用 xxx.min.js/css

* 命令

    * gulp bower
        * 默认会下载到 public/bower_components

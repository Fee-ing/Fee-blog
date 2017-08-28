# 一个简易版的个人博客

> 本着好玩的目的写了这个项目，仅供参考，欢迎指正。要是您“高抬贵手”，star一下下，更加欢迎啦：)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 项目简介

>主要使用vue+vuex+vue-router+vue-resource开发，数据存储这块是使用LeanCloud提供的开发版云引擎（LeanEngine），最重要的是该服务是免费的，但是每天的请求次数是有限制的，不过已足够满足需求了。有兴趣的童鞋可以去尝试一下，这里放一下[LeanEngine文档链接](https://leancloud.cn/docs/leanengine_overview.html)

## 在线预览
在线预览地址： [Fee's Zone](https://fee-ing.github.io) (请务必用电脑打开，且尽量使用高版本浏览器)

## 预览图

## 主要目录结构

>由于是使用vue-cli脚手架快速构建的，所以就不一一展示详细的目录结构了

<pre>

├── src                
│   ├── assets         
│   │	├── css
│   │	├── iconfont
│   │	├── imgs
│   │	└── js
│   ├── components     
│   │	├── editHeader.vue        //编辑器的操作组件
|   ├── router     
│   │	├── index.js        //路由配置
│   ├── store          // vuex状态管理器
│   │	├── modules       //一个空目录...
│   │	├── action.js
│   │	├── index.js
│   │	├── mutations.js
│   ├── views           // 各页面组件
│   │	└── article.vue       //发布或编辑文章页面
│   │	└── index.vue       //首页
│   │	└── login.vue       //登录页面
│   │	└── setting.vue       //用户个人信息展示和修改页面
│   │	└── tip.vue       //识别到为移动端或者浏览器版本过低时的提示页面
│   │	└── user.vue       //用户主页
│   ├── App.vue        
│   └── main.js       
</pre>

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# express-demo
express学习Demo

## 实现内容
+ 用户接口
+ 评论接口
+ 个人信息接口

## 使用的包
express

passport（验证用户信息）

passport-jwt（获取生成Token）

mongoose（连接mongoDB）

bodyParser（Post数据的格式化）

bcrypt（用于密码加密，加密方式为MD5）

gravatar（全球公认头像，用来获取默认头像，如果用户在全球公认头像注册后，便可拥有自己的头像）

jsonwebtoken（验证Token，判断用户是否登录）

validator（表单验证）

nodemon（监听文件变化自动更新文件）

## 开发工具
VSCode、postman、cmder

## 项目目录
<pre>
+-- config
|   +-- keys.js
|   +-- passport.js
+-- models
|   +-- posts.js
|   +-- profiles.js
|   +-- user.js
+-- routes
|   +-- api
|   --- |   +-- posts.js
|   --- |   +-- profiles.js
|   --- |   +-- user.js
+-- validation
|   +-- education.js
|   +-- experience.js
|   +-- is-empty.js
|   +-- login.js
|   +-- posts.js
|   +-- profile.js
|   +-- register.js
+-- server.js
+-- package.json
+-- package-lock.json
+-- .gitignore
+-- README.md
+-- LICENSE
</pre>

## 运行
> git clone xxx.git
> npm install
> npm run server || npm run start

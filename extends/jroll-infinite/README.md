# JRoll无限加载组件

## 说明
JRoll的无限加载组件jroll-infinite.js，依赖JRoll2，必须要先加载jroll.js。为了不占用太多的全局变量，该组件以JRoll原型链的一个方法形式存在，只要运行过jroll-infinite.js即可给JRoll的实例调用。

## 引入

普通方式引入

```html
<script src="jroll.js"></script>
<script src="jroll-infinite.js"></script>
```

CommonJS规范引入

```js
var JRoll = require('jroll.js');
require('jroll-infinite.js'); //不需要赋给变量，运行就好了

var jroll = new JRoll("#wrapper");
jroll.infinite(); //使能无限加载，具体配置详见下文
```

AMD规范引入（requireJS）
```js
//配置jroll-infinite依赖jroll
require.config({
    baseUrl: './',
    paths: {
        'jroll-infinite': 'js/jroll-infinite'
    }
    shim: {
        'jroll-infinite': {
            deps: ['jroll'] //jroll.js的路径
        }
    }
});

define(['jroll-infinite'], function(JRoll) {
    //jroll-infinite将会返回JRoll，因此不需要单独引入jroll.js
    var jroll = new JRoll("#wrapper");
    jroll.infinite(); //使能无限加载，具体配置详见下文
});
```

## 使用

创建JRoll实例，调用infinite方法使能下拉刷新

```js
var jroll = new JRoll("#wrapper");
jroll.infinite({
    template: "<div>{{=_obj.title}}</div>",
    getData: function(page, callback, errorCallback) {
        //完成加载数据的操作后回调执行callback方法
        ajax({
        	url: "getData.do?page=" + page,
        	success: function(data) {
        	    callback(data);
        	},
            error: function() {
                errorCallback(); // 将会显示错误提示信息
            }
        });
    }
});
```

## 选项

| 选项 | 默认值 | 必填 | 说明 |
|----------|----------|----------|----------|
| total | 99 | N | 总页数 |
| getData | null | Y | 获取后端数据 |
| hideImg | false | N | 开启之后，不在屏幕上的图片会display:none，可降低内存的使用，适合多图片的场景。注意，隐藏图片后会影响页面高度，因此图片的宽高应设为100%，由它们的父元素来控制图片的宽高 |
| blank | false | N | 开启之后，不在屏幕上的页面会display:none，可降低内存的使用，hideImg只会隐藏图片，而blank会隐藏整个分页的内容 |
| template | "" | Y | 每条数据的模板，模板里div等元素标签的属性不能省略引号 |
| loadingTip | &lt;div class=\"jroll-infinite-tip\"&gt;正在加载...&lt;/div&gt; | N | 正在加载提示信息 |
| completeTip | &lt;div class=\"jroll-infinite-tip\"&gt;已加载全部内容&lt;/div&gt; | N | 加载完成提示信息 |
| errorTip | &lt;div class=\"jroll-infinite-tip\"&gt;加载失败，上拉重试！&lt;/div&gt; | N | 加载完成提示信息 |
| root | "_obj" | N | 给内置模板引擎指定根数据变量 |
| compile | [自带的编译方法] | N | 编译方法 |
| render | [自带的渲染方法] | N | 渲染方法 |


## 模板

### 简介

JRoll-Infinite默认使用内置的模板引擎

- 优点：比以渲染速度著称的前端模板引擎——artTemplate，还要快。可传入任意类型的数据变量，artTemplate和underscore只能传入json对象。
- 缺点：不能省略传入的数据对象，语法比较严格。

> 最新的artTemplate和underscore模板引擎都使用了预编译的方式进行模板渲染，即预先创建一个传入数据对象返回渲染内容的函数。这种方式对于重复使用模板有明显的速度提升。artTemplate使用正则将所有可能出现的变量提前声明，实现限定对象作用域的假象，这种方法很难避免带来冗余的变量。underscore使用with语句限定对象作用域，性能损耗严重，js严格模式已去除了with语句。JRoll-Infinite的模板引擎使用_obj变量（默认为_obj，可自定义）指向数据对象，摒弃以上两种限定对象作用域的方法，因此会更快。

### 语法

```html
<script>
//传入模板的数据对象
var data = {
        list:[1,2,null],
        text: "hello world!!!"
    };
</script>
<!-- 模板 -->
<ul>
    {{each _obj.list as li i}}
        {{if li === 1}}
        <li>{{=i}}、{{=li}}</li>
        {{else if li === 2}}
        <li>{{=li}}</li>
        {{else}}
        <li>game over!</li>
        {{/if}}
    {{/each}}
</ul>
{{console.log(_obj.text)}}
```

- 循环 使用{{each list as li i}}{{/each}}标签，格式固定，list是数组，li是子元素，i是变量，解释成for(var i = 0,li;i < list.length; i++){li=list[i];}。
- 判断 使用{{if bool === true}}{{/if}}，解释成if(bool === true){}。
- 输出 使用{{=}}。
- 运行 使用{{}}添加分号并运行语句，如alert("yes")解释成alert("yes");。


### 使用第三方模板

- 使用artTemplate模板，重写compile

```js
var jroll = new JRoll("#wrapper");
jroll.infinite({
    getData : function(page, callback, errorCallback){...},
    compile: function(text) {
        return template.compile(text);
    },
    template: "<div class='item'>{{index}}、{{text}}</div>"
});
```

- 使用underscore模板，重写compile

```js
var jroll = new JRoll("#wrapper");
jroll.infinite({
    getData : function(page, callback, errorCallback){...},
    compile: function(text) {
        return _.template(text);
    },
    template: "<div class='item'><%=index%>、<%=text%></div>"
});
```

### 使用技巧

- 动态修改总页数

遇到搜索、分类筛选等功能时，总页数因后台返回的数据而改变的情况下需要修改总页数

```js
var jroll = new JRoll("#wrapper");
jroll.infinite({
    getData: function(page, callback, errorCallback) {
        $.ajax({
            url : "getdata.php?page="+page+"&filter=a",
            success : function(data) {
                jroll.options.total = data.total;
                callback(data.items);
            }
        });
    },
    template : "..."
});
```

- 使用infinite_callback方法手动更新数据

遇到搜索、分类筛选等功能时，不能通过下拉刷新去更新数据，此时可手动执行infinite_callback或infinite_error_callback方法。

```js
var condition, jroll;
condition = {
    filter : "a",
    page : 1
};
function search(){
    condition.filter = "b"; //修改搜索条件
    condition.page = jroll.options.page = 1; //重置第1页
    jroll.scroller.innerHTML = "";    //清空内容
    jroll.scrollTo(0, 0);  //滚回顶部
    //执行刷新数据方法
    $.ajax({
        url : "getdata.php",
        data : condition,
        type : "POST",
        success : function(data) {
            jroll.options.total = data.total;
            jroll.infinite_callback(data.items);
        },
        error: function() {
            jroll.infinite_error_callback()
        }
    });
}
jroll = new JRoll("#wrapper");
jroll.infinite({
    getData: function(page, callback, errorCallback) {
        condition.page = page;
        $.ajax({
            url : "getdata.php",
            data : condition,
            type : "POST",
            success : function(data) {
                jroll.options.total = data.total;
                callback(data.items);
            },
            error: function() {
                errorCallback()
            }
        });
    },
    template : "..."
});
search(); //执行搜索方法更新数据
```

## 更新日志

### v2.2.0 (2017-07-19)

- 添加错误处理提示`errorTip`选项及错误处理回调`errorCallback`

### v2.1.4 (2017-05-03)

- Fixed Issue 21：修复在IOS上大量图片时闪屏的问题

### v2.1.3 (2016-12-29)

- 非hideImg或blank选项不固定page的高度

### v2.1.2 (2016-12-05)

- 修复同步获取数据并执行callback时没过滤tip提示的bug

### v2.1.1 (2016-11-26)

- 修复动态修改options.total的bug

### v2.1.0 (2016-07-30)

- 完成发布
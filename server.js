var express = require('express');
var path = require('path');
// var httpProxy = require('http-proxy');
var fs = require('fs');

//创建express实例
var app = express();

app.use(express.static(path.resolve('.')));

//index page
app.get('/', function(req, res) {
	res.redirect('index.html');
});

app.listen(process.env.PORT || 3020);

console.log('JRoll listen on port 3020');

//const 값을 절대 변경 불가
//let 값 변경 가능
//const 값이 변경할지 안할 지 모를 떄

const http = require('http');
const fs = require('fs');
const url = require('url');

const app = http.createServer(function(req, res){
    let _url = req.url;
    const queryData = url.parse(_url, true).query;
    let title = queryData.id;
    console.log(queryData.id);

    if(_url === '/')
        title = 'welcome';
    if(_url === '/favicon')
        return res.writeHead(404);

    res.writeHead(200);
    fs.readFile(`data/${queryData.id}`, 'utf8', function (err, data){
        const template = `
<!doctype html>
<html lang="ko">
<head>
  <title>WEB1 - ${title}</title>
  <meta charset="utf-8">
</head>
<body>
  <h1><a href="index.html">WEB</a></h1>
  <ol>
    <li><a href="1.html">HTML</a></li>
    <li><a href="2.html">CSS</a></li>
    <li><a href="3.html">JavaScript</a></li>
  </ol>
  <h2>${title}</h2>
  <p>\</p>
</body>
</html>
    `;
    res.end();
    });
});

app.listen(3000);



















// var http = require('http');
//
// var app  = htpp.createServer(function(require, response) {
//     response.writeHead(200);
//     console.log(__dirname + request.url);
//     response.end("hello egoing");
// });
//
// app.listen(3000);
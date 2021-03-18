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
    let filePath = queryData.id;

    if(_url === '/')
        title = 'welcome';
        filePath = 'Welcome';
    if(_url === '/favicon.ico') {
        res.writeHead(404,{"content-Type" : "text/plain"});
        res.write("404 not found")
        res.end();
    }
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
    <li><a href="/?id=HTML">HTML</a></li>
    <li><a href="/?id=CSS">CSS</a></li>
    <li><a href="/?id=JavaScript">JavaScript</a></li>
  </ol>
  <h2>${title}</h2>
  <h2>${data}</h2>
</body>
</html>
    `;
        res.end(template);
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
//const 값을 절대 변경 불가
//let 값 변경 가능
//const 값이 변경할지 안할 지 모를 떄

const http = require('http');
const fs = require('fs');

const app = http.createServer(function(req, res){
    let url = req.url;
    if(req.url == '/')
        url = '/index.html';
    if(req.url == '/favicon')
        return res.writeHead(404);

    res.writeHead(200);
    res.end(fs.readFileSync(__dirname + url));
    // console.log(__dirname + req.url);
})

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
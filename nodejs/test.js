const http = require('http');
const fs = require('fs');
const url = require('url');

const app = http.createServer(function (req, res) {
    const _url = req.url;
    const queryData = url.parse(_url, true).query;
    console.log(queryData.id);
    console.log("url " + _url);
    res.end("hello world");
});

app.listen(3000);



const http = require('http');
const fs = require('fs');
const mime = require('mime');

http.createServer(function (req, res){
  const pathname = __dirname + req.url;
  fs.stat(pathname, function (err, stats){
    if(err){
      res.writeHead(404);
      res.write('Bad request 404\n');
      res.end();
    }else if(stats.isFile()){
      const type = mime.getType(pathname);
      res.setHeader('Content-Type', type);
      res.statusCode = 200;
      const file = fs.createReadStream(pathname);
      file.on("open", function(){
        file.pipe(res);
      });
      file.on("error", function(err){
        console.log(err);
      });
    }else{
      res.writeHead(403);
      res.write("Directory access is forbidden");
      res.end();
    }
  });
}).listen(3000);
console.log('Server running at 3000');

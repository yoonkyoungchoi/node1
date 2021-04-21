const http = require('http')
const fs = require('fs')
const url = require('url')
const qs = require('querystring')
const path = require('path');
const sanitizeHtml = require('sanitize-html');

const template = {
    HTML: function (title, list, body, control) {
        return `
          <!doctype html>
          <html lang="ko">
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${control}
            ${body}
          </body>
          </html>
          `
    },
    list: function (filelist) {
        let list = '<ul>'
        for (let i = 0; i < filelist.length; i++) {
            list += `<li><a href="/?id=${filelist[i]}"> ${filelist[i]} </a></li>`
        }
        list += '</ul>'
        return list
    }
};

const app = http.createServer(function (request, response) {
    const _url = request.url
    const queryData = url.parse(_url, true).query
    const pathname = url.parse(_url, true).pathname
    if (pathname === '/') {
        if (queryData.id === undefined) {
            const title = 'Welcome'
            const description = 'Hello, Node.js'

            fs.readdir('data/', function (err, data) {
                const list = template.list(data)
                const html = template.HTML(title, list,
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`
                );
                response.writeHead(200)
                response.end(html)
            })
        } else {
            fs.readdir('./data', function (err, data) {
                const list = template.list(data)
                const filteredId = path.parse(queryData.id).base;
                fs.readFile(`data/${filteredId}`, 'utf8',
                    function (err, description) {
                        const title = queryData.id
                        const sanitizedTitle = sanitizeHtml(title);
                        const sanitizedDescription = sanitizeHtml(description)
                        const html = template.HTML(sanitizedTitle, list,
                            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                            ` <a href="/create">create</a>
                                    <a href="/update?id=${sanitizedTitle}">update</a>
                                    <form action="delete_process" method="post">
                                      <input type="hidden" name="id" value="${sanitizedTitle}">
                                      <input type="submit" value="delete">
                                    </form>`,
                        )
                        response.writeHead(200)
                        response.end(html)
                    })
            })
        }
    }else if(pathname === '/create') {
        fs.readdir('./data', function (error, filelist) {
            const title = 'WEB - create'
            const list = template.list(filelist)
            const html = template.HTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `, '')
            response.writeHead(200);
            response.end(html);
        });
    }else if(pathname === '/create_process'){
        let body = ''
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            const post = qs.parse(body)
            const title = post.title
            const description = post.description
            fs.writeFile(`data/${title}`, description, 'utf-8', function (err){
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            });
        });
    } else if(pathname === '/update') {
        const filteredId = path.parse(queryData.id).base;
        fs.readdir('./data', function (error, filelist) {
            fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
                const title = queryData.id
                const list = template.list(filelist)
                const html = template.HTML(title, list,
                    `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`,
                )
                response.writeHead(200);
                response.end(html);
            });
        });
    } else if(pathname === '/update_process'){
        let body = ''
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            const post = qs.parse(body)
            const id = post.id
            const title = post.title
            const description = post.description
            fs.rename(`data/${id}`, `data/${title}`, function(error){
                fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                })
            });
        });
    } else if(pathname === '/delete_process'){
        let body = ''
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            const post = qs.parse(body)
            const id = post.id
            fs.unlink(`data/${id}`, function(error){
                response.writeHead(302, {Location: `/`});
                response.end();
            })
        });
    } else {
        response.writeHead(404)
        response.end('Not found')
    }
})
app.listen(3000)

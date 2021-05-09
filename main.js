const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const sanitizeHtml = require('sanitize-html');
const template = require('./lib/template.js');

app.get('/', function(request, response) {
    fs.readdir('./data', function(error, filelist){
        const title = 'Welcome';
        const description = 'Hello, Node.js';
        const list = template.list(filelist);
        const html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
        );
        response.send(html);
    });
});

app.get('/page/:pageId', function(request, response) {
    fs.readdir('./data', function(error, filelist){
        const filteredId = path.parse(request.params.pageId).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            const title = request.params.pageId;
            const sanitizedTitle = sanitizeHtml(title);
            const sanitizedDescription = sanitizeHtml(description, {
                allowedTags: ['h1']
            });
            const list = template.list(filelist);
            const html = template.HTML(sanitizedTitle, list,
                `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                ` <a href="/create">create</a>
                  <a href="/update/${sanitizedTitle}">update</a>
                  <form action="/delete_process" method="post">
                    <input type="hidden" name="id" value="${sanitizedTitle}">
                    <input type="submit" value="delete">
                  </form>`
            );
            response.send(html);
        });
    });
});

app.get('/create', function(request, response){
    fs.readdir('./data', function(error, filelist){
        const title = 'WEB - create';
        const list = template.list(filelist);
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
    `, '');
        response.send(html);
    });
});

app.post('/create_process', function(request, response){
    let body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        const post = qs.parse(body);
        const title = post.title;
        const description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
        })
    });
});

app.get('/update/:pageId', function(request, response){
    fs.readdir('./data', function(error, filelist){
        const filteredId = path.parse(request.params.pageId).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            const title = request.params.pageId;
            const list = template.list(filelist);
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
                `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
            );
            response.send(html);
        });
    });
});

app.post('/update_process', function(request, response){
    let body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        const post = qs.parse(body);
        const id = post.id;
        const title = post.title;
        const description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(error){
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                response.redirect(`/?id=${title}`);
            })
        });
    });
});

app.post('/delete_process', function(request, response){
    let body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        const post = qs.parse(body);
        const id = post.id;
        const filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`, function(error){
            response.redirect('/');
        })
    });
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
});
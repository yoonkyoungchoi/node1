const http = require('http')
const fs = require('fs')
const url = require('url')

const app = http.createServer(function (request, response) {
    const _url = request.url
    const queryData = url.parse(_url, true).query
    const pathname = url.parse(_url, true).pathname
    if (pathname === '/') {
        if (queryData.id === undefined) {
            const title = 'Welcome'
            const description = 'Hello, Node.js'

            fs.readdir('data/', function (err, data) {
                let list = '<ul>'
                for (let i = 0; i < data.length; i++) {
                    list += `<li><a href="/?id=${data[i]}"> ${data[i]} </a></li>`
                }
                list += '</ul>'
                const template = `
          <!doctype html>
          <html lang="ko">
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>
          `
                response.writeHead(200)
                response.end(template)
            })

        } else {
            fs.readdir('data/', function (err, data) {
                let list = '<ul>'
                for (let i = 0; i < data.length; i++) {
                    list += `<li><a href="/?id=${data[i]}"> ${data[i]} </a></li>`
                }
                list += '</ul>'
                fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
                    const title = queryData.id
                    const template = `
          <!doctype html>
          <html lang="ko">
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>
          `
                    response.writeHead(200)
                    response.end(template)
                })
            })
        }
    } else {
        response.writeHead(404)
        response.end('Not found')
    }
})
app.listen(3000)

var http = require('http');
var fs = require('fs');
var url = require('url');
const { describe } = require('node:test');
const path = require('path');
 
var app = http.createServer(function(request,response){
var _url = request.url;
var queryData = url.parse(_url, true).query;
var pathname = url.parse(_url,true).pathname;
var title = queryData.id;
var template = null;
  if(pathname == '/'){
      if(queryData.id == undefined){
        fs.readdir('./data',(error,filelist) =>{
          title = 'Welcome';
          var description = 'Hello, Node.js';
        var list = `<ul>`;
        for(var i=0; i<filelist.length; i++){
          list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
        }
        list += `</ul>`;
        var template = `<!doctype html>
        <html>
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
        `;
        response.writeHead(200);
        response.end(template);
        })
      }
    else{
      fs.readdir('./data',(error,filelist) =>{
        var list = `<ul>`;
        for(var i=0; i<filelist.length; i++){
          list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
        }
        list += `</ul>`;
        fs.readFile(`./data/${queryData.id}`,'utf-8',(err,description) => {
          var template = `<!doctype html>
          <html>
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
          `;
          response.writeHead(200);
          response.end(template);
        })
      })
    }
  }
  else{
    response.writeHead(404);
    response.end(template);
  }
});
app.listen(3000);
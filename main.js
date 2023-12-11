var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
const { describe } = require('node:test');
const path = require('path');

function templateHTML(title, list, body, control){
  return  `<!doctype html>
  <html>
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
  `;
}

function templateList(filelist){
  var list = `<ul>`;
  for(var i=0; i<filelist.length; i++){
    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
  }
  list += `</ul>`;
  return list;
}

var app = http.createServer(function(request,response){
var _url = request.url;
var queryData = url.parse(_url, true).query;
var pathname = url.parse(_url,true).pathname;
var title = queryData.id;
  if(pathname == '/'){
      if(queryData.id == undefined){
          fs.readdir('./data',(error,filelist) =>{
          title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = templateList(filelist);
          var template = templateHTML(title,list,`<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(template);
        })
      }
    else{
      fs.readdir('./data',(error,filelist) =>{
          var list = templateList(filelist);
          fs.readFile(`./data/${queryData.id}`,'utf-8',(err,description) => {
          var template = templateHTML(title,list,`<h2>${title}</h2>${description}`, 
          `<a href="/create">create</a>
          <a href="/update?id=${title}">update</a>
          <form action="delete_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <input type="submit" value="delete">
          </form>`);
          response.writeHead(200);
          response.end(template);
        })
      })
    }
  }
  else if(pathname=="/create"){
    if(queryData.id == undefined){
      fs.readdir('/data',(error,filelist) =>{
        title = 'Web - create';
        var description = 'Hello, Node.js';
        var list = templateList(filelist);
        var template = (templateHTML(title,list,`
        <form action="/create_process"method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <textarea name="description" placeholder="description"></textarea>
        <input type="submit">
        </form>`,
        ``
        ));
        response.writeHead(200);
        response.end(template);
      })
    }
  }
  else if(pathname=="/create_process"){
    var body = '';
    request.on('data',(data)=>{
      body += data;
    });
    request.on('end',()=>{
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf-8', (err) =>{
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end();
      })
    });
  }
  else if(pathname == "/update"){
    fs.readdir('./data',(error,filelist) =>{
      var list = templateList(filelist);
      fs.readFile(`./data/${queryData.id}`,'utf-8',(err,description) => {
      var template = templateHTML(title,list,`
      <form action="/update_process" method="post">
      <input type="hidden" name="id" value="${title}">
        <p><input type="text" name="title" placeholder="title", value="${title}"></p>
        <textarea name="description" placeholder="description">${description}</textarea>
        <input type="submit">
        </form>
      `,  `<a href="/create">create</a> <a href="/update_process">update</a>`);
      response.writeHead(200);
      response.end(template);
    })
  })
  }
  else if(pathname=="/update_process"){
    var body = '';
    request.on('data',(data)=>{
      body += data;
    });
    request.on('end',()=>{
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, (error) => {
        fs.writeFile(`data/${title}`, description, 'utf-8', (err) =>{
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        })
      });
    });
  }
  else if(pathname=="/delete_process"){
    var body = '';
    request.on('data',(data)=>{
      body += data;
    });
    request.on('end',()=>{
      var post = qs.parse(body);
      var id = post.id;
      fs.unlink(`data/${id}`, (err) => {
        response.writeHead(302, {Location: `/`});
          response.end();
      })
    });
  }
  else{
    response.writeHead(404);
    response.end(template);
  }
});
app.listen(3000);
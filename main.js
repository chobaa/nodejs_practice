var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
const { describe } = require('node:test');
const path = require('path');

function templateHTML(title, list, body){
  return  `<!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="create">create</a>
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
var template = null;
  if(pathname == '/'){
      if(queryData.id == undefined){
        fs.readdir('./data',(error,filelist) =>{
          title = 'Welcome';
          var description = 'Hello, Node.js';
        var list = templateList(filelist);
        response.writeHead(200);
        response.end(templateHTML(title,list,`<h2>${title}</h2>${description}`));
        })
      }
    else{
      fs.readdir('./data',(error,filelist) =>{
        var list = templateList(filelist);
        fs.readFile(`./data/${queryData.id}`,'utf-8',(err,description) => {
          response.writeHead(200);
          response.end(templateHTML(title,list,`<h2>${title}</h2>${description}`));
        })
      })
    }
  }
  else if(pathname=="/create"){
    if(queryData.id == undefined){
      fs.readdir('./data',(error,filelist) =>{
        title = 'Web - create';
        var description = 'Hello, Node.js';
      var list = templateList(filelist);
      response.writeHead(200);
      response.end(templateHTML(title,list,`
      <form action="http://localhost:3000/create_process"method="post">
      <p><input type="text" name="title" placeholder="title"></p>
      <textarea name="description" placeholder="description"></textarea>
      <input type="submit">
      </form>`
      ));
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
      console.log(post);
    });
    response.writeHead(200);
    response.end("success");
  }
  else{
    response.writeHead(404);
    response.end(template);
  }
});
app.listen(3000);
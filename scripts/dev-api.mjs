import http from 'node:http';
import session from '../api/session.js';import content from '../api/content.js';import upload from '../api/upload.js';
const routes={'/api/session':session,'/api/content':content,'/api/upload':upload};
http.createServer((req,res)=>{const handler=routes[new URL(req.url,'http://localhost').pathname];if(handler)handler(req,res);else{res.statusCode=404;res.end()}}).listen(4176,'127.0.0.1',()=>console.log('Local API listening on 4176'));

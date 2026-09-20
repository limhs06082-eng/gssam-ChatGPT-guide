// 실행: node 2026-09-20-preview-server.cjs
// 외부 네트워크에 공개하지 않는 로컬 미리보기 서버
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=__dirname;
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.txt':'text/plain; charset=utf-8','.md':'text/plain; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end('Method not allowed');}
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end('Bad request');}
 const filename=pathname==='/'?'2026-09-20-guide.html':pathname.replace(/^\/+/, '');
 const target=path.resolve(root,filename);
 if(!target.startsWith(root+path.sep)||!mime[path.extname(target)]||filename.split(/[\\/]/).some(p=>p.startsWith('.'))){res.writeHead(403);return res.end('Forbidden');}
 fs.stat(target,(err,stat)=>{if(err||!stat.isFile()){res.writeHead(404);return res.end('Not found');}
 res.writeHead(200,{'Content-Type':mime[path.extname(target)],'Content-Length':stat.size,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'});
 if(req.method==='HEAD')return res.end();const stream=fs.createReadStream(target);stream.on('error',()=>res.destroy());stream.pipe(res);
 });
});
server.listen(4173,'127.0.0.1',()=>console.log('G쌤 가이드 미리보기: http://127.0.0.1:4173'));
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?'4173 포트가 이미 사용 중입니다. 기존 미리보기 서버를 확인하세요.':error.message);process.exitCode=1;});

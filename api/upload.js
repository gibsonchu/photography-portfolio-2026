import {handleUpload} from '@vercel/blob/client';
import {guard,sameOrigin} from '../server/auth.js';
import {jsonBody,send,failure} from '../server/http.js';
import {local} from '../server/storage.js';
import {mkdir,writeFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
export default async function handler(req,res){try{if(req.method!=='POST')return send(res,405,{error:'Method not allowed'});const body=await jsonBody(req);if(local()){sameOrigin(req);guard(req);if(!['image/jpeg','image/png','image/webp','image/avif'].includes(body.type))return send(res,400,{error:'Choose a JPEG, PNG, WebP, or AVIF photo.'});const ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif'}[body.type],name=randomUUID()+'.'+ext;await mkdir('public/uploads',{recursive:true});await writeFile('public/uploads/'+name,Buffer.from(body.base64,'base64'));return send(res,200,{url:'/uploads/'+name})}
 const result=await handleUpload({body,request:req,token:process.env.PORTFOLIO_BLOB_READ_WRITE_TOKEN,onBeforeGenerateToken:async(pathname)=>{sameOrigin(req);guard(req);if(!/^photography-cms\/photos\/[\w.-]+\.(jpe?g|png|webp|avif)$/i.test(pathname))throw new Error('Invalid photo filename');return {allowedContentTypes:['image/jpeg','image/png','image/webp','image/avif'],maximumSizeInBytes:30*1024*1024,addRandomSuffix:true,validUntil:Date.now()+10*60e3}},onUploadCompleted:async()=>{}});send(res,200,result)}catch(e){failure(res,e)}}

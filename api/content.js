import {guard,sameOrigin} from '../server/auth.js';
import {jsonBody,send,failure} from '../server/http.js';
import {schema} from '../server/schema.js';
import {content,write,contentKey} from '../server/storage.js';
export default async function handler(req,res){try{if(req.method==='GET'){const result=await content();if(req.query?.admin==='1'||req.url.includes('admin=1'))guard(req);else result.value={...result.value,collections:result.value.collections.filter(c=>c.published)};return send(res,200,{content:result.value,revision:result.etag})}if(req.method!=='PUT')return send(res,405,{error:'Method not allowed'});sameOrigin(req);guard(req);const body=await jsonBody(req),value=schema.parse(body.content);const revision=await write(contentKey,value,body.revision);send(res,200,{content:value,revision})}catch(e){failure(res,e)}}

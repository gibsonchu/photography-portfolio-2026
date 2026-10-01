import {createHmac,createHash,timingSafeEqual,randomBytes} from 'node:crypto';
import {read,write,local} from './storage.js';
const cookie='photos_admin_v2';
const digest=s=>createHash('sha256').update(s).digest();
export function configured(){return Boolean(process.env.ADMIN_PASSWORD&&process.env.ADMIN_SECRET)}
export function verifyPassword(p){return configured()&&typeof p==='string'&&timingSafeEqual(digest(p),digest(process.env.ADMIN_PASSWORD))}
function sign(v){return createHmac('sha256',process.env.ADMIN_SECRET).update(v).digest('base64url')}
export function issueSession(){if(!configured())throw new Error('Admin is not configured');const data=Buffer.from(JSON.stringify({exp:Date.now()+8*3600e3,nonce:randomBytes(16).toString('hex')})).toString('base64url');return `${data}.${sign(data)}`}
export function authenticated(req){if(!configured())return false;const v=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(cookie+'='))?.slice(cookie.length+1);if(!v)return false;const [data,sig,...extra]=v.split('.');if(!data||!sig||extra.length)return false;const expected=sign(data);if(sig.length!==expected.length||!timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return false;try{return JSON.parse(Buffer.from(data,'base64url').toString()).exp>Date.now()}catch{return false}}
export function sessionCookie(value){return `${cookie}=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${value?28800:0}${local()?'':'; Secure'}`}
export function guard(req){if(!authenticated(req))throw Object.assign(new Error('Please sign in.'),{status:401})}
export function sameOrigin(req){const origin=req.headers.origin;if(!origin||(new URL(origin).host!==req.headers.host&&!(local()&&origin==='http://127.0.0.1:4175')))throw Object.assign(new Error('Request origin is not allowed.'),{status:403})}
export async function throttle(req){const ip=(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim();const key='photography-cms/login/'+createHmac('sha256',process.env.ADMIN_SECRET).update(ip).digest('hex')+'.json';for(let i=0;i<3;i++){const old=await read(key),now=Date.now(),v=old?.value;const next=v&&v.until>now?{...v,count:v.count+1}:{count:1,until:now+15*60e3};if(next.count>15)throw Object.assign(new Error('Too many attempts. Try again in 15 minutes.'),{status:429});try{await write(key,next,old?.etag);return}catch(e){if(e.status!==409)throw e}}throw Object.assign(new Error('Please try again shortly.'),{status:429})}

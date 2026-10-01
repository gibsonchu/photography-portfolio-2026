import { get,put,BlobPreconditionFailedError } from '@vercel/blob';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
export const local=()=>process.env.CMS_LOCAL==='1'&&!process.env.VERCEL;
export const blobOptions=()=>process.env.PORTFOLIO_BLOB_READ_WRITE_TOKEN?{token:process.env.PORTFOLIO_BLOB_READ_WRITE_TOKEN}:{storeId:process.env.PORTFOLIO_BLOB_STORE_ID||process.env.BLOB_STORE_ID};
const root=process.env.CMS_LOCAL_DIR?pathToFileURL(process.env.CMS_LOCAL_DIR+'/'):new URL('../.local-data/',import.meta.url);
export async function read(key){if(local()){try{const raw=await readFile(new URL(key.replaceAll('/','_'),root),'utf8');return {value:JSON.parse(raw),etag:createHash('sha256').update(raw).digest('hex')}}catch(e){if(e.code==='ENOENT')return null;throw e}}
 const r=await get(key,{...blobOptions(),access:'public',useCache:false});if(!r)return null;return {value:await new Response(r.stream).json(),etag:r.blob.etag};}
export async function write(key,value,etag){const raw=JSON.stringify(value);if(local()){await mkdir(root,{recursive:true});const old=await read(key);if((old?.etag??null)!==(etag??null))throw new Conflict();await writeFile(new URL(key.replaceAll('/','_'),root),raw);return createHash('sha256').update(raw).digest('hex')}
 try{const r=await put(key,raw,{...blobOptions(),access:'public',contentType:'application/json',addRandomSuffix:false,cacheControlMaxAge:0,...(etag?{ifMatch:etag}:{allowOverwrite:false})});return r.etag}catch(e){if(e instanceof BlobPreconditionFailedError||/already exists/.test(e.message))throw new Conflict();throw e}}
export class Conflict extends Error{constructor(){super('The site changed in another tab. Reload before saving.');this.status=409}}
export const contentKey='photography-cms/content-v1.json';
export async function content(){const saved=await read(contentKey);return saved||{value:JSON.parse(await readFile(new URL('../src/cms-seed.json',import.meta.url),'utf8')),etag:null}}

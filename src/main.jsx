import React,{useState,useEffect,lazy,Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import base from './data.json';
import seed from './cms-seed.json';
import {renderContent} from './content.js';
import './styles.css';
const Admin=lazy(()=>import('./Admin.jsx'));
function Public(){const [state,setState]=useState({content:seed,revision:'seed'});useEffect(()=>{fetch('/api/content',{signal:AbortSignal.timeout(10000)}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(setState).catch(()=>{});},[]);return <App key={state.revision||'seed'} data={renderContent(state.content,base,seed)}/>}
createRoot(document.getElementById('root')).render(<React.StrictMode>{/^\/admin\/?$/.test(location.pathname)?<Suspense fallback={<p>Loading editor…</p>}><Admin/></Suspense>:<Public/>}</React.StrictMode>);

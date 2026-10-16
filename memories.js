'use strict';
(() => {
 const hi=document.documentElement.lang==='hi';
 const form=document.querySelector('#memory-form'),status=document.querySelector('#memory-status');
 const say=(en,hindi)=>hi?hindi:en;
 const apiOrigin=window.MEMORIAL_API_ORIGIN||location.origin;
 async function request(path,options){const r=await fetch(new URL(path,apiOrigin),options);if(!r.ok)throw new Error();return r.json();}
 async function load(){
  const data=await request('/api/memories');const root=document.querySelector('#approved-memories');root.replaceChildren();
  if(data.memories.length){const title=document.createElement('h3');title.textContent=say('Memories shared with love','स्नेह से साझा की गई स्मृतियाँ');root.append(title);}
  for(const memory of data.memories){const a=document.createElement('article'),h=document.createElement('h4'),p=document.createElement('p');h.textContent=memory.name;p.textContent=memory.note;a.append(h,p);root.append(a);}
 }
 if(location.protocol==='file:')return;
 request('/api/status').then(data=>{if(data.available){form.querySelector('fieldset').disabled=false;status.textContent=say('Share a memory or leave a note.','अपनी स्मृति या संदेश साझा करें।');}return load();}).catch(()=>{});
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const fields=Object.fromEntries(new FormData(form));fields.consent=form.elements.consent.checked;
  const button=form.querySelector('button');button.disabled=true;
  status.textContent=say('Sending…','भेजा जा रहा है…');
  try{await request('/api/memories',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(fields)});form.reset();status.textContent=say('Thank you. Your memory or note has been received.','धन्यवाद। आपकी स्मृति या संदेश प्राप्त हो गया है।');}
  catch{status.textContent=say('Your submission could not be confirmed. Please try again later.','आपकी स्मृति प्राप्त होने की पुष्टि नहीं हो सकी। कृपया बाद में फिर प्रयास करें।');}
  finally{button.disabled=false;}
 });
})();

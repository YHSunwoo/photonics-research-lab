import DOMPurify from 'dompurify';
export function sanitize(html){
 const cleaned=DOMPurify.sanitize(String(html||''),{ALLOWED_TAGS:['p','div','br','h2','h3','h4','strong','b','em','i','u','s','span','ul','ol','li','blockquote','a','img','table','thead','tbody','tr','th','td','hr'],ALLOWED_ATTR:['href','src','alt','title','style','colspan','rowspan','width','height','align'],ALLOW_DATA_ATTR:false});
 const doc=new DOMParser().parseFromString(cleaned,'text/html');
 for(const el of doc.body.querySelectorAll('*')){
  const keep=[];for(const property of ['font-family','font-size','color','background-color','text-align','width','height']){const value=el.style.getPropertyValue(property);if(!value)continue;let allowed=false;
   if(property==='font-family')allowed=/^[\p{L}\p{N}\s,"'-]+$/u.test(value);
   if(property==='font-size')allowed=/^(1[2-9]|[2-4]\d|50)px$/.test(value);
   if(['color','background-color'].includes(property))allowed=/^(#[\da-f]{3,8}|rgba?\([\d\s.,%]+\)|[a-z]+)$/i.test(value);
   if(property==='text-align')allowed=/^(left|center|right|justify)$/.test(value);
   if(property==='width')allowed=/^(100|[1-9]\d?)%$/.test(value)||/^\d{1,4}px$/.test(value);
   if(property==='height')allowed=value==='auto';
   if(allowed)keep.push(property+':'+value);
  }el.removeAttribute('style');if(keep.length)el.setAttribute('style',keep.join(';'));
  for(const attr of ['href','src'])if(el.hasAttribute(attr)){const value=el.getAttribute(attr).trim();const safe=attr==='src'?/^(https:\/\/[^\s]+|assets\/[\w./-]+)$/.test(value):/^(https?:\/\/|mailto:|(?:[\w-]+\.html)(?:[?#]|$)|#)/i.test(value);if(!safe)el.removeAttribute(attr);}
  if(el.tagName==='A'){el.setAttribute('rel','noopener noreferrer');el.setAttribute('target','_blank');}
 }
 return doc.body.innerHTML;
}
export function fromText(value){return (Array.isArray(value)?value:[value||'']).map(t=>'<p>'+String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))+'</p>').join('');}
window.PRLRich=Object.freeze({sanitize,fromText,render:html=>html?'<div class="rich-content">'+sanitize(html)+'</div>':''});

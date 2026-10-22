(()=>{'use strict';
const safe=src=>typeof src==='string'&&/^(https:\/\/[^\s"'<>\\]+|assets\/[\w./-]+)$/.test(src);
const key=src=>{try{return new URL(src,location.href).href;}catch{return src;}};
function bodyImages(record){const doc=new DOMParser().parseFromString(window.PRLRich.sanitize(record.bodyHtml||''),'text/html');return [...doc.querySelectorAll('img[src]')].map(img=>img.getAttribute('src')).filter(safe);}
function unique(list){const seen=new Set();return list.filter(src=>{const k=key(src);if(!safe(src)||seen.has(k))return false;seen.add(k);return true;});}
function attached(record){const body=new Set(bodyImages(record).map(key));return unique(record.images||[]).filter(src=>!body.has(key(src)));}
function all(record){return unique([...bodyImages(record),...(record.images||[]),...(safe(record.thumbnail)?[record.thumbnail]:[])]);}
function thumbnail(record){return (safe(record.thumbnail)?record.thumbnail:null)||bodyImages(record)[0]||unique(record.images||[])[0]||'';}
window.PRLArticleMedia=Object.freeze({bodyImages,attached,all,thumbnail,key,safe});
})();

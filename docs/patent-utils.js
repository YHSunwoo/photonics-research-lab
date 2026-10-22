(function(root){
'use strict';
const months={jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12};
function details(p){
  const source=String(p.citation||p.text||'');
  let jurisdiction=p.jurisdiction;
  if(!['domestic','international'].includes(jurisdiction)){
    jurisdiction=/^(?:USA?|US\s*patent|Japan|EPO|PCT|European|JP\b|EP\b)/i.test(source.trim())?'international':/Korea\s+Patent|등록번호|출원번호|대한민국|국내/i.test(source)?'domestic':'international';
  }
  // The first Korean date is the registration date, before the application date.
  const ko=source.match(/(19\d{2}|20\d{2})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
  const en=source.match(/\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+(?:(\d{1,2}),?\s+)?(19\d{2}|20\d{2})\b/i);
  let year=Number(p.year)||0,month=0,day=0;
  if(ko){year=Number(ko[1]);month=Number(ko[2]);day=Number(ko[3]);}
  else if(en){year=Number(en[3]);month=months[en[1].slice(0,3).toLowerCase()];day=Number(en[2])||0;}
  return {jurisdiction,year,dateKey:year*10000+month*100+day,hasDate:Boolean(ko||en)};
}
function list(records,jurisdiction){return records.map((p,index)=>({p,index,...details(p)})).filter(x=>x.jurisdiction===jurisdiction).sort((a,b)=>b.dateKey-a.dateKey||a.index-b.index).map(x=>({...x.p,year:x.year?String(x.year):'',citation:String(x.p.citation||'').replace(/\s*◇\s*Domestic\s*$/i,''),text:String(x.p.text||'').replace(/\s*◇\s*Domestic\s*$/i,'')}));}
function fields(p){
 const source=String(p.text||p.citation||'').replace(/\s*◇\s*Domestic\s*$/i,'');
 const matches=[...source.matchAll(/(등록번호\s*(?:\([^)]*\))?|출원번호(?:\s*및\s*일자|\s*\([^)]*\))?|발명자|발명의\s*명칭(?:\s*\([^)]*\))?|출원인)\s*[:：]/g)];
 return matches.map((m,i)=>({label:m[1].trim(),value:source.slice(m.index+m[0].length,matches[i+1]?.index??source.length).trim()}));
}
const api=Object.freeze({details,list,fields});if(typeof module==='object'&&module.exports)module.exports=api;else root.PRLPatents=api;
})(typeof window==='object'?window:globalThis);

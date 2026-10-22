const esbuild=require('esbuild'),fs=require('fs');fs.mkdirSync('docs/vendor',{recursive:true});
for(const name of ['rich-content','rich-editor'])esbuild.buildSync({entryPoints:['src/'+name+'.js'],bundle:true,minify:true,format:'iife',target:['es2022'],outfile:'docs/'+name+'.js',legalComments:'eof'});
fs.copyFileSync('node_modules/dompurify/LICENSE','docs/vendor/DOMPurify-LICENSE.txt');

const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const elements=new Map();const get=id=>{if(!elements.has(id))elements.set(id,{hidden:false,innerHTML:'',textContent:'',attributes:{},setAttribute(k,v){this.attributes[k]=v},classList:{toggle(){}}});return elements.get(id)};
const routeButtons=['ite','poly'].map(route=>({dataset:{eaeRoute:route},setAttribute(k,v){this[k]=v}}));
const ctx={console,assert,sessionStorage:{getItem:()=>null},document:{getElementById:get,querySelector:()=>get('nav'),querySelectorAll:()=>routeButtons},location:{hash:'#eae'},history:{replaceState:(_,__,hash)=>ctx.location.hash=hash}};vm.createContext(ctx);
vm.runInContext(fs.readFileSync('dist/app.js','utf8').replace(/init\(\);\s*$/,''),ctx);vm.runInContext(fs.readFileSync('dist/eae.js','utf8'),ctx);
let count=0;function check(code){vm.runInContext(code,ctx);count++}
for(const page of ['subjects','postsecondary','eae']){ctx.page=page;check(`setPage(page);for(const id of pages){assert.equal($('panel-'+id).hidden,id!==page);assert.equal($('tab-'+id).attributes['aria-selected'],String(id===page))}assert.equal(pageFromHash(),page)`)}
check(`location.hash='#eae-alumni';assert.equal(pageFromHash(),'eae');location.hash='#builder';assert.equal(pageFromHash(),'subjects')`);
check(`assert.equal(eaeDraftCount('  one two\\nthree  ','ite'),3);assert.equal(eaeDraftCount('  ','ite'),0);assert.equal(eaeDraftCount('a b!','poly'),4)`);
check(`eaeRoute='ite';renderEaeGuide();assert(!$('eae-guide').hidden);assert($('eae-guide').innerHTML.includes('100-word course write-up'));assert($('eae-guide').innerHTML.includes('Deadlines to be confirmed'))`);
check(`eaeDrafts.ite=Array(101).fill('word').join(' ');renderEaeCounter();assert($('eae-draft-counter').textContent.includes('1 over the limit'))`);
check(`eaeDrafts.ite='<img src=x onerror=alert(1)>';renderEaeGuide();assert(!$('eae-guide').innerHTML.includes('<img src=x'));assert($('eae-guide').innerHTML.includes('&lt;img'))`);
check(`eaeChecks.ite.add(0);eaeRoute='poly';eaeDrafts.poly='a'.repeat(600);renderEaeGuide();assert($('eae-guide').innerHTML.includes('600-character course write-up'));assert($('eae-draft-counter').textContent.includes('0 remaining'));assert($('eae-guide').innerHTML.includes('1,000 characters'))`);
check(`eaeDrafts.poly+='b';renderEaeCounter();assert($('eae-draft-counter').textContent.includes('1 over the limit'));eaeRoute='ite';renderEaeGuide();assert.equal(eaeChecks.ite.size,1);assert($('eae-check-progress').textContent.includes('1 of 6'))`);
check(`renderEaeShared();assert.equal(eaeAlumni.length,6);assert.equal(eaeAlumni.filter(p=>p.format==='PDF portfolio').length,4);assert($('eae-shared').innerHTML.includes('1M8mGd4wZMo5rkirS0IqGJf41f3TH8Owo'));assert($('eae-shared').innerHTML.includes('two weeks'))`);
check(`assert(eaeDraftCount(eaeRoutes.ite.sample,'ite')<=100);assert(eaeDraftCount(eaeRoutes.poly.sample,'poly')<=600)`);
const html=fs.readFileSync('dist/index.html','utf8');assert(html.includes('Early Admissions Process'));assert(html.indexOf('src="eae.js"')<html.indexOf('src="app.js"'));assert(!html.includes('id="saved"'));count++;
const packaged=fs.readFileSync('google-apps-script/Student.html','utf8');assert(!packaged.includes('src="eae.js"'));assert(packaged.includes('function initEae()'));count++;
console.log(count+' EAE navigation, anchor, draft-limit, escaping and packaging checks passed.');

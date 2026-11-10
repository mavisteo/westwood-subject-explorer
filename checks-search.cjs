const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('dist/app.js','utf8');const ctx={};vm.createContext(ctx);vm.runInContext(source.slice(source.indexOf('function searchWords('),source.indexOf('function initSiteSearch(')),ctx);
for(const [query,title] of [['biolgy','Biology'],['portfoilo','Portfolio'],['counseling','Counselling'],['raffels','Raffles Institution'],['nanynag poly','Nanyang Polytechnic']])assert(Number.isFinite(ctx.siteSearchScore(ctx.searchWords(query),title,'')),query);
assert(ctx.siteSearchScore(['biology'],'Biology','')<ctx.siteSearchScore(['biology'],'Biolgy',''));
assert.equal(ctx.siteSearchScore(['jc'],'Science',''),Infinity);
assert.equal(ctx.siteSearchScore(['zzzzzz'],'Biology',''),Infinity);
assert.equal(ctx.siteSearchScore(['biology','zzzzzz'],'Biology',''),Infinity);
console.log('9 fuzzy search typo, ranking and unrelated-query checks passed.');

for(const query of ['bot','bots','chatbot','chatbots','wwss ecg bot','Westwood ECG chatbot']){
 const matches=ctx.siteSearchResourceMatches(ctx.searchWords(query));
 assert.equal(matches.length,2,query);
 for(const match of matches){assert.equal(match.page,'eae');assert.equal(match.route,'poly');assert(match.target.startsWith('#eae-bot-'));}
}
for(const platform of ['ChatGPT','Gemini']){
 const matches=ctx.siteSearchResourceMatches(ctx.searchWords('wwss ecg bot '+platform));
 assert.equal(matches.length,1);assert(matches[0].title.endsWith(platform));
}
assert.equal(ctx.siteSearchResourceMatches(['zzzzzz']).length,0);
console.log('Chatbot discovery works before the EAE guide is opened, with platform-specific matches.');

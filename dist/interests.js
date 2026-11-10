/* Local guided exploration. Answers stay in this page; no AI service is called. */
const interestSubjectGroups={
 'Science':['Biology','Chemistry','Physics'],
 'Humanities':['History','Geography','Social Studies'],
 'Languages':['English','Chinese','Malay','Tamil'],
 'Maths':['Elementary Math','Additional Math'],
 'Applied subjects':['Design & Technology','Art','Food & Consumer Education'],
 'Others':['Computing','Literature']
};
const interestStrengths=['Good at Math','Strong in writing','Enjoy hands-on work','Good memory','Critical thinking','Problem-solving','Creative design','Leadership','Communication','Community service','Organisation & planning','Teamwork','Perseverance','Hands-on skills','Artistic or musical talent','Physical fitness'];
const interestCareerFields=[
 ['STEM (Science, Technology, Engineering, Math)',['science','engineering','data']],
 ['Health & Life Sciences',['health','science']],['Business & Management',['business']],
 ['Arts, Design & Media',['arts','design']],['Social Services & Education',['social','humanities']],
 ['Hospitality & Tourism',['hospitality']],['IT & Computing',['computing','data']],
 ['Environment & Sustainability',['environment']],['Law, Security & Public Safety',['humanities','computing']],
 ['Sports & Recreation',['sports']],['Media & Communications',['design','humanities']],
 ['Skilled Trades & Technical Fields',['engineering']]
];
const interestSubjectMap={
 'Biology':['science','health','environment','sports'],'Chemistry':['science','health','environment'],
 'Physics':['engineering','science'],'History':['humanities'],'Geography':['environment','humanities','hospitality'],
 'Social Studies':['humanities','social'],'English':['humanities','design','social'],
 'Chinese':['humanities','social'],'Malay':['humanities','social'],'Tamil':['humanities','social'],
 'Elementary Math':['data','engineering','business'],'Additional Math':['data','engineering','computing'],
 'Design & Technology':['engineering','design'],'Art':['design','arts'],
 'Food & Consumer Education':['hospitality','science'],'Computing':['computing','data'],'Literature':['humanities','arts','design']
};
const interestStrengthMap={
 'Good at Math':['data','engineering','business'],'Strong in writing':['humanities','design'],
 'Enjoy hands-on work':['engineering','science','hospitality'],'Good memory':['science','health'],
 'Critical thinking':['data','humanities','computing'],'Problem-solving':['computing','engineering','data'],
 'Creative design':['design','arts'],'Leadership':['business','social','sports'],
 'Communication':['social','business','hospitality','humanities'],'Community service':['social','health'],
 'Organisation & planning':['business','hospitality'],'Teamwork':['social','sports','hospitality'],
 'Perseverance':['engineering','science','sports'],'Hands-on skills':['engineering','science','design'],
 'Artistic or musical talent':['arts','design'],'Physical fitness':['sports']
};
const interestTextRules=[
 [/\b(bio(logy|medical|technology)?|doctor|nurs\w*|medic\w*|health|patient|pharma\w*|dent\w*)\b/i,['health','science']],
 [/\b(chem\w*|lab\w*|experiment\w*|scientist|research)\b/i,['science']],
 [/\b(math\w*|number\w*|data|statistic\w*|analytic\w*)\b/i,['data']],
 [/\b(aircraft|aviation|aerospace|pilot|robot\w*|engineer\w*|mechanic\w*|electri\w*|machine\w*|build\w*)\b/i,['engineering']],
 [/\b(cod\w*|program\w*|comput\w*|software|cyber\w*|game\w*|app|it|ai)\b/i,['computing']],
 [/\b(design\w*|draw\w*|art\w*|film\w*|video\w*|photograph\w*)\b/i,['design','arts']],
 [/\b(music\w*|sing\w*|dance\w*|perform\w*|drama|theatre|band|guitar|choir)\b/i,['arts']],
 [/\b(business|account\w*|financ\w*|marketing|entrepreneur\w*|sell\w*|manage\w*)\b/i,['business']],
 [/\b(teach\w*|child\w*|social|community|help\w*|volunteer\w*|care\w*|counsell\w*)\b/i,['social']],
 [/\b(sport\w*|fitness|coach\w*|athlet\w*|badminton|football|basketball|netball|bowling|tchoukball|swim\w*)\b/i,['sports']],
 [/\b(cook\w*|bak\w*|chef|food|hotel\w*|touris\w*|travel\w*|hospitality|event\w*)\b/i,['hospitality']],
 [/\b(nature|animal\w*|plant\w*|environ\w*|sustain\w*|marine|geograph\w*)\b/i,['environment']],
 [/\b(law\w*|legal|police|secur\w*|journal\w*|writ\w*|history|literature|communicat\w*|present\w*)\b/i,['humanities']]
];
function interestCcaHints(value){
 const text=String(value||'').trim();
 if(/\b(yfc|youth flying|flying club)\b/i.test(text))return {areas:['engineering'],skills:['Problem-solving','Teamwork','Perseverance'],note:'Flying activities may build technical thinking, teamwork and discipline.'};
 if(/badminton|basketball|football|netball|bowling|tchoukball|sport|athlet|swim|fitness/i.test(text))return {areas:['sports'],skills:['Teamwork','Perseverance','Physical fitness'],note:'Sport may build teamwork, perseverance and physical fitness.'};
 if(/band|choir|drama|guitar|dance|perform|music|art/i.test(text))return {areas:['arts','design'],skills:['Artistic or musical talent','Teamwork','Creative design'],note:'Performing or visual arts may build creativity, teamwork and discipline.'};
 if(/npcc|ncc|ncdcc|brigade|\b(bb|gb)\b|uniform|scout|st john|red cross/i.test(text))return {areas:['social'],skills:['Leadership','Teamwork','Perseverance'],note:'Uniformed groups may build leadership, teamwork and discipline.'};
 if(/robot|comput|coding/i.test(text))return {areas:['computing','engineering'],skills:['Problem-solving','Hands-on skills','Teamwork'],note:'Technical activities may build problem-solving and practical skills.'};
 if(/ava|media|photo|film/i.test(text))return {areas:['design','arts'],skills:['Creative design','Communication','Teamwork'],note:'Media activities may build creativity, communication and teamwork.'};
 if(/council|leader|psl/i.test(text))return {areas:['social','business'],skills:['Leadership','Organisation & planning','Communication'],note:'Leadership roles may build communication and planning skills.'};
 if(/service|volunteer|community/i.test(text))return {areas:['social','health'],skills:['Community service','Communication','Teamwork'],note:'Service activities may build empathy, communication and teamwork.'};
 return {areas:[],skills:[],note:'Every CCA can help you grow. Choose the strengths that feel true for you.'};
}
function interestRankAreas(answers,catalog){
 const scores=Object.fromEntries(catalog.areas.map(a=>[a.id,0]));
 const reasons=Object.fromEntries(catalog.areas.map(a=>[a.id,[]]));
 const add=(ids,points,reason)=>ids.forEach(id=>{if(id in scores){scores[id]+=points;if(points>0&&reason&&!reasons[id].includes(reason))reasons[id].push(reason);}});
 answers.careers.forEach(label=>{const field=interestCareerFields.find(f=>f[0]===label);if(field)add(field[1],12,'Career interest: '+label+'.');});
 answers.likes.forEach(label=>add(interestSubjectMap[label]||[],4,'You enjoy '+label+'.'));
 answers.dislikes.forEach(label=>add(interestSubjectMap[label]||[],-4));
 answers.strengths.forEach(label=>add(interestStrengthMap[label]||[],1,'Strength: '+label+'.'));
 const hints=interestCcaHints(answers.cca);add(hints.areas,5,'Your CCA may offer a useful starting point.');
 for(const [value,weight,reason] of [[answers.dream,6,'Your dream career or field.'],[answers.otherStrengths,2,'The other strengths you shared.'],[answers.otherLikes,3,'The other subjects you enjoy.'],[answers.otherDislikes,-3,'']]){
  // Avoid reading an explicit “not …” phrase as a positive interest.
  const positive=interestPositiveText(value);
  for(const [rule,ids] of interestTextRules)if(rule.test(positive))add(ids,weight,reason);
 }
 const priority=reason=>reason.startsWith('Your dream')?0:reason.startsWith('Career interest')?1:reason.startsWith('Your CCA')?2:3;
 return catalog.areas.map(area=>({...area,score:scores[area.id],reasons:reasons[area.id].sort((a,b)=>priority(a)-priority(b))})).sort((a,b)=>b.score-a.score);
}
const interestTopicRules=[
 [/\b(yfc|youth flying|flying club|pilot|aviation|aircraft|aerospace|aeronautical|avionics)\b/i,['aviation']],
 [/\b(nurs\w*)\b/i,['nursing']],
 [/\b(doctor|medical|biomed\w*)\b/i,['biology','health']],
 [/\b(pharma\w*|medicine\w*|drug\w*)\b/i,['medicines']],
 [/\b(bio\w*|life science\w*)\b/i,['biology','biotechnology']],
 [/\b(chem\w*)\b/i,['chemistry']],
 [/\b(lab\w*|experiment\w*)\b/i,['laboratory']],
 [/\b(food science|food technolog\w*)\b/i,['food','laboratory']],
 [/\b(robot\w*|mechatronic\w*|automation)\b/i,['robotics','electronics']],
 [/\b(electronic\w*|circuit\w*)\b/i,['electronics']],
 [/\b(electric\w*|wiring)\b/i,['electrical']],
 [/\b(mechanic\w*|machine\w*)\b/i,['mechanical']],
 [/\b(software|cod\w*|program\w*|developer|app\w*|web\w*)\b/i,['software','programming']],
 [/\b(comput\w*|\bit\b)\b/i,['software','programming','networks']],
 [/\b(ai|artificial intelligence)\b/i,['ai']],
 [/\b(data|statistic\w*|analytic\w*)\b/i,['data']],
 [/\b(cyber\w*|hacking|forensic\w*|network\w*)\b/i,['cybersecurity','networks']],
 [/\b(law|lawyer|legal)\b/i,['law']],
 [/\b(police|public safety|security)\b/i,['security']],
 [/\b(sport\w*|fitness|coach\w*|athlet\w*|badminton|football|basketball|netball|bowling|tchoukball|swim\w*)\b/i,['sport','fitness','coaching']],
 [/\b(choir|band|guitar|music\w*|sing\w*|sound|audio)\b/i,['music','audio']],
 [/\b(drama|dance\w*|theatre|stage|perform\w*)\b/i,['theatre']],
 [/\b(media|photograph\w*|video\w*|film\w*|ava)\b/i,['media','film']],
 [/\b(art|artist|draw\w*|design\w*|illustrat\w*)\b/i,['design','visual']],
 [/\b(journal\w*|reporter|writ\w*|author)\b/i,['writing','journalism']],
 [/\b(child\w*|preschool|kindergarten|early education)\b/i,['childcare']],
 [/\b(teach\w*|educat\w*)\b/i,['education']],
 [/\b(community|social work\w*|volunteer\w*|counsell\w*)\b/i,['community','care']],
 [/\b(chef|cook\w*|culinary)\b/i,['cooking']],
 [/\b(bak\w*|pastry|dessert\w*)\b/i,['baking']],
 [/\b(hotel\w*|hospitality)\b/i,['hotel','hospitality']],
 [/\b(touris\w*|travel\w*)\b/i,['tourism']],
 [/\b(event\w*|organis\w*|organiz\w*)\b/i,['events']],
 [/\b(account\w*|bookkeep\w*)\b/i,['accounting']],
 [/\b(financ\w*|bank\w*|invest\w*)\b/i,['finance']],
 [/\b(business|entrepreneur\w*)\b/i,['business']],
 [/\b(marketing|advertis\w*|sell\w*)\b/i,['marketing']],
 [/\b(human resource\w*|recruit\w*)\b/i,['humanresources']],
 [/\b(psycholog\w*|behavio\w*)\b/i,['psychology']],
 [/\b(environ\w*|sustain\w*|ecolog\w*|conservation)\b/i,['environment']],
 [/\b(marine|ocean\w*)\b/i,['marine']],
 [/\b(plant\w*|garden\w*|landscape\w*)\b/i,['plants','environment']],
 [/\b(outdoor\w*|adventure|camp\w*)\b/i,['outdoors']],
 [/\b(beauty|makeup|make-up|cosmetic\w*)\b/i,['beauty']],
 [/\b(optic\w*|optometr\w*|eyecare)\b/i,['optics']]
];
function interestSuggestedAreaIds(answers,catalog){const rank=interestRankAreas(answers,catalog),top=rank[0]?.score||0;return rank.filter(a=>a.score>0&&a.score>=top*.55).slice(0,3).map(a=>a.id);}
function interestPositiveText(value){return String(value||'').replace(/[‘’]/g,"'").split(/\bbut\b|\bhowever\b|[;\n]/i).map(part=>part.replace(/\b(?:do not|don't|not|dislike|hate|avoid|least)\b[^,.]*/gi,'')).join('; ');}
function interestTopics(value,positive=true){const text=positive?interestPositiveText(value):String(value||'');return [...new Set(interestTopicRules.filter(([rule])=>rule.test(text)).flatMap(([,topics])=>topics))];}
function interestAvoidedCareerTopics(value){const text=String(value||'').replace(/[‘’]/g,"'");return [...new Set((text.match(/\b(?:do not|don't|not|dislike|hate|avoid)\b(?:(?!\bbut\b|\bhowever\b)[^,.;\n])*/gi)||[]).flatMap(x=>interestTopics(x,false)))];}
const interestFieldTopics={
 'STEM (Science, Technology, Engineering, Math)':['biology','chemistry','laboratory','aviation','mechanical','electrical','electronics','robotics','data','ai','programming','process'],
 'Health & Life Sciences':['health','biology','nursing','medicines','biotechnology','optics','care'],
 'Business & Management':['business','marketing','accounting','finance','humanresources','operations'],
 'Arts, Design & Media':['arts','design','visual','music','audio','theatre','film','media','writing'],
 'Social Services & Education':['community','care','childcare','education'],
 'Hospitality & Tourism':['hospitality','hotel','tourism','cooking','baking','events'],
 'IT & Computing':['software','programming','ai','data','cybersecurity','networks'],
 'Environment & Sustainability':['environment','plants','marine','energy'],
 'Law, Security & Public Safety':['law','security','cybersecurity'],
 'Sports & Recreation':['sport','fitness','coaching','outdoors'],
 'Media & Communications':['media','film','journalism','writing','visual'],
 'Skilled Trades & Technical Fields':['mechanical','electrical','electronics','robotics','buildings','process','aviation']
};
const interestSubjectTopics={
 'Biology':['biology','biotechnology','health','nursing','care','medicines','food'],
 'Chemistry':['chemistry','medicines','laboratory','process','food'],
 'Physics':['mechanical','aviation','electrical','electronics','robotics','energy','optics'],
 'History':['research','writing','journalism'],'Geography':['environment','marine','plants','tourism','buildings'],
 'Social Studies':['community','research','writing'],'English':['writing','journalism','media','education','childcare'],
 'Chinese':['writing','education','childcare'],'Malay':['writing','education','childcare'],'Tamil':['writing','education','childcare'],
 'Elementary Math':['data','accounting','finance','electrical','electronics','mechanical','aviation'],
 'Additional Math':['data','ai','programming','mechanical','electronics','electrical','aviation'],
 'Design & Technology':['design','visual','mechanical','electronics','robotics'],
 'Art':['design','visual'],'Food & Consumer Education':['food','cooking','baking'],
 'Computing':['software','programming','ai','cybersecurity','networks','data'],'Literature':['writing','journalism','theatre']
};
function interestCcaTopics(value){
 const text=String(value||'');
 if(/\b(yfc|youth flying|flying club)\b/i.test(text))return ['aviation'];
 if(/sport|badminton|basketball|football|netball|bowling|tchoukball|swim|athlet|martial/i.test(text))return ['sport','fitness','coaching'];
 if(/robot/i.test(text))return ['robotics','electronics','programming'];
 if(/comput|coding|programming/i.test(text))return ['software','programming','ai','data'];
 if(/choir|band|guitar|music/i.test(text))return ['music','audio'];
 if(/drama|dance|perform/i.test(text))return ['theatre','audio'];
 if(/media|ava|photograph|film/i.test(text))return ['media','film','visual','audio'];
 if(/\bart\b|design/i.test(text))return ['design','visual'];
 if(/red cross|st\.? john|community service|volunteer/i.test(text))return ['care','community','health'];
 if(/science club/i.test(text))return ['laboratory','biology','chemistry'];
 return [];
}
function interestCourseMatch(answers,chosen,course){
 const topics=course.topics||[],hit=ids=>ids.some(id=>topics.includes(id));
 const dream=interestTopics(answers.dream),avoided=interestAvoidedCareerTopics(answers.dream),cca=interestCcaTopics(answers.cca);
 const fields=answers.careers.map(label=>({label,topics:interestFieldTopics[label]||[]}));
 const liked=answers.likes.filter(label=>hit(interestSubjectTopics[label]||[]));
 const otherLiked=hit(interestTopics(answers.otherLikes));
 const dreamHit=hit(dream),fieldHits=fields.filter(f=>hit(f.topics)),ccaHit=hit(cca);
 const hasPrimary=dream.length||fields.some(f=>f.topics.length),hasSignals=hasPrimary||cca.length||answers.likes.some(l=>(interestSubjectTopics[l]||[]).length)||interestTopics(answers.otherLikes).length;
 const positiveHit=dreamHit||fieldHits.length||ccaHit||liked.length||otherLiked;
 if(hit(avoided)||hasSignals&&!positiveHit||hasPrimary&&!dreamHit&&!fieldHits.length&&!liked.length&&!otherLiked)return null;
 const disliked=answers.dislikes.filter(label=>hit(interestSubjectTopics[label]||[]));
 const otherDisliked=hit(interestTopics(answers.otherDislikes,false));
 const strengthHits=answers.strengths.filter(label=>(interestStrengthMap[label]||[]).some(area=>course.areas.includes(area)));
 const matchScore=(dreamHit?150:0)+(fieldHits.length?65:0)+(ccaHit?45+(topics.includes(cca[0])?16:0)+Math.min(16,cca.filter(t=>topics.includes(t)).length*5):0)+Math.min(30,liked.length*12)+(otherLiked?35:0)+Math.min(4,strengthHits.length)+(hit(interestTopics(answers.otherStrengths))?2:0)+(chosen.includes(course.areas[0])?3:1)-Math.min(36,disliked.length*12)-(otherDisliked?18:0);
 const matchReasons=[];
 if(dreamHit)matchReasons.push(`This course connects with your career interest: “${interestPositiveText(answers.dream).trim()}”.`);
 if(ccaHit)matchReasons.push(`Your CCA (${answers.cca}) may connect with this course’s ${topics.find(t=>cca.includes(t))==='aviation'?'aviation content':'focus on '+interestTopicLabel(topics.find(t=>cca.includes(t)))}.`);
 if(fieldHits.length)matchReasons.push(`You are interested in ${fieldHits[0].label}.`);
 if(liked.length)matchReasons.push(`Your interest in ${liked.slice(0,2).join(' and ')} connects with this course.`);
 if(otherLiked)matchReasons.push(`It connects with the other subjects you enjoy: ${answers.otherLikes}.`);
 if(!matchReasons.length)matchReasons.push(`You chose to explore ${chosen.map(id=>interestAreaLabel(id)).filter(Boolean).join(' / ')}.`);
 const matchCautions=disliked.length?[`You enjoy ${disliked.join(' and ')} least. Read the modules to check how much of it this course involves.`]:[];
 return {...course,matchScore,dreamMatch:dreamHit,ccaMatch:ccaHit,matchReasons:matchReasons.slice(0,3),matchCautions};
}
function interestTopicLabel(topic){return ({software:'software development',programming:'programming',sport:'sport',fitness:'fitness',coaching:'coaching',aviation:'aviation',audio:'sound and audio',visual:'visual communication',care:'care for others',community:'community work',health:'healthcare'})[topic]||topic||'your interests';}
function interestAreaLabel(id){return ({science:'Applied Science',engineering:'Engineering',business:'Business & Management',computing:'IT & Computing',design:'Design & Media',health:'Health Sciences',arts:'Arts & Performing Arts',hospitality:'Hospitality & Tourism',social:'Social Services & Early Childhood',sports:'Sports & Wellness',environment:'Environment & Sustainability',humanities:'Humanities',data:'Maths & Data Sciences'})[id];}
function interestRecommend(answers,chosen,catalog){
 if(!['G3','G2','G1'].includes(answers.stream)||!chosen.length)return [];
 const allowed=c=>answers.stream==='G3'?c.route==='poly':answers.stream==='G1'?c.route==='ite':['poly','ite'].includes(c.route);
 let pool=catalog.courses.filter(c=>allowed(c)&&c.areas.some(a=>chosen.includes(a))).map(c=>interestCourseMatch(answers,chosen,c)).filter(Boolean);
 // A named career should have a real course-content connection in this catalogue.
 if(interestTopics(answers.dream).length)pool=pool.filter(c=>c.dreamMatch);
 pool.sort((a,b)=>b.matchScore-a.matchScore||(answers.stream==='G2'?(a.route==='ite'?0:1)-(b.route==='ite'?0:1):0)||a.id.localeCompare(b.id));
 const top=pool[0]?.matchScore||0;
 return pool.filter(c=>c.matchScore>=Math.max(1,top*.55)).slice(0,3);
}

function newInterestAnswers(){return {stream:'',cca:'',likes:[],dislikes:[],likesUnsure:false,dislikesUnsure:false,otherLikes:'',otherDislikes:'',strengths:[],otherStrengths:'',strengthsUnsure:false,careers:[],dream:'',careerUnsure:false};}
let interestCatalog,interestStep=0,interestAnswers=newInterestAnswers(),interestChosen=[];
const iq=id=>document.getElementById(id);
function interestEscape(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const interestIconPaths={
 compass:'<circle cx="24" cy="24" r="17"/><path d="m31 17-4 10-10 4 4-10 10-4Z"/><path d="m24 4 1 4M24 40v4M4 24h4M40 24h4"/>',
 school:'<path d="m5 20 19-12 19 12M9 20v20h30V20M18 40V28h12v12M4 40h40"/><path d="M19 18h10M24 4v4"/>',
 tools:'<path d="m29 8 3 9 9 3-8 8-7-2-14 14-6-6 14-14-2-7 8-8 3 3ZM33 33l7 7M35 30l-5 5"/>',
 cca:'<path d="M15 8h18v12c0 8-18 8-18 0V8ZM15 12H7v7c0 5 4 7 9 7M33 12h8v7c0 5-4 7-9 7M24 26v11M15 41h18M19 37h10"/>',
 book:'<path d="M24 13C18 8 11 8 5 10v27c7-2 13-1 19 4 6-5 12-6 19-4V10c-6-2-13-2-19 3ZM24 13v28M11 17l7 2M11 24l7 2M30 19l7-2M30 26l7-2"/>',
 spark:'<path d="m24 5 5 13 14 6-14 5-5 14-5-14-14-5 14-6 5-13ZM38 5v8M34 9h8M9 35v8M5 39h8"/>',
 future:'<path d="m27 7 14 3-3 14-13 11-12-12L27 7ZM27 15h0M12 27l-5 5v9l10-1 5-5M25 35l-1 9 9-8V29M13 23l-9 1 8-9h9"/><circle cx="31" cy="17" r="4"/>',
 science:'<path d="M18 7h12M20 7v15L9 38c-2 3 0 5 3 5h24c3 0 5-2 3-5L28 22V7M15 32h18"/><circle cx="21" cy="27" r="1"/><circle cx="29" cy="36" r="1"/>',
 engineering:'<path d="m20 6 8 0 2 6 6 3 6-1 4 7-4 5v7l-7 4-6-3-6 3-7-4v-7l-4-5 4-7 6 1 6-3Z"/><circle cx="25" cy="24" r="7"/>',
 business:'<rect x="6" y="16" width="36" height="25" rx="4"/><path d="M17 16V9h14v7M6 26c10 6 26 6 36 0M24 25v9"/>',
 computing:'<rect x="7" y="8" width="34" height="25" rx="3"/><path d="M3 41h42M18 33l-3 8M30 33l3 8M19 15l-5 5 5 5M29 15l5 5-5 5"/>',
 design:'<path d="M40 25c0 11-8 18-18 18S5 35 5 25C5 13 14 5 26 5s18 7 18 14c0 5-5 5-9 5-7 0-6 8 0 8 3 0 5-3 5-7Z"/><circle cx="17" cy="17" r="2"/><circle cx="27" cy="12" r="2"/><circle cx="36" cy="16" r="2"/><path d="m13 37 11-10"/>',
 health:'<path d="M24 40S5 28 5 17C5 5 19 4 24 14 29 4 43 5 43 17c0 11-19 23-19 23Z"/><path d="M11 24h8l3-7 5 14 3-7h7"/>',
 arts:'<path d="M20 34V11l20-5v23M20 18l20-5"/><ellipse cx="13" cy="35" rx="7" ry="5"/><ellipse cx="33" cy="30" rx="7" ry="5"/>',
 hospitality:'<path d="M7 35h34M4 41h40M10 31a14 14 0 0 1 28 0M24 13V8M21 8h6M8 19l-3-3M40 19l3-3"/>',
 social:'<circle cx="18" cy="15" r="7"/><circle cx="36" cy="18" r="5"/><path d="M4 40v-6c0-11 28-11 28 0v6M34 28c7 0 10 4 10 8v4"/><path d="m30 7 2-3 3 3"/>',
 sports:'<circle cx="24" cy="24" r="18"/><path d="M6 24h36M24 6v36M12 11c15 8 15 18 0 26M36 11c-15 8-15 18 0 26"/>',
 environment:'<path d="M39 7C17 6 7 17 10 30c3 12 18 13 25 1 4-7 3-14 4-24ZM10 41l21-23M16 34l-1-10M22 28l10 1"/>',
 humanities:'<path d="m5 18 19-12 19 12H5ZM8 41h32M12 22v14M24 22v14M36 22v14M5 36h38"/>',
 data:'<path d="M8 7v34h34M16 33v-9h6v9M27 33V15h6v18M38 33V9h6v24M13 17l10-7 7 1"/>',
 security:'<path d="m24 5 16 6v13c0 10-16 19-16 19S8 34 8 24V11l16-6Z"/><path d="m16 23 6 6 11-13"/>',
 check:'<path d="m12 24 8 8 17-18"/>'
};
function interestIcon(id,extra=''){return `<svg class="interest-icon ${extra}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${interestIconPaths[id]||interestIconPaths.compass}</svg>`;}
function interestTone(id){return ({science:'gold',engineering:'blue',business:'peach',computing:'blue',design:'lilac',health:'rose',arts:'lilac',hospitality:'peach',social:'mint',sports:'gold',environment:'mint',humanities:'peach',data:'blue'})[id]||'mint';}
function interestJourneyHTML(){return ['Level','CCA','Subjects','Strengths','Future','Areas','Courses'].map((name,i)=>`<div class="interest-journey-step ${i===interestStep?'current':i<interestStep?'complete':''}" ${i===interestStep?'aria-current="step"':''}><span>${interestIcon(i<interestStep?'check':['school','cca','book','spark','future','compass','book'][i])}</span><small>${name}</small></div>`).join('');}
function interestCheckbox(name,value,checked=false){const index=interestCareerFields.findIndex(f=>f[0]===value),key=name==='careers'?['science','health','business','design','social','hospitality','computing','environment','security','sports','humanities','tools'][index]:name==='strengths'?'spark':null;return `<label class="interest-choice ${key?'interest-visual-choice':''}" ${key?'data-tone="'+interestTone(key)+'"':''}><input type="checkbox" name="${name}" value="${interestEscape(value)}" ${checked?'checked':''}>${key?`<span class="interest-choice-icon">${interestIcon(key)}</span>`:''}<span>${interestEscape(value)}</span></label>`;}
function interestActions(label='Continue →'){return `<p id="interest-error" role="alert"></p><div class="interest-actions">${interestStep?'<button type="button" class="button outline" data-interest-back>← Back</button>':''}<button type="submit" class="button primary">${label}</button></div>`;}
function interestRender(focus=false){
 const host=iq('interest-workspace'),a=interestAnswers,e=interestEscape;
 const labels=['Your subject level','Your CCA','Your subjects','Your strengths','Your future','Course areas','Your courses'];
 iq('interest-progress').textContent=interestStep<5?`Question ${interestStep+1} of 5 · ${labels[interestStep]}`:interestStep===5?'Choose your course areas':'Your course shortlist';
 iq('interest-progress-bar').value=interestStep+1;
 iq('interest-journey').innerHTML=interestJourneyHTML();
 host.dataset.stage=interestStep;
 iq('interest-restart').hidden=interestStep===0&&!a.stream;
 let body='';
 if(interestStep===0)body=`<span class="tag">LET’S START WITH YOU</span><h2 id="interest-question" tabindex="-1">Which subject level do you mainly take: G3, G2 or G1?</h2><div class="interest-streams">${[['G3','Polytechnic courses'],['G2','Polytechnic and ITE courses'],['G1','ITE courses']].map(row=>`<label class="interest-stream"><input type="radio" name="stream" value="${row[0]}" ${a.stream===row[0]?'checked':''}><span class="interest-stream-icon" aria-hidden="true">${interestIcon(row[0]==='G1'?'tools':row[0]==='G2'?'compass':'school')}</span><span><strong>${row.length===2?row[0]:row[1]}</strong><small>${row.at(-1)}</small></span></label>`).join('')}</div>${interestActions()}`;
 if(interestStep===1)body=`<span class="tag">YOUR EXPERIENCES</span><h2 id="interest-question" tabindex="-1">What is your CCA?</h2><p>Use its name or abbreviation. If you do not have one, type “No CCA yet”.</p><label class="field" for="interest-cca">Your CCA</label><input id="interest-cca" name="cca" type="text" maxlength="150" value="${e(a.cca)}" placeholder="e.g. Badminton, Choir, NPCC or YFC" list="interest-cca-options"><datalist id="interest-cca-options">${['Badminton','Basketball','Football','Tchoukball','Bowling','Netball','Concert Band','Choir','English Drama','Guitar Ensemble','Show Choir','NPCC','NCC','NCDCC','Girls’ Brigade','Boys’ Brigade','AVA','Robotics','Media','YFC (Youth Flying Club)'].map(x=>`<option value="${e(x)}"></option>`).join('')}</datalist>${interestActions()}`;
 if(interestStep===2)body=`<span class="tag">LIKES AND DISLIKES</span><h2 id="interest-question" tabindex="-1">Which subjects do you enjoy the most? And which do you enjoy the least?</h2><p>Choose as many as you like in each group.</p><div class="interest-subject-columns">${[['likes','Enjoy most',a.likes,a.otherLikes,a.likesUnsure],['dislikes','Enjoy least',a.dislikes,a.otherDislikes,a.dislikesUnsure]].map(([name,title,selected,other,unsure])=>`<fieldset class="interest-subject-list"><legend>${title}</legend>${Object.entries(interestSubjectGroups).map(([group,subjects])=>`<h3 class="interest-group-heading">${interestIcon(({Science:'science',Humanities:'humanities',Languages:'social',Maths:'data','Applied subjects':'tools',Others:'book'})[group])}${group}</h3><div class="interest-choices">${subjects.map(s=>interestCheckbox(name,s,selected.includes(s))).join('')}</div>`).join('')}<label class="field">Other subjects<input name="other${name}" type="text" maxlength="200" value="${e(other)}" placeholder="Optional"></label>${interestCheckbox(name+'Unsure',name==='likes'?'No clear favourite yet':'None, or not sure yet',unsure)}</fieldset>`).join('')}</div>${interestActions()}`;
 if(interestStep===3){const hints=interestCcaHints(a.cca);body=`<span class="tag">WHAT YOU BRING</span><h2 id="interest-question" tabindex="-1">What are some strengths you feel you have? These can be academic or non-academic.</h2><p>Choose as many as you want. Add your own too.</p><div class="interest-hint"><strong>Thinking about your CCA</strong><p>${e(hints.note)}</p>${hints.skills.length?`<p>Possible strengths: ${e(hints.skills.join(', '))}. Choose them below only if they fit you.</p>`:''}</div><div class="interest-choices interest-strength-grid">${interestStrengths.map(s=>interestCheckbox('strengths',s,a.strengths.includes(s))).join('')}</div><p class="helper">Leadership can include Student Council, Class Leaders, PSLs or CCA leaders. Communication can include presentations or helping others.</p><label class="field">Other strengths<textarea name="otherStrengths" rows="2" maxlength="600" placeholder="Add as many as you like.">${e(a.otherStrengths)}</textarea></label>${interestCheckbox('strengthsUnsure','I am still discovering my strengths',a.strengthsUnsure)}${interestActions()}`;}
 if(interestStep===4)body=`<span class="tag">POSSIBILITIES AHEAD</span><h2 id="interest-question" tabindex="-1">Do you have any dream careers or fields in mind?</h2><p>Choose any that interest you. It is okay to be unsure.</p><div class="interest-choices interest-career-grid">${interestCareerFields.map(([name])=>interestCheckbox('careers',name,a.careers.includes(name))).join('')}</div><label class="field">A dream job or another field<textarea name="dream" rows="2" maxlength="500" placeholder="e.g. pilot, nurse, game developer or preschool teacher">${e(a.dream)}</textarea></label>${interestCheckbox('careerUnsure','I am not sure yet',a.careerUnsure)}${interestActions('Explore course areas →')}`;
 if(interestStep===5){const ranked=interestRankAreas(a,interestCatalog),suggested=interestSuggestedAreaIds(a,interestCatalog);body=`<span class="tag">FOLLOW YOUR CURIOSITY</span><h2 id="interest-question" tabindex="-1">Which course areas would you like to explore?</h2><p>${suggested.length?'These starting points come from your answers. You can change them.':'There is no single match yet. Choose the areas you are curious about.'} Select one to three.</p><details class="interest-profile"><summary>Your answers</summary>${interestProfileHTML()}</details><div class="interest-area-grid">${ranked.map(area=>`<label class="interest-area" data-tone="${interestTone(area.id)}"><input type="checkbox" name="areas" value="${area.id}" ${interestChosen.includes(area.id)?'checked':''}><span><span class="interest-area-visual">${interestIcon(area.id)}<span class="interest-area-arrow" aria-hidden="true">↗</span></span>${suggested.includes(area.id)?'<small class="interest-suggested">Suggested starting point</small>':''}<strong>${e(area.name)}</strong><span>${e(area.description)}</span>${area.score>0&&area.reasons.length?`<small>${e(area.reasons.slice(0,2).join(' '))}</small>`:''}</span></label>`).join('')}</div>${interestActions('Find my course matches →')}`;}
 if(interestStep===6)body=interestResultsHTML();
 const spot=`<div class="interest-question-art" aria-hidden="true">${interestIcon(['compass','cca','book','spark','future','compass','book'][interestStep])}<span>✦</span></div>`;
 if(interestStep<6)body=spot+body;
 host.innerHTML=interestStep===6?body:`<form id="interest-form" novalidate>${body}</form>`;
 const form=iq('interest-form');if(form)form.onsubmit=interestSubmit;
 host.querySelectorAll('[data-interest-back]').forEach(b=>b.onclick=()=>{if(form)interestRead(form);interestStep--;interestRender(true);});
 host.querySelectorAll('[data-interest-edit]').forEach(b=>b.onclick=()=>{interestStep=Number(b.dataset.interestEdit);interestRender(true);});
 // Keep likes and dislikes mutually exclusive, and clear “unsure” when an answer is picked.
 if(form)form.addEventListener('change',ev=>{const t=ev.target;if(t.type==='checkbox'&&['likes','dislikes'].includes(t.name)&&t.checked){form.querySelectorAll(`input[name="${t.name==='likes'?'dislikes':'likes'}"]`).forEach(x=>{if(x.value===t.value)x.checked=false;});const unsure=form.elements[t.name+'Unsure'];if(unsure)unsure.checked=false;}if(t.type==='checkbox'&&['strengths','careers'].includes(t.name)&&t.checked){const u=form.elements[t.name==='careers'?'careerUnsure':'strengthsUnsure'];if(u)u.checked=false;}if(t.checked&&['likesUnsure','dislikesUnsure','strengthsUnsure','careerUnsure'].includes(t.name)){const target={likesUnsure:'likes',dislikesUnsure:'dislikes',strengthsUnsure:'strengths',careerUnsure:'careers'}[t.name];form.querySelectorAll(`input[name="${target}"]`).forEach(x=>x.checked=false);}});
 if(focus){iq('interest-question')?.focus({preventScroll:true});iq('interest-progress').scrollIntoView({behavior:'smooth',block:'start'});}
}
function interestProfileHTML(){const a=interestAnswers,e=interestEscape;return `<dl><dt>Main subject level</dt><dd>${e(a.stream)}</dd><dt>CCA</dt><dd>${e(a.cca)}</dd><dt>Enjoy most</dt><dd>${e([...a.likes,a.otherLikes].filter(Boolean).join(', ')||'Still exploring')}</dd><dt>Enjoy least</dt><dd>${e([...a.dislikes,a.otherDislikes].filter(Boolean).join(', ')||'None or unsure')}</dd><dt>Strengths</dt><dd>${e([...a.strengths,a.otherStrengths].filter(Boolean).join(', ')||'Still exploring')}</dd><dt>Careers or fields</dt><dd>${e([...a.careers,a.dream].filter(Boolean).join(', ')||'Still exploring')}</dd></dl>`;}
function interestRead(form){const f=new FormData(form),a=interestAnswers,all=name=>f.getAll(name).map(String),val=name=>String(f.get(name)||'').trim();if(interestStep===0)a.stream=val('stream');if(interestStep===1)a.cca=val('cca');if(interestStep===2){a.likes=all('likes');a.dislikes=all('dislikes');a.otherLikes=val('otherlikes');a.otherDislikes=val('otherdislikes');a.likesUnsure=f.has('likesUnsure');a.dislikesUnsure=f.has('dislikesUnsure');}if(interestStep===3){a.strengths=all('strengths');a.otherStrengths=val('otherStrengths');a.strengthsUnsure=f.has('strengthsUnsure');}if(interestStep===4){a.careers=all('careers');a.dream=val('dream');a.careerUnsure=f.has('careerUnsure');}if(interestStep===5)interestChosen=all('areas');}
function interestSubmit(ev){ev.preventDefault();interestRead(ev.currentTarget);const a=interestAnswers;let error='';if(interestStep===0&&!['G3','G2','G1'].includes(a.stream))error='Choose your main subject level to begin.';if(interestStep===1&&!a.cca)error='Enter your CCA, or type “No CCA yet”.';if(interestStep===2){if(!a.likes.length&&!a.otherLikes&&!a.likesUnsure)error='Choose a subject you enjoy, or select “No clear favourite yet”.';else if(!a.dislikes.length&&!a.otherDislikes&&!a.dislikesUnsure)error='Choose a subject you enjoy least, or select “None, or not sure yet”.';}if(interestStep===3&&!a.strengths.length&&!a.otherStrengths&&!a.strengthsUnsure)error='Choose or add a strength, or tell us you are still discovering them.';if(interestStep===4&&!a.careers.length&&!a.dream&&!a.careerUnsure)error='Choose a field, add a dream job, or select “I am not sure yet”.';if(interestStep===5&&(interestChosen.length<1||interestChosen.length>3))error='Choose one, two or three course areas.';if(error){iq('interest-error').textContent=error;return;}if(interestStep===4)interestChosen=interestSuggestedAreaIds(a,interestCatalog);interestStep++;interestRender(true);}
function interestResultsHTML(){
 const a=interestAnswers,e=interestEscape,courses=interestRecommend(a,interestChosen,interestCatalog),areaName=id=>interestCatalog.areas.find(x=>x.id===id)?.name||id;
 const route=a.stream==='G3'?'Polytechnic courses only':a.stream==='G1'?'ITE courses only':'Polytechnic and ITE courses';
 return `<div class="interest-results-heading"><span class="tag">${e(a.stream)} · ${e(route)}</span><h2 id="interest-question" tabindex="-1">${courses.length===3?'Three courses to explore.':courses.length===2?'Two courses to explore.':courses.length===1?'One course to explore.':'Let’s keep exploring.'}</h2><p>Based on your interests in ${e(interestChosen.map(areaName).join(', '))}.</p><p>These are interest matches. Your grades and each course’s entry requirements still matter.</p><details class="interest-profile"><summary>Your answers</summary>${interestProfileHTML()}<button type="button" class="text-btn" data-interest-edit="0">Edit my answers</button></details>${a.stream==='G2'?'<p class="interest-hint">Polytechnic admission may be through PFP or a qualifying O-Level route. Check the route and grade requirements.</p>':''}${a.stream!=='G3'?'<p class="helper">School-leaver Nitec routes have moved to three-year Higher Nitec. The ITE suggestions below use the current course names.</p>':''}${interestChosen.includes('humanities')&&a.stream!=='G3'?'<p class="helper">ITE choices linked to Humanities use people or communication skills. They are related practical courses.</p>':''}</div>${courses.length<3?`<div class="interest-shortlist-note" role="status"><strong>${courses.length?`We found ${courses.length} close ${courses.length===1?'match':'matches'} in this selection.`:'There is no close match in this selection yet.'}</strong><p>${courses.length?'Use CourseFinder to explore more courses in your fields of interest.':'Try another course area or explore the full MOE CourseFinder. Your CCA does not limit what you can study.'}</p></div>`:''}<div class="interest-course-grid">${courses.map((c,i)=>`<article class="interest-course" data-tone="${interestTone(c.areas[0])}"><div class="interest-course-art" aria-hidden="true">${interestIcon(c.areas[0])}<span class="interest-course-orbit"></span><span class="interest-course-spark">✦</span></div><div class="interest-course-top"><span class="interest-number">0${i+1}</span><span class="tag">${c.route==='poly'?'POLYTECHNIC DIPLOMA':'HIGHER NITEC'}</span></div><h3>${e(c.title)}</h3><p class="interest-institution">${e(c.institution)} · ${e(c.id)}</p><p class="interest-match">Explore ${e(c.areas.filter(id=>interestChosen.includes(id)).map(areaName).join(' / '))}.</p><div class="interest-personal-match"><h4>Why this fits you</h4><ul>${c.matchReasons.map(reason=>`<li>${e(reason)}</li>`).join('')}</ul>${c.matchCautions.length?`<p class="interest-match-caution">${c.matchCautions.map(e).join(' ')}</p>`:''}</div><h4>What it is about</h4><p>${e(c.about)}</p><h4>Skills you will learn</h4><p>${e(c.skills)}</p><h4>Where it could lead</h4><p>${e(c.jobs)}</p><p>${e(c.progression)}</p>${interestScoreHTML(c)}<a class="button outline" href="${e(c.url)}" target="_blank" rel="noopener noreferrer">View course on MOE CourseFinder ↗</a></article>`).join('')}</div><div class="interest-next"><div class="interest-next-icon" aria-hidden="true">${interestIcon('future')}</div><h3>Keep exploring.</h3><p>This is a starting selection from polytechnics and ITE. Compare more institutions and courses on CourseFinder.</p><p>Past scores are a guide. They do not guarantee a place. Poly JAE scores use O-Level results; PFP uses a different aggregate.</p><a class="button primary" href="https://www.moe.gov.sg/coursefinder" target="_blank" rel="noopener noreferrer">Explore MOE CourseFinder ↗</a><p class="helper">If a course link has moved, search its name or code in CourseFinder.</p></div><div class="interest-actions"><button type="button" class="button outline" data-interest-back>← Change course areas</button><button type="button" class="text-btn" data-interest-edit="0">Edit my answers</button></div><details class="interest-sources"><summary>About these suggestions and scores</summary><p>Courses are ranked by their content and your career interests, CCA and favourite subjects. Subjects you enjoy least lower a match. Your strengths support the match. We show up to three close matches and explain each link.</p><p>The starter catalogue has ${interestCatalog.courses.length} courses. Checked ${e(interestCatalog.checked)}. Each score shows its year, aggregate and source.</p><p>Some CourseFinder pages could not be retrieved for this update. Those scores use the institution’s official admission publication, labelled on the card. Scores are a saved reference and do not update live.</p><p>Check minimum subject grades, interviews, aptitude tests and other course requirements on the official page before applying.</p></details>`;
}
function interestScoreHTML(c){const s=c.score,e=interestEscape;if(!s)return '<div class="interest-score"><h4>Aggregate score</h4><p>Not verified. Check the course page.</p></div>';if(s.kind==='unavailable')return `<div class="interest-score"><h4>Aggregate score</h4><p>${e(s.note)}</p><a href="${e(s.sourceUrl)}" target="_blank" rel="noopener noreferrer">Check the official ITE course page ↗</a></div>`;return `<div class="interest-score"><h4>${s.year} ${e(s.exercise)} ${s.kind==='range'?'net aggregate range':'last posted score'}</h4><p class="helper">${e(s.aggregate)}${s.kind==='cutoff'?' · ITE aggregate points, best 4 subjects':''}</p><dl>${Object.entries(s.values).map(([college,value])=>`<div><dt>${e(college)}</dt><dd>${e(value)}</dd></div>`).join('')}</dl><a href="${e(s.sourceUrl)}" target="_blank" rel="noopener noreferrer">Source: ${e(s.sourceLabel)} ↗</a></div>`;}
async function initInterests(){const host=iq('interest-workspace');if(!host)return;try{interestCatalog=window.INTEREST_BOOTSTRAP||await fetch('interests-data.json').then(r=>{if(!r.ok)throw Error('Course information unavailable');return r.json();});interestRender();iq('interest-restart').onclick=()=>{interestStep=0;interestAnswers=newInterestAnswers();interestChosen=[];interestRender(true);};}catch{host.innerHTML='<p>We could not load the interests guide. Please refresh to try again.</p><a class="button outline" href="https://www.moe.gov.sg/coursefinder" target="_blank" rel="noopener noreferrer">Explore MOE CourseFinder ↗</a>';}}

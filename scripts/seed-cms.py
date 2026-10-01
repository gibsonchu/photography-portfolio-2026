import json,re,html
x=json.load(open('src/data.json'))
def text(s):return html.unescape(re.sub('<[^>]+>','',s)).strip()
index=x['pages']['index']['html'];links=re.findall(r'<a href="/([^"]+)"><img[^>]+src="/assets/([^.]+)\.[^"]+"[^>]*></a>.*?<figcaption[^>]*>(.*?)</figcaption>',index)
collections=[]
for slug,cover,caption in links:
 p=x['pages'][slug];title=re.sub(r'^\d+\s*','',text(caption)).strip();dates=re.findall(r'<span class="caption">([^<]+)</span>',p['html']);collections.append(dict(id=slug,slug=slug,title=title,description='',dates=dates[-1].strip() if dates else '',photoIds=p['photos'],coverId=cover,published=True))
s=x['pages']['information']['html'];units=re.findall(r'<column-unit[^>]*>(.*?)</column-unit>',s,re.S)
bio=re.sub(r'<br\s*/?>','\n',units[2]);bio=text(bio);bio=re.sub(r'\n\s*\n+', '\n\n',bio)
seed={'version':1,'photos':{k:{**v,'alt':v['name'].rsplit('.',1)[0]} for k,v in x['media'].items()},'collections':collections,'home':x['pages']['homepage']['photos'],'info':{'bio':bio,'location':'Brooklyn, NY','website':'https://gibsonchu.com/','email':'gibsontchu@gmail.com','instagram':'https://www.instagram.com/gibsontchu','publications':[{'publisher':'New Ontologies','publisherUrl':'https://www.new-ontologies.com/','title':'Crosby: The Inner Workings of a Neofirm','url':'https://www.new-ontologies.com/posts/Crosby'},{'publisher':'Liner Notes','publisherUrl':'https://launchlinernotes.substack.com/','title':'Afterimage: The Launch Video is Dead','url':'https://launchlinernotes.substack.com/p/the-launch-video-is-dead-with-afterimage'}]}}
open('src/cms-seed.json','w').write(json.dumps(seed,indent=2));print(len(collections),'collections seeded')

"""Create compact, game-specific indexes plus description shards for static hosting."""
import json,pathlib,sys
ROOT=pathlib.Path(__file__).resolve().parent.parent
OUT=ROOT/'public'/'catalog-data'
for game in sys.argv[1:] or ['cs2','rust','tf2']:
    raw=json.loads((ROOT/'output'/f'reference-{game}.json').read_text())
    rows=[];shards={}
    for p in raw['items']:
        if p['game']!=game:raise ValueError('Mixed games')
        img=p.get('imageUrl') or ''
        # Steam economy endpoint renders the full item inside the requested canvas.
        if '/economy/image/' in img:img=img.rstrip('/')+'/1024fx768f'
        rows.append([p['id'],p['name'],p['category']['id'],img,int(p['quote']['amountMinor']),p.get('weapon') or '',(p.get('rarity') or {}).get('name',''),p.get('marketHashName') or p['name']])
        shards.setdefault(p['id'][:2],{})[p['id']]=p.get('description') or ''
    assert len({r[0] for r in rows})==len(rows)
    assert len(rows)==raw['totalCount'], f'{game}: incomplete snapshot'
    result={'game':game,'capturedAt':raw['capturedAt'],'categories':raw['categories'],'totalCount':raw['totalCount'],'sourceReportedCount':raw.get('sourceReportedCount',raw['totalCount']),'rows':rows}
    OUT.mkdir(parents=True,exist_ok=True)
    (OUT/f'{game}.json').write_text(json.dumps(result,ensure_ascii=False,separators=(',',':')))
    folder=OUT/'details'/game;folder.mkdir(parents=True,exist_ok=True)
    for shard,descriptions in shards.items():(folder/f'{shard}.json').write_text(json.dumps(descriptions,ensure_ascii=False,separators=(',',':')))
    print(game,len(rows),'items;',len(raw['categories']),'categories;',round((OUT/f'{game}.json').stat().st_size/1024/1024,2),'MiB index')

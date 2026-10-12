"""Read-only snapshot of the user-selected public catalog; never calls checkout/auth."""
import json, time, urllib.request, urllib.parse, pathlib, concurrent.futures, datetime
ROOT=pathlib.Path(__file__).resolve().parent.parent
OUT=ROOT/'public'/'catalog-data'
OUT.mkdir(parents=True,exist_ok=True)
BASE='https://shop-skin.com/api/v1/catalog'
def request(params):
    for attempt in range(6):
        try:
            req=urllib.request.Request(BASE+'?'+urllib.parse.urlencode(params),headers={'User-Agent':'Chips catalog preview import','Accept':'application/json'})
            with urllib.request.urlopen(req,timeout=45) as r: return json.load(r)
        except Exception:
            if attempt==5: raise
            time.sleep(2**attempt)
def capture(game):
    items={}; cursor=None; seen_cursors=set(); categories=[]; captured=datetime.datetime.now(datetime.timezone.utc).isoformat()
    while True:
        params={'game':game,'limit':48,'sort':'price_asc'}
        if cursor:params['cursor']=cursor
        data=request(params)
        categories=data['facets']['categories']
        for p in data['items']:items[p['id']]=p
        cursor=data['page']['nextCursor']
        if cursor and cursor in seen_cursors:raise RuntimeError('Catalog cursor repeated')
        if cursor:seen_cursors.add(cursor)
        if len(items)%480==0 or not cursor:print(game,len(items),'of',data['page']['totalCount'],flush=True)
        if not cursor:break
        time.sleep(.08)
    raw={'game':game,'capturedAt':captured,'categories':categories,'items':list(items.values()),'totalCount':data['page']['totalCount']}
    (ROOT/'output'/f'reference-{game}.json').write_text(json.dumps(raw,ensure_ascii=False))
    print('DONE',game,len(items),flush=True)
    return game,len(items)
if __name__=='__main__':
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        print(list(pool.map(capture,['cs2','rust','tf2'])))

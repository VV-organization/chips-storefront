"""Import CS2 in independent public category pages; bounded concurrency and backoff."""
import importlib.util,concurrent.futures,json,datetime,time
spec=importlib.util.spec_from_file_location('source',__file__.replace('import-cs2-categories.py','import-reference-catalog.py'))
source=importlib.util.module_from_spec(spec);spec.loader.exec_module(source)
first=source.request({'game':'cs2','limit':48,'sort':'price_asc'})
categories=first['facets']['categories']
def capture(job):
    category,sort=job;items={};cursor=None;seen_cursors=set()
    while True:
        params={'game':'cs2','category':category['id'],'sort':sort,'limit':48}
        if cursor:params['cursor']=cursor
        data=source.request(params)
        for p in data['items']:items[p['id']]=p
        cursor=data['page']['nextCursor']
        if cursor and cursor in seen_cursors:raise RuntimeError('Catalog cursor repeated')
        if cursor:seen_cursors.add(cursor)
        # Opposite directions cover both halves, with one page of overlap.
        if not cursor or len(items)>=data['page']['totalCount']/2+48:break
        time.sleep(.12)
    print(category['name'],sort,len(items),flush=True)
    return items
all_items={}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    for items in pool.map(capture,[(c,s) for c in categories for s in ['price_asc','price_desc']]):all_items.update(items)
raw={'game':'cs2','capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'categories':categories,'items':list(all_items.values()),'totalCount':len(all_items),'sourceReportedCount':first['page']['totalCount']}
(source.ROOT/'output'/'reference-cs2.json').write_text(json.dumps(raw,ensure_ascii=False))
print('DONE cs2',len(all_items),'expected',first['page']['totalCount'],flush=True)
if len(all_items)!=first['page']['totalCount']:print('Live inventory changed during capture; verify category coverage before use.',flush=True)

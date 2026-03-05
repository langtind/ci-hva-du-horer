"""Build js/tekster-data.js from research JSON + extracted arrays"""
import json

with open('/Users/arild/temp/statped/data/tekster-research.json') as f:
    research = json.load(f)

with open('/Users/arild/temp/statped/data/all_tekster_arrays.json') as f:
    arrays = json.load(f)

def get_data(item_id):
    """Get sentences and timecodes for an item"""
    if item_id in arrays and arrays[item_id]['sentences']:
        return arrays[item_id]['sentences'], arrays[item_id]['timecodes']
    return [], []

def build_subtitle(item):
    parts = []
    if item.get('subtype'):
        parts.append(item['subtype'])
    elif item.get('type') == 'vits':
        parts.append('Vits')
    elif item.get('type') == 'saktekst':
        parts.append('Saktekst')
    elif item.get('type') == 'dialog':
        parts.append('Dialog')
    elif item.get('type') == 'dikt':
        parts.append('Dikt')
    
    if item.get('region') and item['region'] not in ('Oslo', 'bare lyd'):
        parts.append(item['region'])
    
    lang = item.get('language', '')
    if lang == 'nynorsk':
        parts.append('Nynorsk')
    elif lang == 'dialekt':
        parts.append('Dialekt')
    
    return ' · '.join(parts) if parts else ''

def process_items(items):
    result = []
    for item in items:
        sents, tcs = get_data(item['id'])
        if not sents:
            # Try from research data
            sents = item.get('sentences', [])
            tcs = item.get('timecodes', [])
        if not sents:
            print(f"WARNING: No sentences for {item['id']}")
            continue
        result.append({
            'id': item['id'],
            'title': item['title'],
            'subtitle': build_subtitle(item),
            'videoUrl': item['videoUrl'],
            'sentences': sents,
            'timecodes': tcs,
        })
    return result

output = []
for cat in research['tekster']['categories']:
    speaker_data = {
        'speaker': cat['label'],
        'groups': []
    }
    
    for subcat in cat['subcategories']:
        if 'items' in subcat:
            # Direct items (fortellinger, dialoger, dikt)
            items = process_items(subcat['items'])
            if items:
                speaker_data['groups'].append({
                    'label': subcat['label'],
                    'items': items
                })
        if 'regions' in subcat:
            # Regional groups (vitser, saktekster)
            for region in subcat['regions']:
                items = process_items(region['items'])
                if items:
                    label = f"{subcat['label']} — {region['region']}"
                    speaker_data['groups'].append({
                        'label': label,
                        'items': items
                    })
    
    if speaker_data['groups']:
        output.append(speaker_data)

# Write JS file
with open('/Users/arild/temp/statped/js/tekster-data.js', 'w') as f:
    f.write('/* Tekster module data - auto-generated */\n')
    f.write('const TEKSTER_DATA = ')
    json.dump(output, f, ensure_ascii=False, indent=2)
    f.write(';\n')

total_items = sum(len(g['items']) for s in output for g in s['groups'])
print(f"Generated tekster-data.js with {len(output)} speakers, {total_items} items")

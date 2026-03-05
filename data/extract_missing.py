"""Extract missing sentence/timecode arrays from tekster_raw.js"""
import re, json

with open('/Users/arild/temp/statped/data/tekster_raw.js', 'r') as f:
    raw = f.read()

# Find all _setningsArray and _tidskodeArray definitions
sent_pattern = r'(\w+)_setningsArray\s*=\s*\[(.*?)\];'
time_pattern = r'(\w+)_tidskodeArray\s*=\s*\[(.*?)\];'

sentences = {}
for m in re.finditer(sent_pattern, raw, re.DOTALL):
    name = m.group(1)
    # Parse the array content - split by comma but respect quotes
    content = m.group(2).strip()
    if content:
        items = re.findall(r'"((?:[^"\\]|\\.)*)"', content)
        sentences[name] = items

timecodes = {}
for m in re.finditer(time_pattern, raw, re.DOTALL):
    name = m.group(1)
    content = m.group(2).strip()
    if content:
        pairs = re.findall(r'\[([^\]]+)\]', content)
        tc = []
        for p in pairs:
            nums = [float(x.strip()) for x in p.split(',') if x.strip()]
            if len(nums) == 2:
                tc.append(nums)
        timecodes[name] = tc

# Print summary
for name in sorted(sentences.keys()):
    sc = len(sentences.get(name, []))
    tc = len(timecodes.get(name, []))
    print(f"{name}: {sc} sentences, {tc} timecodes")

# Save as JSON
output = {}
for name in sentences:
    output[name] = {
        'sentences': sentences[name],
        'timecodes': timecodes.get(name, [])
    }

with open('/Users/arild/temp/statped/data/all_tekster_arrays.json', 'w') as f:
    json.dump(output, f, ensure_ascii=False)

print(f"\nTotal: {len(output)} text items saved to all_tekster_arrays.json")

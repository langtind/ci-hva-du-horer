"""Extract ALL sentence/timecode arrays from tekster_raw.js using single-quote parsing"""
import re, json

with open('/Users/arild/temp/statped/data/tekster_raw.js', 'r') as f:
    raw = f.read()

# Single-quoted strings
sent_pattern = r"(\w+)_setningsArray\s*=\s*\[(.*?)\];"
time_pattern = r"(\w+)_tidskodeArray\s*=\s*\[(.*?)\];"

sentences = {}
for m in re.finditer(sent_pattern, raw, re.DOTALL):
    name = m.group(1)
    content = m.group(2).strip()
    if content:
        # Match both single and double quoted strings
        items = re.findall(r"'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\"", content)
        sentences[name] = [a or b for a, b in items]

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

output = {}
for name in set(list(sentences.keys()) + list(timecodes.keys())):
    output[name] = {
        'sentences': sentences.get(name, []),
        'timecodes': timecodes.get(name, [])
    }

# Summary
complete = sum(1 for v in output.values() if v['sentences'] and v['timecodes'])
print(f"Total: {len(output)} items, {complete} complete (have both sentences+timecodes)")
for name in sorted(output.keys()):
    s = len(output[name]['sentences'])
    t = len(output[name]['timecodes'])
    status = "OK" if s > 0 and t > 0 else "MISSING SENTENCES" if s == 0 else "MISSING TIMECODES"
    print(f"  {name}: {s}s/{t}t {status}")

with open('/Users/arild/temp/statped/data/all_tekster_arrays.json', 'w') as f:
    json.dump(output, f, ensure_ascii=False, indent=None)
print(f"\nSaved to all_tekster_arrays.json")

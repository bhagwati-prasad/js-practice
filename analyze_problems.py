#!/usr/bin/env python3
import re
import os
from collections import defaultdict

# Dynamically read all JS files from the problems directory
problems_dir = 'js/problems'
problem_files = []

if os.path.exists(problems_dir):
    for filename in sorted(os.listdir(problems_dir)):
        if filename.endswith('.js') and filename != 'index.js':
            problem_files.append(os.path.join(problems_dir, filename))

# Extract problem IDs from JS files
js_problems = {}
for file_path in problem_files:
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Match problem IDs like 'problem-id': {
            matches = re.findall(r"'([^']+)':\s*{", content)
            for problem_id in matches:
                if problem_id not in js_problems:
                    js_problems[problem_id] = file_path

# Extract problem IDs from HTML
html_problems = set()
if os.path.exists('index.html'):
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
        # Match data-problem="problem-id"
        matches = re.findall(r'data-problem="([^"]+)"', content)
        html_problems = set(matches)

print(f"Total problems in JS files: {len(js_problems)}")
print(f"Total problems in HTML sidebar: {len(html_problems)}")

# Find missing problems
missing = {}
for problem_id, file_path in js_problems.items():
    if problem_id not in html_problems:
        file_name = os.path.basename(file_path)
        if file_name not in missing:
            missing[file_name] = []
        missing[file_name].append(problem_id)

print(f"\n## Missing Problems Report\n")
print(f"**Total Missing: {sum(len(v) for v in missing.values())} problems**\n")

for file_name in sorted(missing.keys()):
    print(f"### From {file_name}:")
    for problem_id in sorted(missing[file_name]):
        print(f"- {problem_id}")
    print()

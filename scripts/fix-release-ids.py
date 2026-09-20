from pathlib import Path

p = Path(r'C:\AI\fastcast-work\site\scripts\build-site.py')
code = p.read_text('utf-8')
old = '<section class="wrap release-entry"><div class="release-date"><span class="'
new = '<section class="wrap release-entry" id="{item[' | "' + 'tag']}"><div class="release-date"><span class="'
# Actually easier: just add IDs in the history_html function output
code = code.replace(
    'blocks.append(',
    'blocks.append('
)
# Let me do a simpler approach: just make sure history entries get IDs
old2 = "<section class=\"wrap release-entry\"><div class=\"release-date\"><span class=\"{tag_class}\">{tag_label}</span>"
new2 = "<section class=\"wrap release-entry\" id=\"{item['\" + \"tag\"]}\"><div class=\"release-date\"><span class=\"{tag_class}\">{tag_label}</span>"
code = code.replace(old2, new2)
p.write_text(code, 'utf-8')
print('Fixed release entry IDs')

import pathlib
p = pathlib.Path(r'C:\AI\fastcast-work\site\src\pages\data-and-privacy.html')
t = p.read_text(encoding='utf-8')
# U+2019 is the right single quotation mark used in this file
t = t.replace("{{PRODUCT}}\u2019s media path", "Cast's media path")
t = t.replace("{{PRODUCT}}\u2019s screen-sharing session", "Cast's screen-sharing session")
t = t.replace("{{PRODUCT}} relay", "Pyrenet relay")
t = t.replace("{{PRODUCT}}\u2019s own STUN", "Pyrenet's own STUN")
t = t.replace("{{PRODUCT}}\u2019s coordination service", "Pyrenet's coordination service")
p.write_text(t, encoding='utf-8')
print('done')
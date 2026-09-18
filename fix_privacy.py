import pathlib
p = pathlib.Path(r'C:\AI\fastcast-work\site\src\pages\privacy.html')
t = p.read_text(encoding='utf-8')
t = t.replace("{{PRODUCT}} website", "Pyrenet website")
t = t.replace("{{PRODUCT}}'s own STUN service", "Pyrenet's own STUN service")
t = t.replace("{{PRODUCT}} relay", "Pyrenet relay")
p.write_text(t, encoding='utf-8')
print('done')
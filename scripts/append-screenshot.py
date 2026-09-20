from pathlib import Path

out = Path(r'C:\AI\fastcast-work\site\scripts\build-site.py')
code = '''
def screenshot(name, eager=False, explain_link=False):
    meta = release['screenshots'][name]
    loading = 'fetchpriority="high"' if eager else 'loading="lazy"'
    caption = fill(meta['caption'])
    extra = f' <a href="product.html#screenshots">About these screenshots</a>.' if explain_link else ''
    return f'''<figure class="screenshot">
  <a class="image-open" href="assets/{name}.png" data-lightbox aria-label="Enlarge {escape(meta['label'])}">
    <img src="assets/{name}.png" width="{meta['width']}" height="{meta['height']}" alt="{escape(meta['alt'])}" {loading}>
    <span class="image-action" aria-hidden="true">View full size &#8599;</span>
  </a>
  <figcaption>{escape(caption)}{extra}</figcaption>
</figure>'''
'''
with out.open('a', encoding='utf-8') as f:
    f.write(code)
print('Appended screenshot')

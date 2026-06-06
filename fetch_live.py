import urllib.request
url = "https://zestcommerce841428-png.github.io/globaltoolshub/legacy/online-tools/aes/decrypt/index.html"
req = urllib.request.urlopen(url)
html = req.read().decode('utf-8')
with open('live.html', 'w', encoding='utf-8') as f:
    f.write(html)

import urllib.request
url = "https://zestcommerce841428-png.github.io/globaltoolshub/legacy/online-tools/css/style.css"
req = urllib.request.urlopen(url)
print(req.info())

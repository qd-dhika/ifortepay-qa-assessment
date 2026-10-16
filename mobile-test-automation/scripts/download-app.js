// Download the WebdriverIO native demo app APK (not committed, > 100 MB)
const fs = require('fs');
const path = require('path');
const https = require('https');

const VERSION = 'v2.2.0';
const FILE = `android.wdio.native.app.${VERSION}.apk`;
const URL = `https://github.com/webdriverio/native-demo-app/releases/download/${VERSION}/${FILE}`;
const target = path.join(__dirname, '..', 'apps', FILE);

if (fs.existsSync(target)) {
  console.log(`Already downloaded: apps/${FILE}`);
  process.exit(0);
}
fs.mkdirSync(path.dirname(target), { recursive: true });

function download(url) {
  https.get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) return download(res.headers.location);
    if (res.statusCode !== 200) throw new Error(`Download failed: HTTP ${res.statusCode}`);
    const file = fs.createWriteStream(target);
    res.pipe(file);
    file.on('finish', () => file.close(() => console.log(`Saved apps/${FILE}`)));
  });
}
download(URL);

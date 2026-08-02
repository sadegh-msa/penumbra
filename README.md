# Penumbra

Replace the new tab of Firefox/Chrome with a personal dashboard featuring desired pictures and inspirations.

## Development

```
git clone git@github.com:sadegh-msa/penumbra.git
cd penumbra
bun install
bun run build
```
### Firefox
To develop and test this plugin on Firefox, in the address bar go to
```about:debugging#/runtime/this-firefox```
Click on `Load Temporary Add-on` and choose the `dist/legacy/firefox/manifest.json` file. Now you can inspect, test, and reload the plugin.
### Google Chrome
To develop and test this plugin on Google Chrome, in the address bar go to
```chrome://extensions```
Click on `Load unpacked` and choose the `dist/legacy/chrome/manifest.json` file. Now you can see the details, errors, and test the extension.

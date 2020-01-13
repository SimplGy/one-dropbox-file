# One Dropbox File

> An app optimized for quick start and a one single use case: show you a dropbox file at the last place you scrolled to.

## Reference

* Dropbox Auth config for this app -- https://www.dropbox.com/developers/apps/info/0j861nb371f5ops
* Dropbox API Docs -- http://dropbox.github.io/dropbox-sdk-js/global.html
* Web app manifest Info -- https://developers.google.com/web/fundamentals/web-app-manifest

## Developing

It's all gloriously static, so just:

    serve .

For ssl (which you'll need to test a mobile device off localhost), first make a key:

    openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem

Then run with this, which looks for those default key and cert names:

    http-server -S .

This hosts at https://192.168.0.11:8080/, which is whitelisted by dropbox for this app, so you can test on a mobile or other device on your local network.

## Deploying

Github pages. Push to deploy.

## TODO

- [x] enable oauth flow
- [x] store token in localstorage?
- [x] scroll today's date `YYYY MM-DD`
- [x] cache the text file and lazy invalidate
- [x] Fix scrolling/selection in safari and mobile chrome
  - odd: in safari, the contents of the `<pre>` is just a string. In Chrome, it's alternating HtmlNodes (`<br>`) and TextNodes. I use innerText to insert. Very strange.
  - 
- [ ] lightweight mobile support (eg: manifest and icon)
- [ ] gracefully handle `http` -- right now, if you view the site on http, it appears to work but the oauth redirect fails, which is confusing

* option for pre-wrap, nowrap
* save last scroll position instead of always scrolling to today's `YYYY MM-DD`
* handle the empty state (eg: "add a text file like `Dropbox/OneTextFile/foo.txt` to see something here")
* support error and other messages that show up but don't replace the text
* detect "expired access token" and retrigger auth flow
# One Dropbox File

> An app optimized for quick start and a one single use case: show you a dropbox file at the last place you scrolled to.

## Developing

It's all gloriously static, so just:

    serve .

For ssl (which you'll need to test a mobile device off localhost), first make a key:

    openssl req -newkey rsa:2048      -nodes -x509 -days 3650 -keyout key.pem -out cert.pem -config req.cnf -sha256

Then run with this, which looks for those default key and cert names:

    http-server -S -c-1 .

This hosts at https://192.168.0.11:8080/, which is whitelisted by dropbox for this app, so you can test on a mobile or other device on your local network.

Run `webhint` linting (only works on non secure dev mode)

    http-server .
    npm run webhint ./.hintrc
    # or npm run webhint-prod ./.hintrc

View webhint results: http://localhost:8080/hint-report/http-localhost-8080/

## Deploying

Github pages. Push to deploy.

## Reference

* Dropbox Auth config for this app -- https://www.dropbox.com/developers/apps/info/0j861nb371f5ops
* Dropbox API Docs -- http://dropbox.github.io/dropbox-sdk-js/global.html
* Web app manifest Info -- https://developers.google.com/web/fundamentals/web-app-manifest
* PWAs on iOS -- https://www.netguru.com/codestories/few-tips-that-will-make-your-pwa-on-ios-feel-like-native
* PWAs on iOS 2 -- https://medium.com/@firt/progressive-web-apps-on-ios-are-here-d00430dee3a7
* self signed cert baloney -- https://stackoverflow.com/questions/43665243/invalid-self-signed-ssl-cert-subject-alternative-name-missing

## TODO

- [x] enable oauth flow
- [x] store token in localstorage?
- [x] scroll today's date `YYYY MM-DD`
- [x] cache the text file and lazy invalidate
- [x] Fix scrolling/selection in safari and mobile chrome
  - odd: in safari, the contents of the `<pre>` is just a string. In Chrome, it's alternating HtmlNodes (`<br>`) and TextNodes. I use innerText to insert, and this seems to be the root cause.
- [x] lightweight mobile support (eg: manifest and icon)
- [x] account for timezone when highlighting today
- [x] handle auth error cases
  - [x] malformed token -- { error: String }
  - [x] invalid token -- filesListFolder { error: { } }`error.error['.tag']` -> `invalid_access_token`
  - [x] missing token -- shows login. good.
- [x] loading indication
- [x] format .md as html
- [x] settings screen (double tap to see it)
- [x] store the content hash and use it to save a network request

- [ ] Abstract out the dropbox interface so it could be used in any web app
- [ ] webhint or lint if this is a "valid" pwa according to iOS (webworker?)
- [ ] get apple-touch-icon to work -- https://webhint.io/docs/user-guide/hints/hint-apple-touch-icons/
- [ ] gracefully handle `http` -- right now, if you view the site on http, it appears to work but the oauth redirect fails, which is confusing
- [ ] Service Worker registered with a fetch event handler (maybe needed to get localStorage to behave in iOS?)
- [ ] basic syntax highlighting?
- [ ] tappable phone numbers
- [ ] tappable addresses (gmaps)

- [ ] option for pre-wrap, nowrap
- [ ] handle the empty state (eg: "add a text file like `Dropbox/OneTextFile/foo.txt` to see something here")
- [ ] support error and other messages that show up but don't replace the text

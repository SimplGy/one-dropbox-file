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
* PWAs -- https://medium.com/appscope/designing-native-like-progressive-web-apps-for-ios-1b3cdda1d0e8
* self signed cert baloney -- https://stackoverflow.com/questions/43665243/invalid-self-signed-ssl-cert-subject-alternative-name-missing
* Apple docs on web apps -- https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html
* twitter thread on meh pwa support -- https://twitter.com/searls/status/1051459860192202755?lang=en

## TODO (Up Next)

- [ ] Fix URL and link in repo: www.simple.gy/one-dropbox-file is broken.
- [ ] Support choosing which file (or make it more obvious how to do that from the Dropbox UI.
  eg: link to the one file location in dropbox
- [ ] handle the empty state (eg: "add a text file like `Dropbox/OneTextFile/foo.txt` to see something here")

## Some Day

- [ ] Abstract out the dropbox interface (connect, error handling, file list, single file) so it could be used in any web app
- [ ] gracefully handle `http` -- right now, if you view the site on http, it appears to work but the oauth redirect fails, which is confusing
- [ ] search filter (show only lines that match "foo", also include the nearest parent heading if within k lines)
- [ ] tappable addresses (gmaps)
- [ ] support error and other messages that show up but don't replace the text
- [ ] press and hold for flyout options around your thumb -- table of contents, settings, search

## Needs Decision

- [ ] improve app icon (more spacing)
- [ ] basic syntax highlighting?
- [ ] font size option

## Done

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
- [x] fix bug: double tap for settings on mobile
- [x] bug: ios deletes token on every restart
  - root cause: I used safari "private mode" for developing to avoid caching issues. When I hit "add to home screen" the private mode behavior was sticky, resulting in always clearing all caches, including localstorage. oops.
- [x] Nice new app icon
- [x] dark mode
- [x] word wrap option
- [x] tappable phone numbers (text and call)
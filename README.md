# One Dropbox File

> An app optimized for quick start and a one single use case: show you a dropbox file at the last place you scrolled to.

## Reference

* Dropbox API -- http://dropbox.github.io/dropbox-sdk-js/global.html
* 

## Developing

It's all gloriously static, so just:

    serve .

## Deploying

Github pages. Push to deploy.

## TODO

- [x] enable oauth flow
- [x] store token in localstorage?
- [x] scroll today's date `YYYY MM-DD`
- [x] cache the text file and lazy invalidate

- [ ] lightweight mobile support (eg: manifest and icon)
- [ ] gracefully handle `http` -- right now, if you view the site on http, it appears to work but the oauth redirect fails, which is confusing

* option for pre-wrap, nowrap
* save last scroll position instead of always scrolling to today's `YYYY MM-DD`
* handle the empty state (eg: "add a text file like `Dropbox/OneTextFile/foo.txt` to see something here")
* support error and other messages that show up but don't replace the text
* detect "expired access token" and retrigger auth flow
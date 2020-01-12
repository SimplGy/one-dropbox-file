# One Dropbox File

> An app optimized for quick start and a one single use case: show you a dropbox file at the last place you scrolled to.

## Reference

* Dropbox API -- http://dropbox.github.io/dropbox-sdk-js/global.html
* 

## TODO

* enable oauth flow
* Make accessible via mobile
* option for pre-wrap, nowrap
* save last scroll position instead of always scrolling to today's `YYYY MM-DD`
* handle the empty state (eg: "add a text file like `Dropbox/OneTextFile/foo.txt` to see something here")
* support error and other messages that show up but don't replace the text
* detect "expired access token" and retrigger auth flow
* store token in localstorage?
* lightweight mobile support (eg: manifest and icon)
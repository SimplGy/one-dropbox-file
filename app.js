(() => {

  // This is the id for the OneFile application, not a user
  const clientId = '0j861nb371f5ops'; // https://www.dropbox.com/developers/apps/info/0j861nb371f5ops
  const ls = (key) => ({
    get: () => localStorage.getItem(key),
    set: (val) => localStorage.setItem(key, val),
  })
  const localToken = ls('dropboxAccessToken');
  const localText = ls('lastTextContents');

  let dbx;
  let lastScrollPosition;
  let lastTextContents;
  let $text; // display area for text file

  // When a file opens, focus on the text for today's date
  const today = getTodayAsText();
  const SCROLL_TO_REGEX = new RegExp(today.replace(/-/g, '[- ]')); // match "-" or " " in dates



  function main() {
    $text = document.getElementById('TextDisplay');

    // Do we have an access token in url or localstorage?  
    const params = parseLocation();
    const accessToken = params.access_token || localToken.get();
    
    // From https://github.com/dropbox/dropbox-sdk-js
    // https://dropbox.github.io/dropbox-sdk-js/tutorial-Authentication.html
    // accessToken
    dbx = new Dropbox.Dropbox({ accessToken, fetch, clientId });
    console.log({dbx});
    window.dbx = dbx; // for debugging
    
    if (accessToken == null) {
      requireDropboxLogin();
      return;
    } else {
      localToken.set(accessToken);
    }
    
    // Render the cached text
    render(localText.get());
    dbx.filesListFolder({path: ''})
      .then(resp => gotFiles(resp.entries))
      .catch(console.warn);
  }

  // async function isUserLoggedIn() {
  //   return false;
  // }

  function requireDropboxLogin() {
    const {origin, pathname} = window.location;
    const authUrl = dbx.getAuthenticationUrl(origin + pathname);
    const a = document.createElement('a');
    a.setAttribute('href', authUrl);
    a.className = 'btnLogin';
    a.innerText = 'Log In with Dropbox';
    $text.replaceWith(a);
  }

  // get useful kvps from window.location.hash
  function parseLocation() {
    const str = window.location.hash.slice(1); // the first char is '#'
    const data = str.split('&').map(kv => kv.split('='));
    const kvp = data.reduce((prev, [k, v]) => ({
      ...prev,
      ...{[k]: v}
    }), {});
    return kvp;
  }

  function gotFiles(entries = []) {
    console.log('gotFiles', entries)
    const textFiles = entries.filter(f => f.name.endsWith('.md') || f.name.endsWith('.txt'))
    const file = textFiles[0]

    dbx.filesDownload({path: file.path_lower})
      .then(gotOneFile)
      .catch(console.warn);
  }

  // We got a downloaded file with blob from Dropbox, so use it
  async function gotOneFile(file = {}) {
    const text = await file.fileBlob.text();
    render(text);
  }

  function render(text) {
    if (text == null) return;

    // noop if text already matches
    if (text === lastTextContents) return console.log('skipping render, text already matches');

    lastTextContents = text;
    localText.set(lastTextContents);

    $text.innerText = text;
    highlightAndScrollTo(SCROLL_TO_REGEX);
  }

  // () => "2020-01-12"
  function getTodayAsText() {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }

  function highlightAndScrollTo(regex) {

    // Find the text node that contains this regex
    const kids = Array.from($text.childNodes);
    const $match = kids
      .filter(n => n.wholeText)
      .find(n => n.wholeText.search(regex) >= 0);
    if ($match == null) return;

    // Select the entire node
    const range = document.createRange();
    range.setStart($match, 0);
    range.setEnd($match, $match.wholeText.length);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // Scroll to that element (or as near to as possible)
    scrollTo($match);
  }

  // This is annoying, but you can't scrollIntoView on a text node.
  // So find the nearest element with this method and scroll to that:
  function scrollTo(node, {behavior = 'smooth'} = {}) {
    if (node == null) return;
    if (node.scrollIntoView == null) return scrollTo(node.previousSibling);
    node.scrollIntoView({behavior, block: 'center'});
  }

  // function dropboxErr(error) {
  //   console.log(error);
  //     switch (error.status) {
  //         case 401:
  //             // If you're using dropbox.js, the only cause behind this error is that
  //             // the user token expired.
  //             // Get the user through the authentication flow again.
  //             console.log('dropboxErr 401')
  //             // this.showMessage('Looks like your session expired. No worries, you can keep playing by connecting to Dropbox again.')
  //             break;
  //         case 404:
  //             // The file or folder you tried to access is not in the user's Dropbox.
  //             // Handling this error is specific to your application.
  //             //this.dropbox.writeFile(_fileName, _initialContent, function(err, stat){
  //             //    if (err) { this.dropboxErr.call(this, err); return }
  //             //    console.log('Created a new todo file successfully')
  //             //})
  //             console.log('dropboxErr 404')
  //             break;
  //         case 507:
  //             console.log('dropboxErr 507')
  //             // The user is over their Dropbox quota.
  //             // Tell them their Dropbox is full. Refreshing the page won't help.
  //             // this.showMessage('Your Dropbox quota is full. Bummer.', null, 'error')
  //             break;
  //         case 503:
  //             console.log('dropboxErr 503')
  //             // Too many API requests. Tell the user to try again later.
  //             // Long-term, optimize your code to use fewer API calls.
  //             // this.showMessage('Too Many API requests. Try again later, please.', null, 'warn')
  //             break;

  //         case 400:  // Bad input parameter
  //         case 403:  // Bad OAuth request.
  //             console.log('dropboxErr 403')
  //             // this.showMessage('A Dropbox connection lets us save things for you. Please allow us to link to Dropbox.', 'error')
  //             break;
  //         case 405:  // Request method not expected
  //             break;
  //         default:
  //         // Caused by a bug in dropbox.js, in your application, or in Dropbox.
  //         // Tell the user an error occurred, ask them to refresh the page.
  //     }
  // }




  // Publicize
  window.OneFile = window.OneFile || {}
  window.OneFile.App = {
    main,
    dbx: () => dbx,
  }

})();

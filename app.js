(() => {

  // This is the id for the OneFile application, not a user
  const clientId = '0j861nb371f5ops'; // https://www.dropbox.com/developers/apps/info/0j861nb371f5ops

  // LocalStorage Helpers
  const ls = key => ({
    get: () => localStorage.getItem(key),
    set: (val) => localStorage.setItem(key, val),
    remove: () => localStorage.removeItem(key),
  })
  const localToken = ls('dropboxAccessToken');
  const localText = ls('lastTextContents');
  const localContentHash = ls('lastTextContentHash');
  const localRenderMarkdown = ls('render-markdown');
  const localWrapLines = ls('pre-wrap');
  const localDarkMode = ls('dark-mode');

  // What may separate phone number parts?
  // dash, space, dot, or nothing
  const delim = '[-\\s\\.]?';

  const countryCode = `(1${delim}|\\+1${delim}|)`;

  // Optional parens, starts with 1-9, has 2 other digits
  // matches: (850), 850
  // not: 123
  const areaCode = '\\(?[1-9]\\d{2}\\)?';

  const phoneRegex = new RegExp(
    countryCode +
    areaCode +
    delim +
    '\\d{3}' +
    delim +
    '\\d{4}'
    , 'g' // global
  );

  const decoratePhoneNumbers = (str) =>
    str.replace(phoneRegex, (phoneStr) => {
      // get only the phone number digits from the matching phone number string
      const num = phoneStr.replace(new RegExp(delim, 'g'), '');
      return `<a href="tel:${num}">${phoneStr}</a> (<a href="sms:${num}">text</a>)`
    }); 

  // Set up operations that decorate text/html
  // run before converting md to html
  const processText = [
    decoratePhoneNumbers,
  ];

  // Cookie Helpers
  const cookie = key => ({
    get: () => {
      const all = document.cookie || ''; // mashup of all cookies on document
      const kvp = all.split(';')
        .map(s => s.trim())
        .find(s => s.indexOf(key) === 0);
      if (kvp == null) return undefined;
      return kvp.split('=').pop();
    },
    set: (val) => {
      document.cookie = `${key}=${val}`; // document.cookie automatically finds and updates the right cookie
    },
  });
  const cookieToken = cookie('dropboxAccessToken');

  let dbx;
  let lastTextContents;
  let $text; // display area for text file

  // When a file opens, focus on the text for today's date
  const today = getTodayAsText();
  const SCROLL_TO_REGEX = new RegExp(today.replace(/-/g, '[- ]')); // match "-" or " " in dates



  function main() {
    $text = document.getElementById('TextDisplay');

    document.addEventListener('doubleTap', onDoubleTap);

    // Do we have an access token in url or localstorage?  
    const params = parseLocation();
    const accessToken = params.access_token || localToken.get() || cookieToken.get();
    
    // From https://github.com/dropbox/dropbox-sdk-js
    // https://dropbox.github.io/dropbox-sdk-js/tutorial-Authentication.html
    // accessToken
    dbx = new Dropbox.Dropbox({ accessToken, fetch, clientId });
    window.dbx = dbx; // for debugging
    
    if (accessToken == null) {
      MsgBar.show('No access token found');
      requireDropboxLogin();
      return;
    } else {
      localToken.set(accessToken);
      cookieToken.set(accessToken);
      clearUrlParams();
    }
    
    // Render the cached text
    render(localText.get());
    
    // Fetch the list of text files
    Thinker.show();
    dbx.filesListFolder({path: ''})
      .then(resp => gotFiles(resp.entries))
      .catch(gotErr('filesListFolder'));
  }

  const gotErr = (tag = '') => (err) => {
    Thinker.hide();
    const errMsg = textFromError(err);
    const errTag = tagFromError(err);
    const statusCode = statusFromError(err);
    const msg = `${tag} ${errMsg}`;
    MsgBar.show(msg, {type: 'error', data: err});


    if (errTag === 'invalid_access_token') {
      resetAuth();
      return;
    }
    if (errMsg && errMsg.includes("access token is malformed")) {
      resetAuth();
      return;
    }
    // User token expired? Or another permission issue.
    if (statusCode == 401) { // coerce string<>number on purpose
      resetAuth();
      return;
    }

    // TODO:
    //     switch (error.status) {
    //         case 507: // The user is over their Dropbox quota.
    //         case 503: // Too many API requests. Tell the user to try again later.
    //         case 400:  // Bad input parameter
    //         case 403:  // Bad OAuth request.
  }

  const statusFromError = ({response} = {}) => (response || {}).status;
  
  const textFromError = (err = {}) => {
    if (typeof err === 'string') return err;
    if (typeof err.message === 'string') return err.message; // normal js stack trace error
    const { error = {} } = err;
    if (typeof error === 'string') return error;
    return error.message || error.error_summary // dropbox api error.
  }

  const tagFromError = ({error} = {}) => {
    if (error == null) return;
    if (error.error == null) return;
    return error.error['.tag']; // a dropbox concept
  };

  function resetAuth() {
    localToken.remove();
    cookieToken.set('');
    requireDropboxLogin();
  }

  function requireDropboxLogin() {
    const {origin, pathname} = window.location;
    const authUrl = dbx.getAuthenticationUrl(origin + pathname);
    const a = document.createElement('a');
    a.setAttribute('href', authUrl);
    a.className = 'btn btnLogin';
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

  function clearUrlParams() {
    history.replaceState({}, document.title, '.');  // `.` to keep url
  }

  function gotFiles(entries = []) {
    Thinker.hide();
    console.log(`gotFiles()`, entries);
    const textFiles = entries.filter(f => f.name.endsWith('.md') || f.name.endsWith('.txt'));
    const file = textFiles[0];

    if (file.content_hash === localContentHash.get()) {
      console.log('file.content_hash === localContentHash.get(), no need to fetch the file.');
      return;
    }

    Thinker.show();
    dbx.filesDownload({path: file.path_lower})
      .then(gotOneFile)
      .catch(gotErr('filesDownload'));
  }

  // We got a downloaded file with blob from Dropbox, so use it
  async function gotOneFile(file = {}) {
    Thinker.hide();
    
    // const text = await blob.text(); // Don't use: fileBlob.text() is basically chrome only right now in 2020
    const text = await stringFrom(file.fileBlob);
    render(text);
    lastTextContents = text;
    localText.set(lastTextContents);
    localContentHash.set(file.content_hash);
  }

  async function stringFrom(blob) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.addEventListener('load', () => {
        resolve(fr.result);
      });
      fr.readAsText(blob);
    });
  }

  function render(text, {force} = {}) {
    if (text == null) return;

    // noop if text already matches
    if (!force && text === lastTextContents) return; //console.log('skipping render, text already matches');

    document.body.classList.toggle('dark', localDarkMode.get());
    $text.classList.toggle('wrap', localWrapLines.get());
    $text.classList.toggle('md', localRenderMarkdown.get());

    // User Preference: Show as rendered html
    if (localRenderMarkdown.get()) {
      processText.forEach(fn => text = fn(text));
      $text.innerHTML = marked(text);
    
    // User Preference: Show as plain text
    } else {
      // $text.innerText = text; // if you set innerText, chrome adds <br>s but safari doesn't (wat)
      // if you set textContent, no nodes are added so there's nothing to scrollTo
      // Instead: Convert each line of text to a `p` tag
      // for simple line management and browser scrollTo
      // Convert empty strings to a single space because empty `p` tags collapse
      let htmlStr = text.split('\n').map(s => `<p>${s || ' '}</p>`).join('');
      processText.forEach(fn => htmlStr = fn(htmlStr));
      $text.innerHTML = htmlStr;
    }

    highlightAndScrollTo(SCROLL_TO_REGEX);
  }

  const renderAgain = () => render(localText.get(), {force: true});

  // () => "2020-01-12"
  // locale specific
  function getTodayAsText() {
    const date = new Date();
    const YYYY = date.getFullYear();
    // Get months and days. Add leading zeros.
    const M = withLeadingZero(date.getMonth() + 1); // js is 0 indexed on months. locale month.
    const D = withLeadingZero(date.getDate()); // according to locale time
    return `${YYYY}-${M}-${D}`;
  }

  function withLeadingZero(n) {
    return String(n).padStart(2, '0');
  }

  function highlightAndScrollTo(regex) {

    // Find the text node that contains this regex
    const kids = Array.from($text.childNodes);
    const $match = kids
      .find(n => n.textContent.search(regex) >= 0);
    if ($match == null) return;

    // "highlight" the entire matching element
    $match.classList.add('highlight');

    // Scroll to that element (or as near to as possible)
    scrollTo($match);
  }

  function scrollTo(node, {behavior = 'smooth'} = {}) {
    if (node == null) return;
    setTimeout(() => {
      // MsgBar.show(`scrollTo <${node.tagName}>`);
      node.scrollIntoView({behavior, block: 'center'});
    }, 200); // give safari time to render
  }

  function onDoubleTap() {
    console.log('onDoubleTap');
    Settings.show();
  }



  // Publicize
  window.App = {
    main,
    dbx: () => dbx,
    getTodayAsText,
    renderAgain,
  }

})();

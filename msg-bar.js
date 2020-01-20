// Shows user-facing, temporary messages.
// used for error or status updates.
// usage:
// MsgBar.show('hello there');
(()=>{

  // config
  const seconds = 1000;
  const duration = 10 * seconds;
  const className = 'msg-bar';
  const containerClassName = 'msg-bar-container';
  let container;
  
  function setup() {
    const el = document.createElement('aside');
    el.className = containerClassName
    document.body.appendChild(el);
    return el;
  }

  const makeEl = (msg, type = '') => {
    const el = document.createElement('output');
    el.className = `${className} ${type}`;
    el.innerText = msg;
    return el;
  };

  function show(msg, {type, data} = {}) {
    console.log(`msg-bar.js show('${msg}')`, data);

    // Add a message
    const el = makeEl(msg, type);
    if (container == null) {
      container = setup();
    }
    container.appendChild(el);

    // Remove it later
    setTimeout(() => el.parentElement.removeChild(el), duration);
  }

  window.MsgBar = {
    show,
  };
})();
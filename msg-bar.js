(()=>{

  // config
  const seconds = 1000;
  const duration = 10 * seconds;
  const className = 'msg-bar';
  const containerClassName = 'msg-bar-container';
  let container;

  // shift messages off the front when rendering
  // const q = [];
  // let isShowing = false;
  
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

  // function tick() {
  //   if (isShowing) return;
  //   const msg = q.shift();

  //   addBar(msg);
  //   isShowing = true;

  //   setTimeout(() => {
  //     rmBars();
  //     tick();
  //   }, duration);
  // }

  // function rmBars() {
  //   if (container == null) return;

  //   while(container.firstChild) {
  //     container.removeChild(container.firstChild);
  //   }
  //   isShowing = false;
  // }

  








  window.MsgBar = {
    show,
  };
})();
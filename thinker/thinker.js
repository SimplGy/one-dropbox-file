(() => {

  const className = 'thinker';
  let el;

  function show() {
    console.log('Thinker.show()');
    if (el == null) {
      el = setup(); // one
    }
    el.classList.add('show');
  }
  function hide() {
    if (el == null) return;
    el.classList.remove('show');
  }

  function setup() {
    const el = document.createElement('aside');
    el.className = className
    el.innerText = '🌀';
    document.body.appendChild(el);
    return el;
  }

  window.Thinker = {
    show,
    hide,
  };
})();
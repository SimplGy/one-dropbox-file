// Shows a little "spinner" thinking indication in the top right corner.
// Usage:
// Thinker.show();
// Thinker.hide();
(() => {

  const className = 'thinker';
  let el;

  function show() {
    if (el == null) {
      el = setup(); // one time
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
(() => {

  let container;


  function show() {
    if (container == null) container = setup();
    container.classList.add('show');
  }

  function hide() {
    container.classList.remove('show');
  }
  
  function setup() {
    const el = document.createElement('div');
    el.className = 'settings';
    el.innerText = 'this is the settings pane';
    document.body.appendChild(el);

    const btn = document.createElement('a');
    btn.href = "javascript:void(0);";
    btn.className = 'btn';
    btn.innerText = "Close";
    btn.addEventListener('click', hide);

    el.appendChild(btn);

    return el;
  }

  window.Settings = {
    show,
  };
})();
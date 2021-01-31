(() => {

  let container;

  // LocalStorage Helpers
  const ls = (key) => ({
    get: () => localStorage.getItem(key),
    set: (val) => localStorage.setItem(key, val),
    remove: () => localStorage.removeItem(key),
    toggle: () => {
      const val = localStorage.getItem(key);
      if (val) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, true);
      }
    },
  })

  const settings = [
    {
      title: 'Render Markdown',
      id: 'render-markdown',
      ls: ls('render-markdown'),
    },
    {
      title: 'Wrap Lines',
      id: 'wrap-lines',
      ls: ls('pre-wrap'),
    },
    {
      title: 'Dark Mode',
      id: 'dark-mode',
      ls: ls('dark-mode'),
    },
  ];

  const makeSettingCheckbox = ({id, title, ls} = {}) => {
    const el = document.createElement('p');
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('name', id);
    input.checked = ls.get();
    input.addEventListener('change', ls.toggle);
    label.innerText = title;
    label.prepend(input);
    el.appendChild(label);
    return el;
  }

  function show() {
    if (container == null) container = setup();
    container.classList.add('show');
  }

  function hide() {
    container.classList.remove('show');
    if (App && App.renderAgain) App.renderAgain();
  }
  
  function setup() {
    const el = document.createElement('div');
    el.className = 'settings';
    
    el.innerHTML = `
    <header>
      <figure class="wrapper">
        <img src="gfx/one-file-title-180.png" title="One File" alt="One File App Logo"/>
        <h2>Settings</h2>
      </figure>
    </header>
    `;
    settings
      .map(makeSettingCheckbox)
      .forEach(checkbox => el.appendChild(checkbox));

    // Info message
    const p = document.createElement('p');
    p.className = 'muted';
    p.innerText = `To change the file, use this location: Dropbox/Apps/OneTextFile`;
    el.appendChild(p);

    const btn = document.createElement('a');
    btn.href = "javascript:void(0);";
    btn.className = 'btn';
    btn.innerText = "Close";
    btn.addEventListener('click', hide);

    
    el.appendChild(btn);
    document.body.appendChild(el);
    return el;
  }

  window.Settings = {
    show,
  };
})();
(() => {

  const DOUBLE_TAP = 'doubleTap';

  function observeDoubleTap() {
    const speed = 500; // ms
    const evt = new Event(DOUBLE_TAP);
    let alreadyTapped = false
    document.addEventListener('click', () => {
      if (alreadyTapped) {
        alreadyTapped = false;
        document.dispatchEvent(evt);
        return;
      }
      alreadyTapped = true;
      setTimeout(() => {
        alreadyTapped = false;
      }, speed);
    });
  }

  // on by default
  observeDoubleTap();

  window.TapEvents = {
    observeDoubleTap,
  };
})();
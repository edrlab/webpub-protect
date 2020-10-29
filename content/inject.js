console.log('INJECT');
window.addEventListener('load', () => {
  console.log(`window load: ${document.readyState}`);
});
document.addEventListener('readystatechange', () => {
  console.log(`readystatechange: ${document.readyState}`);
});

document.addEventListener('DOMContentLoaded', () => {
  console.log(`DOMContentLoaded: ${document.readyState}`);

  setTimeout(() => {
    document.body.replaceWith(
      new DOMParser().parseFromString(atob(window.__BODY__), 'text/html').body,
    );
    setTimeout(() => {
      // document.getElementById('location').textContent = window.location.href;

      window.addEventListener('selectstart', (evt) => {
        evt.preventDefault();
      });

      const bodyStyle = document.body.getAttribute('style') || '';
      document.body.setAttribute(
        'style',
        bodyStyle +
          '-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;',
      );

      document.body.addEventListener('copy', (evt) => {
        evt.preventDefault();
        const selection = document.getSelection();
        if (selection) {
          const str = selection.toString();
          if (str) {
            alert(`Clipboard copy PREVENTED: "${str}"`);
          }
        }
        document.getSelection().empty();
      });

      document.body.addEventListener('contextmenu', (evt) => {
        evt.preventDefault();
      });

      document.body.addEventListener('dragstart', (evt) => {
        evt.preventDefault();
      });

      document.querySelectorAll('a').forEach((aEl) => {
        aEl.setAttribute('data-href', aEl.getAttribute('href'));
        aEl.setAttribute('data-href-resolved', aEl.href);
        aEl.setAttribute('href', '/#');
        aEl.addEventListener('click', (ev) => {
          ev.preventDefault();
          const href = ev.currentTarget.getAttribute('data-href-resolved');
          // this doesn't forward HTTP referer!
          // location.href = href;
          // location.replace(href);
          const newAEl = document.createElement('a');
          newAEl.setAttribute('href', href);
          newAEl.click();
        });
      });
    }, 100);
  }, 100);
});
